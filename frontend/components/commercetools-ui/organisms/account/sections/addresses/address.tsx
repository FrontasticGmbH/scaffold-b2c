import React from 'react';
import type { Address as AddressType } from 'shared/types/account/Address';
import { useTranslations } from 'use-intl';
import { classnames } from 'helpers/utils/classnames';
import { AddressFormData } from './address-form';
import usePropsToAddressType from './mapPropsToAddressType';
import EditCTA from '../../account-atoms/edit-cta';

export interface AddressProps {
  address: AddressType;
  isDefaultAddress?: boolean;
  selectAddress: (address: AddressFormData) => void;
}

const Address: React.FC<AddressProps> = ({ address, isDefaultAddress, selectAddress }) => {
  const { mapPropsToAddress } = usePropsToAddressType();
  const { label } = mapPropsToAddress(address as AddressFormData);

  const translate = useTranslations();

  const addressInfoTypographyElements = [
    `${address.firstName} ${address.lastName}`,
    address.streetName,
    `${address.postalCode} ${address.city}`,
  ];

  return (
    <div
      className={classnames(
        'flex cursor-pointer items-center justify-between rounded-md border p-12 md:px-20 md:py-24 2xl:px-24',
        isDefaultAddress ? 'border-gray-700' : 'border-neutral-400',
      )}
      key={address.addressId}
      onClick={() => selectAddress(address as AddressFormData)}
    >
      <div className="grid gap-8">
        <div>
          <p className="pb-4 text-14 font-medium capitalize md:text-16">{label}</p>

          <div className="grid">
            {addressInfoTypographyElements.map((element) => (
              <p key={element} className="text-14 leading-loose text-gray-600">
                {element}
              </p>
            ))}
          </div>
        </div>

        {isDefaultAddress && (
          <div className="mt-8 w-fit rounded-md bg-green-100 p-8 text-12 font-semibold text-green-700">
            {translate('account.default-address')}
          </div>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <EditCTA editHref={`?hash=addresses&id=address_${address.addressId}`} />
      </div>
    </div>
  );
};

export default Address;
