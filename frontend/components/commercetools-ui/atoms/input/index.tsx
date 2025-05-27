import React, { ComponentProps, FC, useMemo, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import useClassNames from 'helpers/hooks/useClassNames';
import { StringHelpers } from 'helpers/stringHelpers';

export interface InputProps extends ComponentProps<'input'> {
  label?: string;
  labelDesc?: string;
  variant?: 'primary' | 'secondary';
  labelPosition?: 'top' | 'inline';
  error?: string;
  errorMessage?: string;
  hideCheckIcon?: boolean;
  renderEndIcon?: () => React.ReactNode;
  isDirty?: boolean;
}

const Input: FC<InputProps> = ({
  label,
  labelDesc,
  variant = 'primary',
  labelPosition = 'top',
  className = '',
  errorMessage,
  children,
  hideCheckIcon,
  isDirty = false,
  onFocus,
  onBlur,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const bgClassName = useMemo(
    () =>
      ({
        primary: 'bg-white',
        secondary: 'bg-neutral-200',
      })[variant],
    [variant],
  );

  const labelClassName = useClassNames([
    labelPosition ? 'leading-loose' : 'leading-normal',
    labelPosition === 'top' ? 'text-14' : 'text-10',
    'font-medium',
    { ['text-gray-600']: labelPosition === 'top' },
    { [isFocused && label ? 'opacity-1 scale-100' : 'scale-0 opacity-0']: labelPosition === 'inline' },
    {
      ['absolute top-[6px] left-[12px] font-medium block transition duration-150 ease-out']: labelPosition === 'inline',
    },
  ]);

  const labelContainerClassName = useClassNames([
    {
      'mb-8': labelPosition === 'top',
    },
  ]);

  const inputClassName = useClassNames([
    'h-40 focus:border-gray-500 focus:ring-0 w-full rounded-sm border border-neutral-500 px-12 text-primary placeholder:text-14 placeholder:leading-normal placeholder:text-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-400',
    bgClassName,
    isFocused && label && labelPosition == 'inline' ? 'pt-[20px] pb-[4px]' : 'py-10',
    {
      'border-red-500 focus:border-red-500': !!error,
    },
    { 'border-green-500 focus:border-green-500': !error && isFocused && isDirty },
    className,
  ]);

  const id = StringHelpers.convertToKebabCase(props.name);

  return (
    <div className="relative">
      <div className={labelContainerClassName}>
        {label && (
          <label className={labelClassName} htmlFor={id}>
            {props.required ? `${label} *` : label}
          </label>
        )}
        {labelDesc && <label className={labelClassName}>{` (${labelDesc})`}</label>}
      </div>
      <div className="relative">
        <input
          className={inputClassName}
          ref={props.ref}
          id={id}
          {...(error && { 'aria-describedby': `${id}_input_error` })}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {isDirty && !error && !isFocused && !hideCheckIcon && (
          <CheckIcon
            data-testid="check-icon"
            className="absolute right-12 top-1/2 size-16 -translate-y-1/2 text-green-500"
          />
        )}
        {children}
      </div>
      {error && (
        <span className="text-12 font-medium leading-[16px] text-red-500" id={`${id}_input_error`}>
          {error ?? errorMessage}
        </span>
      )}
    </div>
  );
};

export default Input;
