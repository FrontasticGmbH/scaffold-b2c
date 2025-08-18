import React, { useContext, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import { AccountContext } from 'context/account';
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
  const { getInfoByZipcode } = useGeo();
  const { loggedIn } = useContext(AccountContext);

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
            {...register('firstName')}
            error={errors.firstName?.message}
            required
          />
        </div>
        <div className="col-span-3">
          <Input
            type="string"
            label={translate('common.lastName')}
            {...register('lastName')}
            error={errors.lastName?.message}
            required
          />
        </div>

        {!loggedIn && (
          <div className="col-span-3">
            <Input
              type="string"
              label={translate('customer-support.email')}
              {...register('email')}
              error={errors.email?.message}
              required
            />
          </div>
        )}

        <div className="col-span-3">
          <Input
            type="string"
            label={translate('customer-support.phone')}
            labelDesc={translate('common.optional')}
            labelDescClassName="text-gray-500 text-sm lowercase"
            {...register('phone')}
          />
        </div>

        <div className="col-span-3 my-8">
          <Dropdown
            value={address.country ?? ''}
            items={countries.map(({ name, value }) => ({ label: name, value }))}
            className="w-full border-neutral-500"
            label={translate('common.country')}
            {...register('country')}
            required
          />
        </div>

        <div className="col-span-3 grid grid-cols-10 gap-16">
          <div className="col-span-10 min-w-112 md:col-span-2">
            <Input
              type="string"
              label={translate('common.street-number')}
              {...register('streetNumber')}
              error={errors.streetNumber?.message}
              required
            />
          </div>

          <div className="col-span-10 md:col-span-8">
            <Input
              type="string"
              label={translate('common.street-name')}
              {...register('streetName')}
              error={errors.streetName?.message}
              required
            />
          </div>
        </div>

        <div className="col-span-3">
          <Input
            type="string"
            label={translate('common.apartment-suite')}
            labelDesc={translate('common.optional')}
            labelDescClassName="text-gray-500 text-sm lowercase"
            {...register('apartment')}
          />
        </div>

        <div className="col-span-3 grid grid-cols-2 gap-16">
          <Input
            type="string"
            label={translate('common.zipCode')}
            {...register('postalCode', {
              onChange: (event) => {
                getInfoByZipcode(event.target.value).then((data) => {
                  const { 'place name': city, 'state abbreviation': state } = data.places?.[0] ?? {};

                  setValue('city', city ?? '');
                  setValue('state', state ?? '');
                });
              },
            })}
            error={errors.postalCode?.message}
            required
          />

          <Input
            type="string"
            label={translate('common.city')}
            {...register('city')}
            error={errors.city?.message}
            required
          />
        </div>
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
              {...register('state')}
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
              {...register('state')}
              error={errors.state?.message}
            />
          ))}
      </div>
      {children}
    </form>
  );
};

export default AddressForm;
