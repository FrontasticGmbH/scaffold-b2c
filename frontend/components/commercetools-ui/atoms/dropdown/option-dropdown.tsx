import React, { useCallback, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Option } from './index';
import Typography from '../typography';

export interface Props {
  error?: boolean;
  label?: string;
  required?: boolean;
  labelClassName?: string;
  options?: Option[];
  defaultValue?: Option;
  onChange?: (option: Option) => void;
  selectButtonClassName?: string;
}

const Select: React.FC<Props> = ({
  error,
  onChange,
  defaultValue,
  label,
  required,
  labelClassName = '',
  selectButtonClassName,
  options = [],
}) => {
  const [selected, setSelected] = useState<Option | undefined>(defaultValue ?? options?.[0]);

  useEffect(() => {
    setSelected(defaultValue ?? options?.[0]);
  }, [defaultValue, options]);

  const handleChange = useCallback(
    (option: Option) => {
      setSelected(option);
      onChange?.(option);
    },
    [onChange],
  );

  const buttonClassNames = useCallback(
    (open?: boolean) => {
      return `${error ? 'border-accent-red' : 'border-neutral-500'}
        cursor-pointer relative flex h-[40px] cursor-default items-center rounded-sm border pl-8 pr-32 text-left
        ${
          open
            ? 'rounded-t-sm rounded-b-none border-x-neutral-500 border-b-neutral-400 border-t-neutral-500'
            : 'rounded-sm'
        }
        w-full bg-white py-12 focus:border-gray-500 focus:shadow-md active:border-gray-500
        ${selectButtonClassName}`;
    },
    [selectButtonClassName, error],
  );

  return (
    <>
      {label && (
        <div className="mb-8">
          <Typography as="label" className={`${labelClassName} text-14 font-medium text-secondary-black`}>
            {required ? `${label} *` : label}
          </Typography>
        </div>
      )}
      <Listbox value={selected} onChange={handleChange}>
        {({ open }) => (
          <div className="relative w-full">
            <Listbox.Button className={buttonClassNames(open)}>
              <span className="text-14">{selected?.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
                <ChevronDownIcon className="h-20 w-20 text-secondary-black" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform origin-top scale-y-0"
              enterTo="transform origin-top scale-y-100"
              leave="transition ease-in duration-100"
              leaveFrom="transform origin-top scale-y-150"
              leaveTo="transform origin-top scale-y-0"
            >
              <Listbox.Options
                className={(active) =>
                  `absolute top-39 z-50 max-h-200 w-full overflow-scroll rounded-b-sm border py-8 ${
                    active ? 'border-x-neutral-500 border-b-neutral-500' : 'border-neutral-400'
                  } bg-white`
                }
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-4 pl-8 pr-4 text-14 hover:bg-neutral-200 ${
                        active ? 'bg-neutral-200' : ''
                      }`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate text-14 ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </>
  );
};

export default Select;
