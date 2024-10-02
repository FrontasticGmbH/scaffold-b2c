import { useContext, useEffect, useMemo, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Account } from 'shared/types/account';
import { Address } from 'shared/types/account/Address';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import Typography from 'components/commercetools-ui/atoms/typography';
import { AccountContext } from 'context/account';
import { useFormat } from 'helpers/hooks/useFormat';
import useI18n from 'helpers/hooks/useI18n';
import useValidate from 'helpers/hooks/useValidate';
import countryStates from 'static/states.json';
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
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });
  const { formatMessage } = useFormat({ name: 'common' });

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
    { label: formatCheckoutMessage({ id: 'shippingAddress', defaultMessage: 'Shipping Address' }), value: 'shipping' },
    { label: formatCheckoutMessage({ id: 'billingAddress', defaultMessage: 'Billing Address' }), value: 'billing' },
  ];

  const formTitle = formatAccountMessage(
    editedAddressId
      ? { id: 'address.edit', defaultMessage: 'Edit address' }
      : { id: 'address.add', defaultMessage: 'Add an address' },
  );

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
      .then(() =>
        toast.success(formatAccountMessage({ id: 'address.deleted', defaultMessage: 'Account deleted successfully' })),
      )
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
        label={formatMessage({ id: 'firstName', defaultMessage: 'First Name' })}
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
        label={formatMessage({ id: 'lastName', defaultMessage: 'Last Name' })}
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
        label={`${formatMessage({ id: 'address', defaultMessage: 'Address' })} 1`}
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
        label={`${formatMessage({ id: 'address', defaultMessage: 'Address' })} 2 (${formatMessage({
          id: 'optional',
          defaultMessage: 'Optional',
        })})`}
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
            label={formatMessage({ id: 'zipCode', defaultMessage: 'Postal Code' })}
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
            label={formatMessage({ id: 'city', defaultMessage: 'City' })}
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
          label={formatMessage({
            id: 'state',
            defaultMessage: 'State',
          })}
        />
      )}

      <Dropdown
        name="addressType"
        items={addressTypes}
        className="w-full border-neutral-500"
        onChange={handleChange}
        defaultValue={editedAddressId ? mapPropsToAddress(data).addressType : addressTypes[0].value}
        label={formatAccountMessage({
          id: 'address.type',
          defaultMessage: 'Address type',
        })}
      />

      <Checkbox
        name="isDefaultAddress"
        id="is-default-address"
        checked={data?.isDefaultBillingAddress || data?.isDefaultShippingAddress || false}
        onChange={({ name, checked }) => updateData(name, checked)}
        containerClassName="mt-4 md:mb-20 mb-12"
        label={formatAccountMessage({
          id: 'address.setDefault',
          defaultMessage: 'Save as default address',
        })}
      />

      <div className="grid h-fit items-center justify-between gap-32 md:mt-20 md:flex md:gap-0">
        {editedAddressId && (
          <div
            className="flex items-center gap-8 hover:cursor-pointer hover:opacity-70"
            onClick={() => setModalIsOpen(true)}
          >
            <TrashIcon className="size-20 text-secondary-black" />
            <Typography className="text-14 leading-[114%] text-secondary-black" as="span">
              {formatMessage({ id: 'delete', defaultMessage: 'Delete' })}
            </Typography>
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
