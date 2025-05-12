import React, { useCallback, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import * as yup from 'yup';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { AccountContext } from 'context/account';
import useGeo from 'helpers/hooks/useGeo';
import useI18n from 'helpers/hooks/useI18n';
import useProcessing from 'helpers/hooks/useProcessing';
import useValidate from 'helpers/hooks/useValidate';
import { Cart } from 'types/entity/cart';
import { CartDetails } from 'frontastic/hooks/useCart/types';
import AccountAddresses from './components/account-addresses';
import AddressForm from './components/address-form';
import { Fields, FieldsOptions } from './components/address-form/types';
import useMappers from './hooks/useMappers';
import { Address } from './types';
import CreateAddress from '../../../create-address';

export interface Props {
  isCompleted: boolean;
  onUpdateCart?: (payload: CartDetails) => Promise<Cart>;
  goToNextStep: () => void;
  goToReview: () => void;
}

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

  const { getInfoByZipcode } = useGeo();

  const { addressToAccountAddress, accountAddressToAddress } = useMappers();

  const { validateEmail } = useValidate();

  const [createAddressType, setCreateAddressAdressType] = useState<'shipping' | 'billing'>();

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

  const [shippingAddress, setShippingAddress] = useState(
    defaultShippingAddress ? accountAddressToAddress(defaultShippingAddress) : initialAddressData,
  );
  const [billingAddress, setBillingAddress] = useState(
    defaultBillingAddress ? accountAddressToAddress(defaultBillingAddress) : initialAddressData,
  );
  const [sameShippingAddress, setSameShippingAddress] = useState(!loggedIn);

  const currentBillingAddress = useMemo(
    () => (sameShippingAddress ? shippingAddress : billingAddress),
    [sameShippingAddress, shippingAddress, billingAddress],
  );

  const addressValidationScehma = useMemo(() => {
    return yup
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
  }, []);

  const isValidShippingAddress = useMemo(() => {
    try {
      addressValidationScehma.validateSync(shippingAddress);
      return true;
    } catch {
      return false;
    }
  }, [addressValidationScehma, shippingAddress]);

  const isValidBillingAddress = useMemo(() => {
    try {
      addressValidationScehma.validateSync(currentBillingAddress);
      return true;
    } catch {
      return false;
    }
  }, [addressValidationScehma, currentBillingAddress]);

  const handleShippingAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

      if (e.target.name === 'postalCode') {
        getInfoByZipcode(e.target.value).then((data) => {
          if (data.places?.[0])
            setShippingAddress((shippingAddress) => ({ ...shippingAddress, city: data.places[0]['place name'] ?? '' }));
        });
      }
    },
    [shippingAddress, getInfoByZipcode],
  );

  const handleBillingAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
    },
    [billingAddress],
  );

  const { processing, startProcessing, stopProcessing } = useProcessing();

  const submit = useCallback(async () => {
    if (!isValidShippingAddress || !isValidBillingAddress || processing) return;

    startProcessing();

    const data = {
      account: { email: account?.email || shippingAddress.email || currentBillingAddress.email },
      shipping: addressToAccountAddress(shippingAddress),
      billing: addressToAccountAddress(currentBillingAddress),
    } as CartDetails;

    const res = await onUpdateCart?.(data);

    stopProcessing();

    if (res?.cartId) {
      if (isCompleted) goToReview();
      else goToNextStep();
    } else toast.error(translate('checkout.update-addresses-error'), { position: 'bottom-left' });
  }, [
    isCompleted,
    account,
    isValidShippingAddress,
    isValidBillingAddress,
    shippingAddress,
    currentBillingAddress,
    addressToAccountAddress,
    onUpdateCart,
    goToNextStep,
    goToReview,
    translate,
    processing,
    startProcessing,
    stopProcessing,
  ]);

  const fields = useCallback(
    ({ enableAddress2, onEnableAddress2 }: FieldsOptions) => {
      return [
        {
          name: 'firstName',
          label: translate('common.firstName'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-12',
        },
        {
          name: 'lastName',
          label: translate('common.lastName'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-12',
        },
        {
          name: 'email',
          label: translate('common.email'),
          labelDesc: '',
          required: true,
          type: 'email',
          className: 'col-span-12',
          validate(value) {
            return validateEmail(value);
          },
        },
        {
          name: 'phone',
          label: `${translate('common.phone')}`,
          labelDesc: translate('checkout.for-other-updates'),
          type: 'string',
          className: 'col-span-12',
        },
        {
          name: 'line1',
          label: translate('common.address'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-12',
          render() {
            if (enableAddress2) return <></>;

            return (
              <div className="col-span-3 mt-16 cursor-pointer">
                {/* eslint-disable-next-line react/jsx-no-literals */}
                <p className="w-fit text-14 text-gray-600" onClick={onEnableAddress2}>
                  {'+'} {translate('checkout.add-address')}
                </p>
              </div>
            );
          },
        },
        ...(enableAddress2
          ? [
              {
                name: 'line2',
                label: `${translate('common.address')} 2`,
                labelDesc: '',
                type: 'string',
                className: 'col-span-12',
              },
            ]
          : []),
        {
          name: 'postalCode',
          label: translate('common.zipCode'),
          labelDesc: '',
          required: true,
          className: 'col-span-6 mt-12',
        },
        { name: 'city', label: translate('common.city'), labelDesc: '', required: true, className: 'col-span-6 mt-12' },
      ] as Fields[];
    },
    [translate, validateEmail],
  );

  return (
    <div>
      {loggedIn &&
        (shippingAddresses.length > 0 ? (
          <>
            {!!createAddressType ? (
              <CreateAddress
                addressType={createAddressType}
                onAfterSubmit={() => setCreateAddressAdressType(undefined)}
              />
            ) : (
              <AccountAddresses
                onSelectShippingAddress={(address) => setShippingAddress(address)}
                onSelectBillingAddress={(address) => setBillingAddress(address)}
                onRequestAddAddress={(addressType) => setCreateAddressAdressType(addressType)}
              />
            )}
          </>
        ) : (
          <div>
            <h5 className="pb-32 text-14 font-semibold uppercase">{translate('checkout.deliveryAddress')}</h5>

            <AddressForm fields={fields} address={shippingAddress} onChange={handleShippingAddressChange}></AddressForm>

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
                <AddressForm fields={fields} address={billingAddress} onChange={handleBillingAddressChange} />
              </div>
            )}

            <div className="mt-32 flex gap-12">
              <Button
                variant="primary"
                className="px-48"
                loading={processing}
                onClick={async () => {
                  startProcessing();
                  await addShippingAddress({
                    ...addressToAccountAddress(shippingAddress),
                    isDefaultShippingAddress: true,
                  });
                  await addBillingAddress({
                    ...addressToAccountAddress(billingAddress),
                    isDefaultBillingAddress: true,
                  });
                  stopProcessing();
                  goToNextStep();
                }}
              >
                {translate('cart.continue-to')} <span className="lowercase">{translate('cart.shipping')}</span>
              </Button>
            </div>
          </div>
        ))}

      {!loggedIn && (
        <div>
          <h5 className="pb-32 text-14 font-semibold uppercase">{translate('checkout.deliveryAddress')}</h5>

          <AddressForm fields={fields} address={shippingAddress} onChange={handleShippingAddressChange} />

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
              <AddressForm fields={fields} address={billingAddress} onChange={handleBillingAddressChange} />
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
              disabled={!isValidShippingAddress || !isValidBillingAddress}
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
