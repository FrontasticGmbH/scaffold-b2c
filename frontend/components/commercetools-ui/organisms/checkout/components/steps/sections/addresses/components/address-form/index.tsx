import React, { useCallback, useState } from 'react';
import Input from 'components/commercetools-ui/atoms/input';
import { Fields, FieldsOptions } from './types';
import { Address } from '../../types';

interface Props {
  className?: string;
  address: Address;
  fields: (options: FieldsOptions) => Fields[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  const [enableAddress2, setEnableAddress2] = useState(false);

  const onEnableAddress2 = useCallback(() => setEnableAddress2(true), []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.();
    },
    [onSubmit],
  );

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
      {children}
    </form>
  );
};

export default AddressForm;
