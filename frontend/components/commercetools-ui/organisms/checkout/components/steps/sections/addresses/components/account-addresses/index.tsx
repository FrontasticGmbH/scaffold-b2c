import React, { useEffect, useMemo, useState } from 'react';
import Radio from 'components/commercetools-ui/atoms/radio';
import { useAccount } from 'frontastic';
import useMappers from '../../hooks/useMappers';
import { Address } from '../../types';

interface Props {
  className?: string;
  type: 'shipping' | 'billing';
  onSelectAddress: (address: Address) => void;
}

const AccountAddresses: React.FC<Props> = ({ className = '', type, onSelectAddress }) => {
  const { shippingAddresses, billingAddresses, defaultBillingAddress, defaultShippingAddress } = useAccount();

  const { accountAddressToAddress } = useMappers();

  const addresses = useMemo(() => {
    return type === 'shipping' ? shippingAddresses : billingAddresses;
  }, [type, shippingAddresses, billingAddresses]);

  const [selected, setSelected] = useState<Address>();

  useEffect(() => {
    const defaultAddress = type === 'shipping' ? defaultShippingAddress : defaultBillingAddress;

    if (defaultAddress) setSelected(accountAddressToAddress(defaultAddress));
  }, [defaultShippingAddress, defaultBillingAddress, accountAddressToAddress, type]);

  useEffect(() => {
    if (selected) onSelectAddress(selected);
  }, [selected, onSelectAddress]);

  return (
    <div className={`flex grid-cols-3 flex-col gap-20 md:grid ${className}`}>
      {addresses
        .map((address) => accountAddressToAddress(address))
        .map((address) => (
          <div
            key={address.addressId}
            className="flex cursor-pointer items-center gap-20 rounded-md border border-neutral-400 px-20 py-38"
            onClick={() => setSelected(address)}
          >
            <Radio className="shrink-0" checked={address.addressId === selected?.addressId} />
            <p className="max-w-full overflow-hidden truncate text-14 text-secondary-black">
              {address.firstName} {address.lastName}
              <span className="mt-8 block" />
              {address.line1}
              <span className="mt-8 block" />
              {address.postalCode} {address.city}
            </p>
          </div>
        ))}
    </div>
  );
};

export default AccountAddresses;
