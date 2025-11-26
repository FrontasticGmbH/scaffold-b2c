import React, { useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { AccountContext } from 'context/account';
import useAddressValidationSchema from 'helpers/hooks/useAddressValidationSchema';
import useI18n from 'helpers/hooks/useI18n';
import useProcessing from 'helpers/hooks/useProcessing';
import { isOnlyCountryFilled } from 'helpers/utils/fieldsCheck';
import { Cart } from 'types/entity/cart';
import { CartDetails } from 'frontastic/hooks/useCart/types';
import AccountAddresses from './components/account-addresses';
import AddressForm from './components/address-form';
import useMappers from './hooks/useMappers';
import { Address } from './types';
import CreateAddress from '../../../create-address';

export interface Props {
  isCompleted: boolean;
  onUpdateCart?: (payload: CartDetails) => Promise<Cart>;
  goToNextStep: () => void;
  goToReview: () => void;
  cart?: Cart;
}

const Addresses: React.FC<Props> = ({ isCompleted, goToNextStep, goToReview, onUpdateCart, cart }) => {
  const translate = useTranslations();

  const {
    account,
    loggedIn,
    shippingAddresses,
    defaultShippingAddress,
    defaultBillingAddress,
    addShippingAddress,
    addBillingAddress,
  } = useContext(AccountContext);

  const { addressToAccountAddress, accountAddressToAddress } = useMappers();
  const addressValidationSchema = useAddressValidationSchema();

  const [createAddressType, setCreateAddressType] = useState<'shipping' | 'billing'>();
  const [addressDefaults, setAddressDefaults] = useState({ shipping: false, billing: false });

  const { country } = useI18n();

  const initialAddressData: Address = useMemo(
    () => ({
      addressId: '',
      firstName: '',
      lastName: '',
      email: '',
      streetName: '',
      line1: '',
      streetNumber: '',
      postalCode: '',
      city: '',
      country,
    }),
    [country],
  );

  const [sameShippingAddress, setSameShippingAddress] = useState<boolean>(!cart?.billingAddress);

  const resolvedDefaultShipping: Address = useMemo(() => {
    if (cart?.shippingAddress) {
      const addr = cart.shippingAddress as Address;
      return { ...addr, email: cart.email ?? addr.email };
    }
    if (defaultShippingAddress) return accountAddressToAddress(defaultShippingAddress);
    return initialAddressData;
  }, [cart?.shippingAddress, cart?.email, defaultShippingAddress, accountAddressToAddress, initialAddressData]);

  const resolvedDefaultBilling: Address = useMemo(() => {
    if (cart?.billingAddress) {
      const addr = cart.billingAddress as Address;
      return { ...addr, email: cart.email ?? addr.email };
    }
    if (defaultBillingAddress) return accountAddressToAddress(defaultBillingAddress);
    return initialAddressData;
  }, [cart?.billingAddress, cart?.email, defaultBillingAddress, accountAddressToAddress, initialAddressData]);

  const {
    register: registerShippingInput,
    watch: getShippingValues,
    formState: { errors: shippingErrors },
    reset: setShippingAddress,
  } = useForm<Address>({
    defaultValues: resolvedDefaultShipping,
    mode: 'onBlur',
    resolver: yupResolver(addressValidationSchema),
    context: {
      loggedIn,
    },
  });

  const {
    register: registerBillingInput,
    watch: getBillingValues,
    formState: { errors: billingErrors },
    reset: setBillingAddress,
  } = useForm<Address>({
    defaultValues: resolvedDefaultBilling,
    mode: 'onBlur',
    resolver: yupResolver(addressValidationSchema),
    context: {
      loggedIn,
    },
  });

  useEffect(() => {
    setShippingAddress(resolvedDefaultShipping);
  }, [resolvedDefaultShipping, setShippingAddress]);

  useEffect(() => {
    setBillingAddress(resolvedDefaultBilling);
  }, [resolvedDefaultBilling, setBillingAddress]);

  const shippingAddress = getShippingValues();
  const billingAddress = getBillingValues();

  const currentBillingAddress = sameShippingAddress ? shippingAddress : billingAddress;

  const isValidShippingAddress = useMemo(() => {
    try {
      addressValidationSchema.validateSync(shippingAddress, { context: { loggedIn } });
      return true;
    } catch {
      return false;
    }
  }, [shippingAddress, addressValidationSchema, loggedIn]);

  const isValidBillingAddress = useMemo(() => {
    try {
      addressValidationSchema.validateSync(currentBillingAddress, { context: { loggedIn } });
      return true;
    } catch {
      return false;
    }
  }, [currentBillingAddress, addressValidationSchema, loggedIn]);

  const disabled = sameShippingAddress ? !isValidShippingAddress : !isValidBillingAddress || !isValidShippingAddress;

  const { processing, startProcessing, stopProcessing } = useProcessing();

  const submit = async () => {
    startProcessing();

    const data = {
      account: { email: account?.email || getShippingValues('email') || currentBillingAddress.email },
      shipping: { ...addressToAccountAddress(getShippingValues()), isDefaultShippingAddress: addressDefaults.shipping },
      billing: { ...addressToAccountAddress(currentBillingAddress), isDefaultBillingAddress: addressDefaults.billing },
    } as CartDetails;

    const res = await onUpdateCart?.(data);

    stopProcessing();

    if (res?.cartId) {
      if (isCompleted) goToReview();
      else goToNextStep();
    } else toast.error(translate('checkout.update-addresses-error'), { position: 'bottom-left' });
  };

  const onSelectShippingAddress = useCallback(
    (address: Address) => {
      setShippingAddress(address);
    },
    [setShippingAddress],
  );

  const onSelectBillingAddress = useCallback((address: Address) => setBillingAddress(address), [setBillingAddress]);
  const onRequestAddAddress = useCallback(
    (addressType: 'shipping' | 'billing') => setCreateAddressType(addressType),
    [],
  );

  const shippingIsSameAsInitial = isOnlyCountryFilled(shippingAddress);
  const billingIsSameAsInitial = isOnlyCountryFilled(billingAddress);

  const shippingAddressHasError = !isValidShippingAddress && !shippingIsSameAsInitial;
  const billingAddressHasError = !isValidBillingAddress && !billingIsSameAsInitial;

  return (
    <div>
      {loggedIn &&
        (shippingAddresses.length > 0 ? (
          <>
            {!!createAddressType ? (
              <CreateAddress
                onSelectShippingAddress={onSelectShippingAddress}
                onSelectBillingAddress={onSelectBillingAddress}
                addressType={createAddressType}
                onAfterSubmit={() => setCreateAddressType(undefined)}
              />
            ) : (
              <AccountAddresses
                onSelectShippingAddress={onSelectShippingAddress}
                onSelectBillingAddress={onSelectBillingAddress}
                onRequestAddAddress={onRequestAddAddress}
                shippingAddress={shippingAddress}
                billingAddress={currentBillingAddress}
                shippingAddressHasError={shippingAddressHasError}
                billingAddressHasError={billingAddressHasError}
              />
            )}
          </>
        ) : (
          <div>
            <p className="pb-32 text-sm font-semibold uppercase">{translate('checkout.shipping-address')}</p>

            <AddressForm
              address={shippingAddress}
              onSubmit={submit}
              errors={shippingErrors}
              register={registerShippingInput}
            />

            <div className="mt-13 flex flex-col gap-12 md:flex-row md:items-center">
              <Checkbox
                label={translate('checkout.save-as-default-shipping')}
                labelPosition="on-right"
                checked={addressDefaults.shipping}
                onChange={({ checked }) => setAddressDefaults((prev) => ({ ...prev, shipping: checked }))}
              />
            </div>

            <div className="mt-40">
              <p className="mb-16 text-sm font-semibold uppercase">{translate('checkout.billingAddress')}</p>
              <Checkbox
                label={translate('checkout.billingDetailsLabel')}
                labelPosition="on-right"
                checked={sameShippingAddress}
                onChange={({ checked }) => setSameShippingAddress(checked)}
                containerClassName="mb-16"
              />
            </div>
            {!sameShippingAddress && (
              <AddressForm address={billingAddress} register={registerBillingInput} errors={billingErrors}>
                <div className="mt-16">
                  <Checkbox
                    label={translate('checkout.save-as-default-billing')}
                    labelPosition="on-right"
                    checked={addressDefaults.billing}
                    onChange={({ checked }) => setAddressDefaults((prev) => ({ ...prev, billing: checked }))}
                  />
                </div>
              </AddressForm>
            )}

            <div className="mt-32 flex justify-end gap-12">
              <Button
                variant="primary"
                className="px-48"
                loading={processing}
                onClick={async () => {
                  if (disabled) return;

                  startProcessing();

                  const isDefaultBillingAddress = addressDefaults.billing;
                  const isDefaultShippingAddress = addressDefaults.shipping;

                  try {
                    await addShippingAddress({
                      ...addressToAccountAddress(shippingAddress),
                      isDefaultShippingAddress,
                    });

                    await addBillingAddress({
                      ...addressToAccountAddress(currentBillingAddress),
                      isDefaultBillingAddress,
                    });

                    const cartAddress = {
                      shipping: {
                        ...addressToAccountAddress(shippingAddress),
                        isDefaultShippingAddress,
                      },
                      billing: {
                        ...addressToAccountAddress(currentBillingAddress),
                        isDefaultBillingAddress,
                      },
                    };
                    await onUpdateCart?.(cartAddress);

                    stopProcessing();
                    goToNextStep();
                  } catch {
                    toast.error(translate('error.wentWrong'));
                    stopProcessing();
                  }
                }}
                disabled={disabled}
              >
                {translate('cart.continue-to')} <span className="lowercase">{translate('cart.shipping')}</span>
              </Button>
            </div>
          </div>
        ))}

      {!loggedIn && (
        <div>
          <p className="pb-32 text-14 font-semibold uppercase">{translate('checkout.shipping-address')}</p>

          <AddressForm
            register={registerShippingInput}
            address={shippingAddress}
            errors={shippingErrors}
            onSubmit={submit}
          />

          <div className="mt-28 flex items-center gap-12 p-2">
            <Checkbox
              label={translate('checkout.billingDetailsLabel')}
              labelPosition="on-right"
              checked={sameShippingAddress}
              onChange={({ checked }) => setSameShippingAddress(checked)}
            />
          </div>

          {!sameShippingAddress && (
            <div className="mt-48">
              <p className="pb-32 text-14 font-semibold uppercase">{translate('checkout.billingAddress')}</p>
              <AddressForm
                address={billingAddress}
                errors={billingErrors}
                register={registerBillingInput}
                onSubmit={submit}
              />
            </div>
          )}
        </div>
      )}

      {!createAddressType && (!loggedIn || shippingAddresses.length > 0) && (
        <div className="mt-28 md:mt-36 lg:mt-45">
          <div className="flex items-center justify-end gap-12">
            {isCompleted && (
              <Button variant="secondary" onClick={goToReview}>
                {translate('common.cancel')}
              </Button>
            )}
            <Button
              variant="primary"
              className="w-full min-w-200 md:text-16 lg:w-fit lg:px-36"
              disabled={disabled}
              loading={processing}
              type="submit"
              onClick={submit}
            >
              {isCompleted ? (
                translate('checkout.save-and-review-order')
              ) : (
                <>
                  {translate('cart.continue-to')} <span className="lowercase">{translate('cart.shipping')}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
