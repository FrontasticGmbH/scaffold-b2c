import React, { useCallback, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import * as yup from 'yup';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import Info from 'components/commercetools-ui/atoms/info';
import { AccountContext } from 'context/account';
import useGeo from 'helpers/hooks/useGeo';
import useProcessing from 'helpers/hooks/useProcessing';
import useValidate from 'helpers/hooks/useValidate';
import { Cart } from 'types/entity/cart';
import { CartDetails } from 'frontastic/hooks/useCart/types';
import AccountAddresses from './components/account-addresses';
import AddressForm from './components/address-form';
import { Fields, FieldsOptions } from './components/address-form/types';
import useMappers from './hooks/useMappers';
import { Address } from './types';

export interface Props {
  onUpdateCart?: (payload: CartDetails) => Promise<Cart>;
  goToNextStep: () => void;
}

const Addresses: React.FC<Props> = ({ goToNextStep, onUpdateCart }) => {
  const translate = useTranslations();

  const { account, loggedIn, shippingAddresses } = useContext(AccountContext);

  const { getInfoByZipcode } = useGeo();

  const { addressToAccountAddress } = useMappers();

  const { validateEmail } = useValidate();

  const initialAddressData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    postalCode: '',
    city: '',
  } as Address;

  const [shippingAddress, setShippingAddress] = useState(initialAddressData);
  const [billingAddress, setBillingAddress] = useState(initialAddressData);
  const [sameShippingAddress, setSameShippingAddress] = useState(true);

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
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (res?.cartId) goToNextStep();
    else toast.error(translate('checkout.update-addresses-error'), { position: 'bottom-left' });
  }, [
    account,
    isValidShippingAddress,
    isValidBillingAddress,
    shippingAddress,
    currentBillingAddress,
    addressToAccountAddress,
    onUpdateCart,
    goToNextStep,
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
          className: 'col-span-3',
        },
        {
          name: 'lastName',
          label: translate('common.lastName'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-3',
        },
        {
          name: 'email',
          label: translate('common.email'),
          labelDesc: '',
          required: true,
          type: 'email',
          className: 'col-span-3',
          validate(value) {
            return validateEmail(value);
          },
        },
        {
          name: 'phone',
          label: `${translate('common.phone')}`,
          labelDesc: translate('checkout.for-other-updates'),
          type: 'string',
          className: 'col-span-3',
        },
        {
          name: 'line1',
          label: translate('common.address'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-3',
          render() {
            if (enableAddress2) return <></>;

            return (
              <div className="col-span-3 mt-16 cursor-pointer">
                {/* eslint-disable-next-line react/jsx-no-literals */}
                <p className="w-fit text-14 text-gray-600" onClick={onEnableAddress2}>
                  + {translate('checkout.add-address')}
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
                className: 'col-span-3',
              },
            ]
          : []),
        {
          name: 'postalCode',
          label: translate('common.zipCode'),
          labelDesc: '',
          required: true,
          className: 'col-span-1 mt-12',
        },
        { name: 'city', label: translate('common.city'), labelDesc: '', required: true, className: 'col-span-2 mt-12' },
      ] as Fields[];
    },
    [translate, validateEmail],
  );

  return (
    <div className="bg-white pt-16 lg:px-36 lg:pb-36 lg:pt-0">
      {loggedIn ? (
        shippingAddresses.length > 0 && (
          <div className="mt-20">
            <h5 className="text-16 capitalize">{translate('checkout.shippingAddress')}</h5>
            <AccountAddresses
              className="mt-20"
              type="shipping"
              onSelectAddress={(address) => setShippingAddress(address)}
            />
          </div>
        )
      ) : (
        <AddressForm
          className="md:max-w-400"
          fields={fields}
          address={shippingAddress}
          onChange={handleShippingAddressChange}
        />
      )}

      {loggedIn && shippingAddresses.length === 0 ? (
        <></>
      ) : (
        <div className="mt-48">
          <div className="flex items-center gap-8 lg:gap-12">
            <h5 className="text-16 capitalize">{translate('checkout.billingAddress')}</h5>
            <Info message={`${translate('checkout.enter-associated-address-with-payment')}.`} />
          </div>

          <div className="mt-28 flex items-center gap-12 p-2">
            <Checkbox
              label={translate('checkout.billingDetailsLabel')}
              labelPosition="on-right"
              checked={sameShippingAddress}
              onChange={({ checked }) => setSameShippingAddress(checked)}
              disableBackground
            />
          </div>

          {!sameShippingAddress &&
            (loggedIn ? (
              <AccountAddresses
                type="billing"
                className="mt-28"
                onSelectAddress={(address) => setBillingAddress(address)}
              />
            ) : (
              <AddressForm
                className="mt-28 md:max-w-400"
                fields={fields}
                address={billingAddress}
                onChange={handleBillingAddressChange}
              />
            ))}
        </div>
      )}

      <div className="mt-28 md:mt-36 lg:mt-45">
        <Button
          variant="primary"
          className="w-full min-w-200 md:text-16 lg:w-fit lg:px-36"
          disabled={!isValidShippingAddress || !isValidBillingAddress}
          loading={processing}
          type="submit"
          onClick={submit}
        >
          {translate('cart.continue-to')} <span className="lowercase">{translate('cart.shipping')}</span>
        </Button>
      </div>
    </div>
  );
};

export default Addresses;
