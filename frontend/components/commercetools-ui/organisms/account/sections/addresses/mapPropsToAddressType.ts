import { useCallback, useContext } from 'react';
import { useTranslations } from 'use-intl';
import { AccountContext } from 'context/account';
import useI18n from 'helpers/hooks/useI18n';
import { AddressFormData } from './address-form';

const usePropsToAddressType = () => {
  const { country } = useI18n();
  const translate = useTranslations();

  const { addBillingAddress, addShippingAddress, setDefaultBillingAddress, setDefaultShippingAddress, updateAddress } =
    useContext(AccountContext);

  const {} = useContext(AccountContext);

  const getAddressType = useCallback((address: AddressFormData) => {
    if (address?.addressType) return address?.addressType;
    return address?.isBillingAddress ? 'billing' : 'shipping';
  }, []);

  const mapPropsToAddress = useCallback(
    (address: AddressFormData) => {
      const addressType = getAddressType(address);

      const typeBasedProps = {
        billing: {
          checked: address?.isDefaultBillingAddress,
          label: translate('checkout.billing').toLowerCase(),
          addressType: addressType,
          setAsDefault: async () => {
            await setDefaultBillingAddress(address?.addressId);
          },
          addAddress: async () => {
            await addBillingAddress({ ...address, country, isDefaultBillingAddress: address?.isDefaultAddress });
          },
          updateAddress: async () => {
            await updateAddress({ ...address, isDefaultBillingAddress: address?.isDefaultAddress });
          },
        },
        shipping: {
          checked: address?.isDefaultShippingAddress,
          label: translate('checkout.shipping').toLowerCase(),
          addressType: addressType,
          setAsDefault: async () => {
            await setDefaultShippingAddress(address?.addressId);
          },
          addAddress: async () => {
            await addShippingAddress({ ...address, country, isDefaultShippingAddress: address?.isDefaultAddress });
          },
          updateAddress: async () => {
            await updateAddress({ ...address, isDefaultShippingAddress: address?.isDefaultAddress });
          },
        },
      };

      return typeBasedProps[addressType];
    },
    [
      country,
      translate,
      getAddressType,
      addBillingAddress,
      addShippingAddress,
      setDefaultBillingAddress,
      setDefaultShippingAddress,
      updateAddress,
    ],
  );

  return { mapPropsToAddress };
};

export default usePropsToAddressType;
