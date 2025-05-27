import React, { ComponentProps, FC, type JSX } from 'react';
import CustomDropDown from './custom-dropdown';
import DefaultDropdown from './default-dropdown';
import Select from './option-dropdown';

export interface Option {
  name: string;
  value: string | number;
}

export interface DropdownProps extends Omit<ComponentProps<'select'>, 'key'> {
  error?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  items?: Array<{ label: string; value: string }>;
  label?: string;
  value?: string;
  defaultValue?: string;
  customButtonElement?: JSX.Element;
  customButtonClassNames?: (open?: boolean) => string | string;
  customMenuClassNames?: (open?: boolean) => string;
  customMenuWrapperClassNames?: string;
  selectDropdownClassNames?: string;
  selectDefaultValue?: Option;
  selectOptions?: Option[];
  selectOnChange?: (option: Option) => void;
}

const Dropdown: FC<DropdownProps> = ({
  error,
  className = '',
  containerClassName = '',
  labelClassName,
  label,
  items,
  onChange,
  value,
  customButtonElement,
  customButtonClassNames,
  customMenuClassNames,
  customMenuWrapperClassNames,
  selectDropdownClassNames,
  selectDefaultValue,
  selectOptions,
  selectOnChange,
  children,
  ...props
}) => {
  return (
    <>
      {customButtonElement ? (
        <CustomDropDown
          buttonElement={customButtonElement}
          buttonClassNames={customButtonClassNames}
          menuClassNames={customMenuClassNames}
          menuWrapperClassNames={customMenuWrapperClassNames}
        >
          {children}
        </CustomDropDown>
      ) : selectOptions ? (
        <Select
          error={error}
          label={label}
          labelClassName={labelClassName}
          selectButtonClassName={selectDropdownClassNames}
          defaultValue={selectDefaultValue}
          options={selectOptions}
          onChange={selectOnChange}
          required={props.required}
        />
      ) : (
        <DefaultDropdown
          className={className}
          containerClassName={containerClassName}
          labelClassName={labelClassName}
          label={label}
          items={items ?? []}
          onChange={onChange}
          value={value}
          error={error}
          {...props}
        />
      )}
    </>
  );
};

export default Dropdown;
