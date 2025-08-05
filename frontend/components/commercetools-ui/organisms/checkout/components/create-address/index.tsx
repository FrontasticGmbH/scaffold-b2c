import React, { useContext, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { AccountContext } from 'context/account';
import useAddressValidationSchema from 'helpers/hooks/useAddressValidationSchema';
import useI18n from 'helpers/hooks/useI18n';
import AddressForm from '../steps/sections/addresses/components/address-form';
import useMappers from '../steps/sections/addresses/hooks/useMappers';
import { Address } from '../steps/sections/addresses/types';

interface Props {
  addressType: 'shipping' | 'billing';
  onAfterSubmit: () => void;
  onSelectBillingAddress?: (address: Address) => void;
  onSelectShippingAddress?: (address: Address) => void;
}

const CreateAddress = ({ addressType, onAfterSubmit, onSelectBillingAddress, onSelectShippingAddress }: Props) => {
  const translate = useTranslations();

  const { addressToAccountAddress } = useMappers();

  const { addShippingAddress, addBillingAddress, loggedIn } = useContext(AccountContext);

  const { country } = useI18n();

  const initialData = useMemo(() => ({ addressType, country }) as Address, [addressType, country]);

  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const addressValidationSchema = useAddressValidationSchema();

  const {
    register,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<Address>({
    defaultValues: initialData,
    resolver: yupResolver(addressValidationSchema),
  });

  const onSubmit: SubmitHandler<Address> = async (data) => {
    const addressInput = {
      ...addressToAccountAddress(data),
      isDefaultShippingAddress: data.addressType === 'shipping' && saveAsDefault,
      isDefaultBillingAddress: data.addressType === 'billing' && saveAsDefault,
    };

    if (data.addressType === 'shipping' && sameAsBilling) {
      try {
        await addShippingAddress(addressInput);
        const accountResponse = await addBillingAddress(addressInput);

        const createdShippingAddress = accountResponse.addresses?.findLast((address) => address.isShippingAddress);
        const createdBillingAddress = accountResponse.addresses?.findLast((address) => address.isBillingAddress);

        onSelectShippingAddress?.(createdShippingAddress as Address);
        onSelectBillingAddress?.(createdBillingAddress as Address);
      } catch {
        toast.error(translate('error.wentWrong'));
      }
    }

    if (data.addressType === 'shipping' && !sameAsBilling) {
      try {
        const accountResponse = await addShippingAddress(addressInput);

        const createdShippingAddress = accountResponse.addresses?.findLast((address) => address.isShippingAddress);
        onSelectShippingAddress?.(createdShippingAddress as Address);
      } catch {
        toast.error(translate('error.wentWrong'));
      }
    }

    if (data.addressType === 'billing') {
      try {
        const accountResponse = await addBillingAddress(addressInput);
        const createdBillingAddress = accountResponse.addresses?.findLast((address) => address.isBillingAddress);
        onSelectBillingAddress?.(createdBillingAddress as Address);
      } catch {
        toast.error(translate('error.wentWrong'));
      }
    }

    onAfterSubmit?.();
    reset(initialData);
  };

  if (!loggedIn) return <></>;

  return (
    <div>
      <p className="text-14 font-semibold uppercase">
        {translate(addressType === 'shipping' ? 'checkout.shipping-address' : 'checkout.billingAddress')}
      </p>
      <AddressForm
        className="mt-32"
        address={watch()}
        setValue={setValue}
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-20 flex gap-16">
          <Checkbox
            label={translate('account.address-setDefault')}
            labelPosition="on-right"
            checked={saveAsDefault}
            onChange={({ checked }) => setSaveAsDefault(checked)}
          />
          {addressType === 'shipping' && (
            <Checkbox
              label={translate('checkout.use-as-billing-address')}
              labelPosition="on-right"
              checked={sameAsBilling}
              onChange={({ checked }) => setSameAsBilling(checked)}
            />
          )}
        </div>
        <div className="mt-32 flex justify-end gap-12">
          <Button variant="secondary" className="px-48" type="button" onClick={onAfterSubmit}>
            {translate('common.cancel')}
          </Button>
          <Button variant="primary" className="px-48" type="submit" loading={isSubmitting}>
            {translate('common.add-and-continue')}
          </Button>
        </div>
      </AddressForm>
    </div>
  );
};

export default CreateAddress;
