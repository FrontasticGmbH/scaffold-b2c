import React, { useCallback, useContext } from 'react';
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

  const { account } = useContext(AccountContext);

  const setAddressAsDefault = useCallback(
    (address: AddressType) => {
      const { setAsDefault } = mapPropsToAddress(address as AddressFormData);
      setAsDefault();
    },
    [mapPropsToAddress],
  );

  const shippingAddresses = account?.addresses?.filter((address) => address.isShippingAddress) ?? [];
  const billingAddresses = account?.addresses?.filter((address) => address.isBillingAddress) ?? [];

  const renderAddressesSection = useCallback((type: 'shipping' | 'billing', addresses: AddressType[]) => {
    const isEmpty = !addresses?.length;

    return (
      <div>
        <h2 className="text-18 font-semibold text-gray-700 md:text-20">
          {type === 'shipping' ? translate('account.shipping-addresses') : translate('account.billing-addresses')}
        </h2>
        <div className="mt-24">
          {isEmpty ? (
            <div className="flex items-center justify-center rounded-md border border-gray-300 px-20 py-32">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="129" viewBox="0 0 100 129" fill="none">
                  <path
                    d="M99.0001 107.5V123.5C99.0001 124.561 98.5786 125.578 97.8285 126.328C97.0784 127.079 96.0609 127.5 95.0001 127.5H9.31007C7.24412 127.534 5.24114 126.789 3.70081 125.411C2.16048 124.034 1.19609 122.127 1.00007 120.07C0.92167 118.972 1.07051 117.871 1.4373 116.833C1.80408 115.796 2.38092 114.845 3.13175 114.041C3.88258 113.237 4.79126 112.596 5.80098 112.159C6.81071 111.721 7.89976 111.497 9.00007 111.5H95.0001C96.0609 111.5 97.0784 111.079 97.8285 110.328C98.5786 109.578 99.0001 108.561 99.0001 107.5Z"
                    stroke="#8F8F8F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M98.9999 5.5V107.5C98.9999 108.561 98.5785 109.578 97.8284 110.328C97.0782 111.079 96.0608 111.5 94.9999 111.5H8.99994C7.57757 111.493 6.17915 111.866 4.94874 112.58C3.71834 113.293 2.70045 114.322 1.99994 115.56C0.999939 112 0.999939 145.5 0.999939 9.5C0.999939 7.37827 1.84279 5.34344 3.34308 3.84315C4.84338 2.34285 6.87821 1.5 8.99994 1.5H94.9999C96.0608 1.5 97.0782 1.92143 97.8284 2.67157C98.5785 3.42172 98.9999 4.43913 98.9999 5.5Z"
                    stroke="#8F8F8F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M74.56 70C53.92 87.44 22 72.7 22 45.5C22 37.0131 25.3714 28.8737 31.3726 22.8726C37.3737 16.8714 45.5131 13.5 54 13.5C83.91 13.5 97.3 50.95 74.56 70Z"
                    stroke="#8F8F8F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M74.53 70.01C68.7846 74.8514 61.5131 77.5065 54 77.5065C46.4868 77.5065 39.2153 74.8514 33.47 70.01C39.29 45.31 68.72 45.35 74.53 70.01Z"
                    stroke="#8F8F8F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M54 51.5C60.6274 51.5 66 46.1274 66 39.5C66 32.8726 60.6274 27.5 54 27.5C47.3726 27.5 42 32.8726 42 39.5C42 46.1274 47.3726 51.5 54 51.5Z"
                    stroke="#8F8F8F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11 1.5V111.5H9C6.87827 111.5 4.84344 112.343 3.34315 113.843C1.84285 115.343 1 117.378 1 119.5V9.5C1 7.37827 1.84285 5.34344 3.34315 3.84315C4.84344 2.34285 6.87827 1.5 9 1.5H11Z"
                    stroke="#8F8F8F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M81 89.5H26"
                    stroke="#8F8F8F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M73 97.5H35"
                    stroke="#8F8F8F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <p className="mt-36 text-gray-600">{translate('account.no-addresses-added')}</p>

                <Link
                  link={`?hash=addresses&id=address-add&type=${type}`}
                  className="mt-24 block w-full rounded-md bg-gray-700 px-36 py-12 text-center text-14 font-medium leading-[114%] text-neutral-150 hover:cursor-pointer md:w-fit"
                >
                  {type === 'shipping'
                    ? translate('account.shipping-address-add')
                    : translate('account.billing-address-add')}
                </Link>
              </div>
              <span />
            </div>
          ) : (
            <div className="flex flex-col items-stretch gap-12">
              {addresses.map((address) => (
                <Address
                  key={address.addressId}
                  address={address}
                  selectAddress={setAddressAsDefault}
                  isDefaultAddress={address.isDefaultBillingAddress || address.isDefaultShippingAddress}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }, []);

  return (
    <div>
      <div>
        <Link
          link="?hash=addresses&id=address-add"
          className="block w-full rounded-md bg-gray-700 px-36 py-12 text-center text-14 font-medium leading-[114%] text-neutral-150 hover:cursor-pointer md:w-fit"
        >
          {translate('account.address-add')}
        </Link>
      </div>

      <div className="mt-36 flex flex-col items-stretch gap-36 pb-28 md:mt-44">
        {renderAddressesSection('shipping', shippingAddresses)}
        {renderAddressesSection('billing', billingAddresses)}
      </div>
    </div>
  );
};

export default Addresses;
