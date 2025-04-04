import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Address as AddressType } from 'shared/types/account';
import { useTranslations } from 'use-intl';
import Link from 'components/commercetools-ui/atoms/link';
import { AccountContext } from 'context/account';
import Address from './address';
import { AddressFormData } from './address-form';
import usePropsToAddressType from './mapPropsToAddressType';

const Addresses = () => {
  const translate = useTranslations();

  const { mapPropsToAddress } = usePropsToAddressType();

  const { account, defaultBillingAddress, defaultShippingAddress } = useContext(AccountContext);
  const addresses = account?.addresses;

  const [selectedBillingAddress, setSelectedBillingAddress] = useState<AddressType>();
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<AddressType>();

  const selectAddress = (address: AddressFormData) => {
    if (address.isBillingAddress) {
      setSelectedBillingAddress(address);
    } else {
      setSelectedShippingAddress(address);
    }
  };

  const setAddressAsDefault = useCallback(
    (address: AddressType) => {
      const { setAsDefault } = mapPropsToAddress(address as AddressFormData);
      setAsDefault();
    },
    [mapPropsToAddress],
  );

  useEffect(() => {
    if (selectedBillingAddress !== defaultBillingAddress?.addressId) {
      setAddressAsDefault(selectedBillingAddress as AddressType);
    }
  }, [defaultBillingAddress?.addressId, selectedBillingAddress, setAddressAsDefault]);

  useEffect(() => {
    if (selectedShippingAddress !== defaultShippingAddress?.addressId) {
      setAddressAsDefault(selectedShippingAddress as AddressType);
    }
  }, [defaultShippingAddress?.addressId, selectedShippingAddress, setAddressAsDefault]);

  useEffect(() => {
    if (!selectedBillingAddress) {
      setSelectedBillingAddress(defaultBillingAddress);
    }

    if (!selectedShippingAddress) {
      setSelectedShippingAddress(defaultShippingAddress);
    }
  }, [defaultBillingAddress, defaultShippingAddress, selectedBillingAddress, selectedShippingAddress]);

  return (
    <div className="mt-20 px-16 md:px-24 lg:mt-40 lg:px-44">
      <div className="hidden pb-12 md:block md:pb-20 2xl:pb-36">
        <h2 className="text-22 text-primary lg:text-24">{translate('account.addresses')}</h2>
      </div>
      <div>
        <p className="mb-28 text-14 leading-loose text-gray-600 md:mb-24 md:text-16 2xl:mb-36">
          {translate('account.address-desc')}
        </p>
        <Link
          link="?hash=addresses&id=address-add"
          className="block w-full rounded-md bg-gray-700 px-16 py-8 text-center text-14 font-medium leading-[114%] text-neutral-150 hover:cursor-pointer md:w-fit 2xl:px-40 2xl:py-12"
        >
          {translate('account.address-add')}
        </Link>
      </div>

      <form className="mt-24 grid gap-20 pb-28 md:mt-28 2xl:mt-32">
        {addresses?.map((address) => (
          <Address
            key={address.addressId}
            address={address}
            isChecked={false}
            selectAddress={selectAddress}
            isDefaultAddress={
              address.addressId == selectedBillingAddress?.addressId ||
              address.addressId == selectedShippingAddress?.addressId
            }
          />
        ))}
      </form>
    </div>
  );
};

export default Addresses;
