import React, { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import { getLocalizationInfo, i18nConfig } from 'project.config';
import countryStates from 'public/static/states.json';
import { Fields, FieldsOptions } from './types';
import { Address } from '../../types';

interface Props {
  className?: string;
  address: Address;
  fields: (options: FieldsOptions) => Fields[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit?: () => void;
}

const AddressForm = ({
  className: containerClassName,
  fields,
  address,
  onChange,
  onSubmit,
  children,
}: React.PropsWithChildren<Props>) => {
  const translate = useTranslations();

  const [enableAddress2, setEnableAddress2] = useState(false);

  const onEnableAddress2 = useCallback(() => setEnableAddress2(true), []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.();
    },
    [onSubmit],
  );

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

  return (
    <form onSubmit={handleSubmit}>
      <div className={`grid grid-cols-3 gap-12 ${containerClassName}`}>
        {fields({ enableAddress2, onEnableAddress2 }).map(
          ({ name, label, labelDesc, type, required, className, render, validate }) => (
            <React.Fragment key={name}>
              <div className={className}>
                <Input
                  name={name}
                  label={label}
                  labelDesc={labelDesc}
                  type={type}
                  required={required}
                  value={address[name as keyof Address]}
                  labelPosition="top"
                  isValid={
                    (!required || (required && !!address[name as keyof Address])) &&
                    (validate ? validate(address[name as keyof Address] as string) : true)
                  }
                  onChange={onChange}
                  hideCheckIcon
                />
                {render?.()}
              </div>
            </React.Fragment>
          ),
        )}
      </div>
      <div className="mt-12">
        <Dropdown
          name="country"
          value={address.country ?? ''}
          items={countries.map(({ name, value }) => ({ label: name, value }))}
          className="w-full border-neutral-500"
          onChange={onChange}
          label={translate('common.country')}
        />
      </div>
      <div className="mt-12">
        {stateInputInfo &&
          (stateInputInfo.type === 'dropdown' ? (
            <Dropdown
              name="state"
              required={stateInputInfo.required}
              value={address?.state ?? ''}
              items={[
                { label: '', value: '' },
                ...stateInputInfo.options.map(({ name, code }) => ({ label: name, value: code })),
              ]}
              className="w-full border-neutral-500"
              onChange={onChange}
              label={stateInputInfo.label}
            />
          ) : (
            <Input
              label={stateInputInfo.label}
              required={stateInputInfo.required}
              type="text"
              name="state"
              value={address?.state ?? ''}
              className="border-neutral-500"
              onChange={onChange}
            />
          ))}
      </div>
      {children}
    </form>
  );
};

export default AddressForm;
