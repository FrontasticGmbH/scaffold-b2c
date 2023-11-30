import React, { ChangeEvent, ComponentProps, FC, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import useClassNames from 'helpers/hooks/useClassNames';
import Typography from '../typography';

export interface DropdownProps extends ComponentProps<'select'> {
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  items: Array<{ label: string; value: string }>;
  label?: string;
  value?: string;
  defaultValue?: string;
}

const DefaultDropdown: FC<DropdownProps> = ({
  className = '',
  containerClassName = '',
  labelClassName,
  label,
  items,
  onChange,
  value,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange?.(e);
  };

  const containerClassNames = useClassNames(['grid', containerClassName]);

  const selectClassName = useClassNames([
    'absolute font-body z-[1] h-40 text-14 border-none focus:ring-0 rounded-sm w-full bg-transparent bg-none font-regular leading-loose pl-12 pr-0 py-0',
    className,
  ]);

  const labelClassNames = useClassNames([
    'mb-8 text-secondary-black leading-loose font-medium text-14',
    labelClassName,
  ]);

  return (
    <div className={containerClassNames}>
      {label && (
        <Typography as="label" className={labelClassNames}>
          {`${label}${props.required ? ' *' : ''}`}
        </Typography>
      )}

      <div className="relative h-40 min-w-[64px] overflow-hidden rounded-sm border border-neutral-500">
        <select className={selectClassName} value={value || selectedValue} onChange={handleChange} {...props}>
          {items.map(({ label, value }, index) => (
            <option key={index} value={value}>
              {label}
            </option>
          ))}
        </select>

        <ChevronDownIcon className="absolute right-5 top-[50%] z-0 h-20 w-30 translate-y-[-50%] stroke-1 text-secondary-black" />
      </div>
    </div>
  );
};

export default DefaultDropdown;
