import { useContext, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Account } from 'shared/types/account';
import { Address } from 'shared/types/account/Address';
import { useTranslations } from 'use-intl';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import { AccountContext } from 'context/account';
import useI18n from 'helpers/hooks/useI18n';
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
  countries?: Array<{ name: string; value: string }>;
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

interface Inputs extends AddressFormData {
  firstName: string;
  lastName: string;
  streetName: string;
  additionalAddressInfo?: string;
  postalCode: string;
  city: string;
  state?: string;
  country: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ editedAddressId, countries = [] }) => {
  const translate = useTranslations();

  const searchParams = useSearchParams();

  const defaultTypeForNewAddress = (searchParams.get('type') ?? 'shipping') as AddressType;

  const { removeAddress, account } = useContext(AccountContext);
  const { mapPropsToAddress } = usePropsToAddressType();
  const { discardForm } = useDiscardForm();
  const { notifyDataUpdated, notifyWentWrong } = useFeedbackToasts();
  const { country } = useI18n();

  const [loadingDelete, setLoadingDelete] = useState(false);

  //new address data
  const defaultData = useMemo(() => {
    if (!editedAddressId) return { country, addressType: defaultTypeForNewAddress } as AddressFormData;

    const accountAddress = account?.addresses?.find(
      (address) => address.addressId === editedAddressId,
    ) as AddressFormData;

    if (accountAddress) {
      accountAddress.addressType = mapPropsToAddress(accountAddress).addressType;
    }

    return accountAddress;
  }, [account?.addresses, country, editedAddressId, mapPropsToAddress, defaultTypeForNewAddress]);

  const isTheOnlyAddress =
    (account?.addresses ?? []).filter((address) =>
      defaultData?.isShippingAddress ? address.isShippingAddress : address.isBillingAddress,
    ).length === 1;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    getValues,
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      firstName: '',
      lastName: '',
      streetName: '',
      additionalAddressInfo: '',
      postalCode: '',
      city: '',
      state: '',
      country: '',
      ...defaultData,
    },
  });

  const data = watch();

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const stateInputInfo = useMemo(() => {
    switch (data.country) {
      case 'US':
        return {
          type: 'dropdown',
          label: translate('common.state'),
          options: countryStates[data.country as keyof typeof countryStates],
          required: true,
        };
      case 'UK':
        return {
          type: 'text',
          label: translate('common.county'),
          options: [],
          required: false,
        };
      case 'EU':
      case 'CA':
        return {
          type: 'text',
          label: translate('common.province-region'),
          options: [],
          required: true,
        };
      default:
        return null;
    }
  }, [translate, data.country]);

  const addressTypes: AddressTypeOptions = [
    { label: translate('checkout.shippingAddress'), value: 'shipping' },
    { label: translate('checkout.billingAddress'), value: 'billing' },
  ];

  const discardFormAndNotify = (promise: Promise<Account | void>) => {
    promise.then(discardForm).then(notifyDataUpdated).catch(notifyWentWrong);
  };

  const handleDelete = () => {
    setLoadingDelete(true);

    removeAddress(getValues('addressId'))
      .then(() => setLoadingDelete(false))
      .then(closeModal)
      .then(() => toast.success(translate('account.address-deleted')))
      .then(discardForm);
  };

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    const { addAddress, updateAddress } = mapPropsToAddress(formData);

    if (editedAddressId) {
      discardFormAndNotify(updateAddress());
      return;
    }

    discardFormAndNotify(addAddress());
  };

  return (
    <AccountForm
      onSubmit={handleSubmit(onSubmit)}
      loading={isSubmitting}
      containerClassName="grid gap-12 md:px-24 md:px-0"
    >
      <Input
        label={translate('common.firstName')}
        required
        type="text"
        id="first-name"
        autoComplete="given-name"
        className="border-neutral-500"
        {...register('firstName', { required: { value: true, message: translate('common.fieldIsRequired') } })}
        error={errors.firstName?.message}
      />

      <Input
        label={translate('common.lastName')}
        required
        type="text"
        id="last-name"
        autoComplete="family-name"
        className="border-neutral-500"
        {...register('lastName', { required: { value: true, message: translate('common.fieldIsRequired') } })}
        error={errors.lastName?.message}
      />

      <Input
        label={`${translate('common.address')} 1`}
        type="text"
        required
        id="street-name"
        autoComplete="address-line1"
        className="border-neutral-500"
        {...register('streetName', { required: { value: true, message: translate('common.fieldIsRequired') } })}
        error={errors.streetName?.message}
      />

      <Input
        label={`${translate('common.address')} 2 (${translate('common.optional')})`}
        type="text"
        id="additional-address-info"
        autoComplete="address-line2"
        className="border-neutral-500"
        {...register('additionalAddressInfo')}
      />

      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-3 md:col-span-1">
          <Input
            label={translate('common.zipCode')}
            required
            type="text"
            id="postal-code"
            autoComplete="postal-code"
            className="border-neutral-500"
            {...register('postalCode', { required: { value: true, message: translate('common.fieldIsRequired') } })}
            error={errors.postalCode?.message}
          />
        </div>

        <div className="col-span-3 md:col-span-2">
          <Input
            label={translate('common.city')}
            required
            type="text"
            id="city"
            autoComplete="address-level2"
            className="border-neutral-500"
            {...register('city', { required: { value: true, message: translate('common.fieldIsRequired') } })}
            error={errors.city?.message}
          />
        </div>
      </div>

      <Dropdown
        items={countries.map(({ name, value }) => ({ label: name, value }))}
        className="w-full border-neutral-500"
        {...register('country')}
        label={translate('common.country')}
      />

      {stateInputInfo &&
        (stateInputInfo.type === 'dropdown' ? (
          <Dropdown
            required={stateInputInfo.required}
            items={[
              { label: '', value: '' },
              ...stateInputInfo.options.map(({ name, code }) => ({ label: name, value: code })),
            ]}
            className="w-full border-neutral-500"
            label={stateInputInfo.label}
            {...register('state', {
              required: { value: stateInputInfo.required, message: translate('common.fieldIsRequired') },
            })}
            error={!!errors.state?.message}
          />
        ) : (
          <Input
            label={stateInputInfo.label}
            required={stateInputInfo.required}
            type="text"
            className="border-neutral-500"
            {...register('state', {
              required: { value: stateInputInfo.required, message: translate('common.fieldIsRequired') },
            })}
          />
        ))}

      <Dropdown
        items={addressTypes}
        className="w-full border-neutral-500"
        defaultValue={editedAddressId ? mapPropsToAddress(getValues()).addressType : addressTypes[0].value}
        label={translate('account.address-type')}
        {...register('addressType')}
      />

      <Checkbox
        name="isDefaultAddress"
        id="is-default-address"
        checked={data?.isDefaultBillingAddress || data?.isDefaultShippingAddress || data?.isDefaultAddress || false}
        onChange={(item) => setValue('isDefaultAddress', item.checked)}
        containerClassName="mt-4 md:mb-20 mb-12"
        label={translate('account.address-setDefault')}
      />

      <div className="grid h-fit items-center justify-between gap-32 md:mt-20 md:flex md:gap-0">
        {editedAddressId && (
          <div
            className="flex items-center gap-8 text-red-600 hover:cursor-pointer hover:opacity-70"
            onClick={() => setModalIsOpen(true)}
          >
            <TrashIcon className="size-20 stroke-[2px]" />
            <span className="font-semibold leading-[114%]">{translate('common.delete')}</span>
          </div>
        )}

        <SaveOrCancel onCancel={discardForm} loading={isSubmitting} />
      </div>

      <DeleteModal
        modalIsOpen={modalIsOpen}
        loading={loadingDelete}
        closeModal={closeModal}
        handleDelete={handleDelete}
        canDelete={!(defaultData.isDefaultBillingAddress || defaultData.isDefaultShippingAddress) || isTheOnlyAddress}
      />
    </AccountForm>
  );
};

export default AddressForm;
