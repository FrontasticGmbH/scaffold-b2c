import { useContext, useEffect, useMemo, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Account } from 'shared/types/account';
import { Address } from 'shared/types/account/Address';
import { useTranslations } from 'use-intl';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import { AccountContext } from 'context/account';
import useI18n from 'helpers/hooks/useI18n';
import useValidate from 'helpers/hooks/useValidate';
import countryStates from 'public/static/states.json';
import DeleteModal from './deleteModal';
import usePropsToAddressType from './mapPropsToAddressType';
import AccountForm from '../../account-atoms/account-form';
import SaveOrCancel from '../../account-atoms/save-or-cancel';
import useDiscardForm from '../../hooks/useDiscardForm';
import useFeedbackToasts from '../../hooks/useFeedbackToasts';

export interface AddressFormProps {
  addressId?: string;
  editedAddressId?: Address['addressId'];
}

export interface AddressFormData extends Address {
  addressId: string;
  addressType?: 'shipping' | 'billing';
  isDefaultAddress?: boolean;
  isBillingAddress?: boolean;
  isDefaultBillingAddress?: boolean;
  isDefaultShippingAddress?: boolean;
}

type AddressType = 'shipping' | 'billing';
type AddressTypeOptions = Array<{ label: string; value: AddressType }>;

const AddressForm: React.FC<AddressFormProps> = ({ editedAddressId }) => {
  const translate = useTranslations();

  const { validateTextExists, validatePostalCode } = useValidate();

  const { removeAddress, account } = useContext(AccountContext);
  const { mapPropsToAddress } = usePropsToAddressType();
  const { discardForm } = useDiscardForm();
  const { notifyDataUpdated, notifyWentWrong } = useFeedbackToasts();
  const { country } = useI18n();

  const states = countryStates[country as keyof typeof countryStates] ?? [];

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const toggleLoadingOn = () => setLoading(true);
  const toggleLoadingOff = () => setLoading(false);

  //new address data
  const defaultData = useMemo(() => {
    if (!editedAddressId) return { country } as AddressFormData;

    const accountAddress = account?.addresses?.find(
      (address) => address.addressId === editedAddressId,
    ) as AddressFormData;

    if (accountAddress) {
      accountAddress.addressType = mapPropsToAddress(accountAddress).addressType;
    }

    return accountAddress;
  }, [account?.addresses, country, editedAddressId, mapPropsToAddress]);

  const [data, setData] = useState<AddressFormData>(defaultData);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addressTypes: AddressTypeOptions = [
    { label: translate('checkout.shippingAddress'), value: 'shipping' },
    { label: translate('checkout.billingAddress'), value: 'billing' },
  ];

  const formTitle = editedAddressId ? translate('account.address-edit') : translate('account.address-add');

  useEffect(() => {
    setData(defaultData);
  }, [defaultData]);

  const updateData = (name: string, value: boolean | string) => {
    setData({ ...data, [name]: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    updateData(e.target.name, e.target.value);
  };

  const discardFormAndNotify = (promise: Promise<Account | void>) => {
    promise.then(toggleLoadingOff).then(discardForm).then(notifyDataUpdated).catch(notifyWentWrong);
  };

  const handleDelete = () => {
    setLoadingDelete(true);

    removeAddress(data.addressId)
      .then(() => setLoadingDelete(false))
      .then(closeModal)
      .then(() => toast.success(translate('account.address-deleted')))
      .then(discardForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toggleLoadingOn();

    const { addAddress, updateAddress } = mapPropsToAddress(data);

    if (editedAddressId) {
      if (defaultData.addressType !== data.addressType) {
        discardFormAndNotify(removeAddress(defaultData.addressId).then(addAddress));
      } else {
        discardFormAndNotify(updateAddress());
      }

      return;
    }
    discardFormAndNotify(addAddress());
  };

  return (
    <AccountForm
      onSubmit={handleSubmit}
      title={formTitle}
      loading={loading}
      containerClassName="grid gap-12 md:px-24 md:px-0"
    >
      <Input
        label={translate('common.firstName')}
        required
        type="text"
        name="firstName"
        id="first-name"
        value={data?.firstName ?? ''}
        autoComplete="first-name"
        className="border-neutral-500"
        onChange={handleChange}
        validation={validateTextExists}
      />

      <Input
        label={translate('common.lastName')}
        required
        type="text"
        name="lastName"
        id="last-name"
        value={data?.lastName ?? ''}
        autoComplete="last-name"
        className="border-neutral-500"
        onChange={handleChange}
        validation={validateTextExists}
      />

      <Input
        label={`${translate('common.address')} 1`}
        type="text"
        required
        name="streetName"
        id="street-name"
        value={data?.streetName ?? ''}
        autoComplete="primary-address"
        className="border-neutral-500"
        onChange={handleChange}
      />

      <Input
        label={`${translate('common.address')} 2 (${translate('common.optional')})`}
        type="text"
        name="additionalAddressInfo"
        id="additional-address-info"
        value={data?.additionalAddressInfo ?? ''}
        autoComplete="additional-address-info"
        className="border-neutral-500"
        onChange={handleChange}
      />

      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-3 md:col-span-1">
          <Input
            label={translate('common.zipCode')}
            required
            type="text"
            name="postalCode"
            id="postal-code"
            value={data?.postalCode ?? ''}
            autoComplete="postal-code"
            className="border-neutral-500"
            validation={validatePostalCode}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-3 md:col-span-2">
          <Input
            label={translate('common.city')}
            required
            type="text"
            name="city"
            id="city"
            value={data?.city ?? ''}
            autoComplete="city"
            className="border-neutral-500"
            onChange={handleChange}
            validation={validateTextExists}
          />
        </div>
      </div>

      {states.length > 0 && (
        <Dropdown
          name="state"
          value={data.state ?? ''}
          items={[{ label: '', value: '' }, ...states.map(({ name, code }) => ({ label: name, value: code }))]}
          className="w-full border-neutral-500"
          onChange={handleChange}
          label={translate('common.state')}
        />
      )}

      <Dropdown
        name="addressType"
        items={addressTypes}
        className="w-full border-neutral-500"
        onChange={handleChange}
        defaultValue={editedAddressId ? mapPropsToAddress(data).addressType : addressTypes[0].value}
        label={translate('account.address-type')}
      />

      <Checkbox
        name="isDefaultAddress"
        id="is-default-address"
        checked={data?.isDefaultBillingAddress || data?.isDefaultShippingAddress || false}
        onChange={({ name, checked }) => updateData(name, checked)}
        containerClassName="mt-4 md:mb-20 mb-12"
        label={translate('account.address-setDefault')}
      />

      <div className="grid h-fit items-center justify-between gap-32 md:mt-20 md:flex md:gap-0">
        {editedAddressId && (
          <div
            className="flex items-center gap-8 hover:cursor-pointer hover:opacity-70"
            onClick={() => setModalIsOpen(true)}
          >
            <TrashIcon className="size-20 text-gray-600" />
            <span className="text-14 leading-[114%] text-gray-600">{translate('common.delete')}</span>
          </div>
        )}

        <SaveOrCancel onCancel={discardForm} loading={loading} />
      </div>

      <DeleteModal
        modalIsOpen={modalIsOpen}
        loading={loadingDelete}
        closeModal={closeModal}
        handleDelete={handleDelete}
      />
    </AccountForm>
  );
};

export default AddressForm;
