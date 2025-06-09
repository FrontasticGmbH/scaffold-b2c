import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Select from 'components/commercetools-ui/atoms/dropdown/option-dropdown';
import { AccountContext } from 'context/account';
import useMappers from '../../hooks/useMappers';
import { Address } from '../../types';

interface Props {
  className?: string;
  onSelectShippingAddress: (address: Address) => void;
  onSelectBillingAddress: (address: Address) => void;
  onRequestAddAddress: (type: 'shipping' | 'billing') => void;
}

const AccountAddresses: React.FC<Props> = ({
  className = '',
  onSelectShippingAddress,
  onSelectBillingAddress,
  onRequestAddAddress,
}) => {
  const translate = useTranslations();

  const { shippingAddresses, billingAddresses, defaultBillingAddress, defaultShippingAddress } =
    useContext(AccountContext);

  const { accountAddressToAddress } = useMappers();

  const formatAddress = useCallback((address: Address) => {
    return `${address.firstName} ${address.lastName}, ${address.line1}, ${address.postalCode} ${address.city}, ${address.country}`;
  }, []);

  const [selectedShippingAddress, setSelectedShippingAddress] = useState({ name: '', value: '' });
  const [selectedBillingAddress, setSelectedBillingAddress] = useState({ name: '', value: '' });

  const sections = [
    {
      label: translate('checkout.deliveryAddress'),
      addNewLabel: translate('checkout.add-new-delivery-address'),
      onAddNew: () => onRequestAddAddress('shipping'),
      addresses: shippingAddresses,
      value: selectedShippingAddress,
      onSelect: (address: Address) => {
        setSelectedShippingAddress({ name: formatAddress(address), value: address.addressId });
        onSelectShippingAddress(address);
      },
    },
    {
      label: translate('checkout.billingAddress'),
      addNewLabel: translate('checkout.add-new-billing-address'),
      onAddNew: () => onRequestAddAddress('billing'),
      addresses: billingAddresses,
      value: selectedBillingAddress,
      onSelect: (address: Address) => {
        setSelectedBillingAddress({ name: formatAddress(address), value: address.addressId });
        onSelectBillingAddress(address);
      },
    },
  ];

  useEffect(() => {
    if (defaultShippingAddress) {
      setSelectedShippingAddress({
        name: formatAddress(accountAddressToAddress(defaultShippingAddress)),
        value: defaultShippingAddress.addressId as string,
      });
      onSelectShippingAddress(accountAddressToAddress(defaultShippingAddress));
    }
  }, [accountAddressToAddress, defaultShippingAddress, formatAddress, onSelectShippingAddress]);

  useEffect(() => {
    if (defaultBillingAddress) {
      setSelectedBillingAddress({
        name: formatAddress(accountAddressToAddress(defaultBillingAddress)),
        value: defaultBillingAddress.addressId as string,
      });
      onSelectBillingAddress(accountAddressToAddress(defaultBillingAddress));
    }
  }, [accountAddressToAddress, defaultBillingAddress, formatAddress, onSelectBillingAddress]);

  return (
    <div className={`flex flex-col gap-20 ${className}`}>
      {sections.map(({ label, onAddNew, addNewLabel, addresses, value, onSelect }, index) => (
        <div key={index}>
          <div className="flex w-full items-center justify-between pb-16">
            <span className="text-14 font-semibold uppercase text-gray-700">{label}</span>
            <button className="text-14 font-semibold text-gray-700 underline" onClick={onAddNew}>
              {addNewLabel} {'+'}
            </button>
          </div>

          <Select
            label={translate('checkout.select-saved-address')}
            options={addresses.map((address) => ({
              name: formatAddress(accountAddressToAddress(address)),
              value: address.addressId as string,
            }))}
            value={value}
            onChange={({ value }) => {
              onSelect(accountAddressToAddress(addresses.find((address) => address.addressId === value) as Address));
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AccountAddresses;
