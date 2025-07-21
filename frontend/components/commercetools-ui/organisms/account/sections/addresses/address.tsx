import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import type { Address as AddressType } from 'shared/types/account/Address';
import { useTranslations } from 'use-intl';
import Link from 'components/commercetools-ui/atoms/link';
import { AccountContext } from 'context/account';
import { classnames } from 'helpers/utils/classnames';
import { AddressFormData } from './address-form';
import DeleteModal from './deleteModal';
import usePropsToAddressType from './mapPropsToAddressType';
import useFeedbackToasts from '../../hooks/useFeedbackToasts';

export interface AddressProps {
  address: AddressType;
  isDefaultAddress?: boolean;
  selectAddress: (address: AddressFormData) => void;
}

const Address = ({ address, isDefaultAddress }: AddressProps) => {
  const { mapPropsToAddress } = usePropsToAddressType();
  const { setAsDefault } = mapPropsToAddress(address as AddressFormData);
  const { notifyDataUpdated, notifyWentWrong } = useFeedbackToasts();
  const { removeAddress } = useContext(AccountContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const translate = useTranslations();

  const onUpdateAddress = () => {
    setAsDefault().then(notifyDataUpdated).catch(notifyWentWrong);
  };

  const onDeleteAddress = () => {
    if (address.addressId) {
      removeAddress(address.addressId)
        .then(() => {
          setModalIsOpen(false);
          toast.success(translate('account.address-deleted'));
        })
        .catch(() => {
          setModalIsOpen(false);
          toast.error(translate('error.wentWrong'));
        });
    }
  };

  const ctaClassName = 'rounded-md border border-gray-700 p-3 md:border-0 md:underline';

  return (
    <div
      className={classnames(
        'flex flex-col justify-between rounded-md border px-20 py-16 md:flex-row md:items-center',
        isDefaultAddress ? 'border-2 border-gray-600' : 'border-neutral-400',
      )}
      key={address.addressId}
    >
      <div className="grid gap-8">
        <div>
          <div className="grid text-sm text-gray-600">
            <p className="font-semibold">{`${address.firstName} ${address.lastName}`}</p>
            <p>
              {`${address.streetName ?? ''}${address.streetNumber ?? ''}, `}
              <span>{address.additionalAddressInfo}</span>
            </p>
            <p>{`${address.postalCode} ${address.city}`}</p>
          </div>
        </div>

        {isDefaultAddress && (
          <div className="w-fit rounded-md bg-green-100 p-8 text-12 font-semibold text-green-700">
            {translate('account.default-address')}
          </div>
        )}
      </div>
      <div className="mt-16 flex w-fit items-center gap-8 text-sm md:mt-0" onClick={(e) => e.stopPropagation()}>
        <Link className={ctaClassName} link={`?hash=addresses&id=address_${address.addressId}`}>
          {translate('common.edit')}
        </Link>
        {address.isDefaultBillingAddress || address.isDefaultShippingAddress ? (
          <></>
        ) : (
          <>
            <div className="hidden h-16 border-l border-gray-500 md:block" />
            <button className={ctaClassName} onClick={() => setModalIsOpen(true)}>
              {translate('common.remove')}
            </button>
            <div className="hidden h-16 border-l border-gray-700 md:block" />
            <button className={ctaClassName} onClick={onUpdateAddress}>
              {translate('account.set-as-default')}
            </button>
          </>
        )}
      </div>

      <DeleteModal
        modalIsOpen={modalIsOpen}
        loading={false}
        closeModal={() => setModalIsOpen(false)}
        handleDelete={onDeleteAddress}
        canDelete
      />
    </div>
  );
};

export default Address;
