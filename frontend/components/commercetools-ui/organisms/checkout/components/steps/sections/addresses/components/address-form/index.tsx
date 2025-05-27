import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import { EMAIL_REGX } from 'helpers/constants/auth';
import useGeo from 'helpers/hooks/useGeo';
import { getLocalizationInfo, i18nConfig } from 'project.config';
import countryStates from 'public/static/states.json';
import { Address } from '../../types';

interface Props {
  className?: string;
  register: UseFormRegister<Address>;
  setValue: UseFormSetValue<Address>;
  errors: FieldErrors<Address>;
  address: Address;
  onSubmit?: () => void;
}

const AddressForm = ({
  className: containerClassName,
  children,
  register,
  setValue,
  errors,
  address,
  onSubmit,
}: React.PropsWithChildren<Props>) => {
  const translate = useTranslations();

  const [enableAddress2, setEnableAddress2] = useState(false);
  const { getInfoByZipcode } = useGeo();

  const countries = i18nConfig.locales.map((locale) => {
    const { countryName, countryCode } = getLocalizationInfo(locale);
    return { name: countryName, value: countryCode };
  });

  const stateInputInfo = useMemo(() => {
    switch (address.country) {
      case 'US':
        return {
          type: 'dropdown',
          label: translate('common.state'),
          options: countryStates[address.country as keyof typeof countryStates],
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
  }, [translate, address.country]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={`grid grid-cols-3 gap-12 ${containerClassName}`}>
        <div className="col-span-3">
          <Input
            type="string"
            label={translate('common.firstName')}
            {...register('firstName', { required: { value: true, message: translate('common.fieldIsRequired') } })}
            error={errors.firstName?.message}
            required
          />
        </div>
        <div className="col-span-3">
          <Input
            type="string"
            label={translate('common.lastName')}
            {...register('lastName', { required: { value: true, message: translate('common.fieldIsRequired') } })}
            error={errors.lastName?.message}
            required
          />
        </div>
        <div className="col-span-3">
          <Input
            type="email"
            label={translate('common.email')}
            {...register('email', {
              required: { value: true, message: translate('common.fieldIsRequired') },
              pattern: { value: EMAIL_REGX, message: translate('error.email') },
            })}
            error={errors.email?.message}
            required
          />
        </div>

        <div className="col-span-3">
          <Input
            type="string"
            label={translate('common.phone')}
            labelDesc={translate('checkout.for-other-updates')}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
        <div className="col-span-3">
          <Input
            type="string"
            label={translate('common.address')}
            {...register('line1', { required: { value: true, message: translate('common.fieldIsRequired') } })}
            error={errors.line1?.message}
            required
          />
        </div>

        {enableAddress2 ? (
          <div className="col-span-3">
            <Input name="line2" label={`${translate('common.address')} 2`} type="string" />
          </div>
        ) : (
          <div className="col-span-3 mt-16">
            <button type="button" onClick={() => setEnableAddress2(true)} className="w-fit text-14 text-gray-600">
              {`+ ${translate('checkout.add-address')}`}
            </button>
          </div>
        )}

        <Input
          type="string"
          label={translate('common.zipCode')}
          {...register('postalCode', {
            required: { value: true, message: translate('common.fieldIsRequired') },
            onChange: (event) => {
              getInfoByZipcode(event.target.value).then((data) => {
                if (data.places?.[0]) {
                  setValue('city', data.places[0]['place name'] ?? '');
                }
              });
            },
          })}
          error={errors.postalCode?.message}
          required
        />

        <Input
          type="string"
          label={translate('common.city')}
          {...register('city', { required: { value: true, message: translate('common.fieldIsRequired') } })}
          error={errors.city?.message}
          required
        />
      </div>
      <div className="mt-12">
        <Dropdown
          value={address.country ?? ''}
          items={countries.map(({ name, value }) => ({ label: name, value }))}
          className="w-full border-neutral-500"
          label={translate('common.country')}
          {...register('country')}
        />
      </div>
      <div className="mt-12">
        {stateInputInfo &&
          (stateInputInfo.type === 'dropdown' ? (
            <Dropdown
              required={stateInputInfo.required}
              value={address?.state ?? ''}
              items={[
                { label: '', value: '' },
                ...stateInputInfo.options.map(({ name, code }) => ({ label: name, value: code })),
              ]}
              className="w-full border-neutral-500"
              {...register('state', {
                required: { value: stateInputInfo.required, message: translate('common.fieldIsRequired') },
              })}
              error={!!errors.state?.message}
              label={stateInputInfo.label}
            />
          ) : (
            <Input
              label={stateInputInfo.label}
              required={stateInputInfo.required}
              type="text"
              value={address?.state ?? ''}
              className="border-neutral-500"
              {...register('state', {
                required: { value: stateInputInfo.required, message: translate('common.fieldIsRequired') },
              })}
              error={errors.state?.message}
            />
          ))}
      </div>
      {children}
    </form>
  );
};

export default AddressForm;
