import React, { useCallback, useContext } from 'react';
import { useTranslations } from 'next-intl';
import Select from 'components/commercetools-ui/atoms/dropdown/option-dropdown';
import { AccountContext } from 'context/account';
import { isOnlyCountryFilled } from 'helpers/utils/fieldsCheck';
import useMappers from '../../hooks/useMappers';
import { Address } from '../../types';

interface Props {
  className?: string;
  onSelectShippingAddress: (address: Address) => void;
  onSelectBillingAddress: (address: Address) => void;
  onRequestAddAddress: (type: 'shipping' | 'billing') => void;
  shippingAddressHasError?: boolean;
  billingAddressHasError?: boolean;
  shippingAddress: Address;
  billingAddress: Address;
}

const AccountAddresses: React.FC<Props> = ({
  className = '',
  onSelectShippingAddress,
  onSelectBillingAddress,
  onRequestAddAddress,
  shippingAddressHasError,
  billingAddressHasError,
  shippingAddress,
  billingAddress,
}) => {
  const translate = useTranslations();

  const { shippingAddresses, billingAddresses } = useContext(AccountContext);

  const { accountAddressToAddress } = useMappers();

  const formatAddress = useCallback((address: Address) => {
    if (isOnlyCountryFilled(address)) {
      return '';
    }

    return `${address.firstName} ${address.lastName}, ${address.streetName} ${address.streetNumber}, ${address.postalCode} ${address.city}, ${address.country}`;
  }, []);

  const sections = [
    {
      label: translate('checkout.shipping-address'),
      addNewLabel: translate('checkout.add-new-shipping-address'),
      onAddNew: () => onRequestAddAddress('shipping'),
      addresses: shippingAddresses,
      value: { name: formatAddress(shippingAddress), value: shippingAddress.addressId },
      onSelect: (address: Address) => {
        onSelectShippingAddress(address);
      },
      hasError: shippingAddressHasError,
    },
    {
      label: translate('checkout.billingAddress'),
      addNewLabel: translate('checkout.add-new-billing-address'),
      onAddNew: () => onRequestAddAddress('billing'),
      addresses: billingAddresses,
      value: { name: formatAddress(billingAddress), value: billingAddress.addressId },
      onSelect: (address: Address) => {
        onSelectBillingAddress(address);
      },
      hasError: billingAddressHasError,
    },
  ];

  return (
    <div className={`flex flex-col gap-20 ${className}`}>
      {sections.map(({ label, onAddNew, addNewLabel, addresses, value, hasError, onSelect }, index) => (
        <div key={index}>
          <div className="flex w-full items-center justify-between pb-16">
            <span className="text-sm font-semibold uppercase text-gray-700">{label}</span>
            <button className="text-sm font-semibold text-gray-700 underline" onClick={onAddNew}>
              {addNewLabel} {'+'}
            </button>
          </div>

          <Select
            label={translate('checkout.select-an-address')}
            labelClassName="text-sm text-gray-600 font-normal"
            options={addresses.map((address) => ({
              name: formatAddress(accountAddressToAddress(address)),
              value: address.addressId as string,
            }))}
            value={value}
            onChange={({ value }) => {
              onSelect(accountAddressToAddress(addresses.find((address) => address.addressId === value) as Address));
            }}
            error={hasError}
          />
          {hasError && (
            <span className="text-12 font-medium leading-[16px] text-red-500">
              {translate('checkout.invalidAddressError')}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AccountAddresses;
