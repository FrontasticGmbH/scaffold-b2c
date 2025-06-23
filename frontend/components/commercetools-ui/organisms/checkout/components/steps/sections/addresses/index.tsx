import React, { useContext, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import * as yup from 'yup';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { AccountContext } from 'context/account';
import useI18n from 'helpers/hooks/useI18n';
import useProcessing from 'helpers/hooks/useProcessing';
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
}

const addressValidationSchema = yup
  .object()
  .shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().optional(),
    line1: yup.string().required(),
    line2: yup.string().optional(),
    postalCode: yup.string().required(),
    city: yup.string().required(),
  })
  .required();

const Addresses: React.FC<Props> = ({ isCompleted, goToNextStep, goToReview, onUpdateCart }) => {
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

  const [createAddressType, setCreateAddressType] = useState<'shipping' | 'billing'>();

  const { country } = useI18n();

  const initialAddressData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    postalCode: '',
    city: '',
    country,
  } as Address;

  const [sameShippingAddress, setSameShippingAddress] = useState(!loggedIn);

  const {
    register: registerShippingInput,
    watch: getShippingValues,
    formState: { errors: shippingErrors },
    reset: setShippingAddress,
    setValue: setShippingValue,
  } = useForm<Address>({
    defaultValues: defaultShippingAddress ? accountAddressToAddress(defaultShippingAddress) : initialAddressData,
    mode: 'onBlur',
  });

  const {
    register: registerBillingInput,
    watch: getBillingValues,
    formState: { errors: billingErrors },
    reset: setBillingAddress,
    setValue: setBillingValue,
  } = useForm<Address>({
    defaultValues: defaultBillingAddress ? accountAddressToAddress(defaultBillingAddress) : initialAddressData,
    mode: 'onBlur',
  });

  const shippingAddress = getShippingValues();
  const billingAddress = getBillingValues();
  const currentBillingAddress = sameShippingAddress ? shippingAddress : billingAddress;

  const validateState = (inputAddress: Address) => {
    const stateIsRequired = ['US', 'CA'].includes(inputAddress.country);
    return stateIsRequired ? !!inputAddress.state : true;
  };

  const isValidShippingAddress = useMemo(() => {
    try {
      addressValidationSchema.validateSync(shippingAddress);
      return validateState(shippingAddress);
    } catch {
      return false;
    }
  }, [shippingAddress]);

  const isValidBillingAddress = useMemo(() => {
    try {
      addressValidationSchema.validateSync(currentBillingAddress);
      return validateState(currentBillingAddress);
    } catch {
      return false;
    }
  }, [currentBillingAddress]);

  const disabled = sameShippingAddress ? !isValidShippingAddress : !isValidBillingAddress || !isValidShippingAddress;

  const { processing, startProcessing, stopProcessing } = useProcessing();

  const submit = async () => {
    startProcessing();

    const data = {
      account: { email: account?.email || getShippingValues('email') || currentBillingAddress.email },
      shipping: addressToAccountAddress(getShippingValues()),
      billing: addressToAccountAddress(currentBillingAddress),
    } as CartDetails;

    const res = await onUpdateCart?.(data);

    stopProcessing();

    if (res?.cartId) {
      if (isCompleted) goToReview();
      else goToNextStep();
    } else toast.error(translate('checkout.update-addresses-error'), { position: 'bottom-left' });
  };
  const onSelectShippingAddress = useCallback((address: Address) => setShippingAddress(address), []);
  const onSelectBillingAddress = useCallback((address: Address) => setBillingAddress(address), []);
  const onRequestAddAddress = useCallback(
    (addressType: 'shipping' | 'billing') => setCreateAddressType(addressType),
    [],
  );
  return (
    <div>
      {loggedIn &&
        (shippingAddresses.length > 0 ? (
          <>
            {!!createAddressType ? (
              <CreateAddress addressType={createAddressType} onAfterSubmit={() => setCreateAddressType(undefined)} />
            ) : (
              <AccountAddresses
                onSelectShippingAddress={onSelectShippingAddress}
                onSelectBillingAddress={onSelectBillingAddress}
                onRequestAddAddress={onRequestAddAddress}
                shippingAddressHasError={!isValidShippingAddress}
                billingAddressHasError={!isValidBillingAddress}
              />
            )}
          </>
        ) : (
          <div>
            <h5 className="pb-32 text-14 font-semibold uppercase">{translate('checkout.deliveryAddress')}</h5>

            <AddressForm
              address={shippingAddress}
              onSubmit={submit}
              errors={shippingErrors}
              register={registerShippingInput}
              setValue={setShippingValue}
            />

            <div className="mt-28 flex items-center gap-12 p-2">
              <Checkbox
                label={translate('checkout.billingDetailsLabel')}
                labelPosition="on-right"
                checked={sameShippingAddress}
                onChange={({ checked }) => setSameShippingAddress(checked)}
                disableBackground
              />
            </div>

            {!sameShippingAddress && (
              <div className="mt-48">
                <h5 className="pb-32 text-14 font-semibold uppercase">{translate('checkout.billingAddress')}</h5>
                <AddressForm
                  address={billingAddress}
                  register={registerBillingInput}
                  setValue={setBillingValue}
                  errors={billingErrors}
                />
              </div>
            )}

            <div className="mt-32 flex gap-12">
              <Button
                variant="primary"
                className="px-48"
                loading={processing}
                onClick={async () => {
                  if (disabled) return;

                  startProcessing();
                  await addShippingAddress({
                    ...addressToAccountAddress(shippingAddress),
                    isDefaultShippingAddress: true,
                  });
                  await addBillingAddress({
                    ...addressToAccountAddress(currentBillingAddress),
                    isDefaultBillingAddress: true,
                  });
                  stopProcessing();
                  goToNextStep();
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
          <h5 className="pb-32 text-14 font-semibold uppercase">{translate('checkout.deliveryAddress')}</h5>

          <AddressForm
            register={registerShippingInput}
            setValue={setShippingValue}
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
              disableBackground
            />
          </div>

          {!sameShippingAddress && (
            <div className="mt-48">
              <h5 className="pb-32 text-14 font-semibold uppercase">{translate('checkout.billingAddress')}</h5>
              <AddressForm
                address={billingAddress}
                setValue={setBillingValue}
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
          <div className="flex items-center gap-12">
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
