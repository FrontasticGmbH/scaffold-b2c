import React, { useContext, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import { AccountContext } from 'context/account';
import useI18n from 'helpers/hooks/useI18n';
import AddressForm from '../steps/sections/addresses/components/address-form';
import useMappers from '../steps/sections/addresses/hooks/useMappers';
import { Address } from '../steps/sections/addresses/types';

interface Props {
  addressType: 'shipping' | 'billing';
  onAfterSubmit: () => void;
}

const CreateAddress = ({ addressType, onAfterSubmit }: Props) => {
  const translate = useTranslations();

  const { addressToAccountAddress } = useMappers();

  const { addShippingAddress, addBillingAddress, loggedIn } = useContext(AccountContext);

  const { country } = useI18n();

  const initialData = useMemo(() => ({ addressType, country }) as Address, [addressType, country]);

  const [saveAsDefault, setSaveAsDefault] = useState(false);

  const {
    register,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<Address>({
    defaultValues: initialData,
  });

  const onSubmit: SubmitHandler<Address> = async (data) => {
    await (data.addressType === 'shipping' ? addShippingAddress : addBillingAddress)({
      ...addressToAccountAddress(data),
      isDefaultShippingAddress: data.addressType === 'shipping' && saveAsDefault,
      isDefaultBillingAddress: data.addressType === 'billing' && saveAsDefault,
    });

    onAfterSubmit?.();
    reset(initialData);
    setSaveAsDefault(false);
  };

  const addressTypeOptions = useMemo(() => {
    return [
      {
        label: translate('checkout.shippingAddress'),
        value: 'shipping',
      },
      { label: translate('checkout.billingAddress'), value: 'billing' },
    ];
  }, [translate]);

  if (!loggedIn) return <></>;

  return (
    <div>
      <p className="text-14 font-semibold uppercase">
        {translate(addressType === 'shipping' ? 'checkout.add-shipping-address' : 'checkout.add-billing-address')}
      </p>
      <AddressForm
        className="mt-32"
        address={watch()}
        setValue={setValue}
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-12">
          <Dropdown
            items={addressTypeOptions}
            className="w-full border-neutral-500"
            label={`${translate('account.address-type')}`}
            disabled
            value={watch('addressType') ?? ''}
            {...register('addressType')}
          />
        </div>
        <div className="mt-16">
          <Checkbox
            label={translate('account.address-setDefault')}
            labelPosition="on-right"
            checked={saveAsDefault}
            onChange={({ checked }) => setSaveAsDefault(checked)}
          />
        </div>
        <div className="mt-32 flex gap-12">
          <Button variant="secondary" className="px-48" type="button" onClick={onAfterSubmit}>
            {translate('common.cancel')}
          </Button>
          <Button variant="primary" className="px-48" type="submit" loading={isSubmitting}>
            {translate('common.save')}
          </Button>
        </div>
      </AddressForm>
    </div>
  );
};

export default CreateAddress;
