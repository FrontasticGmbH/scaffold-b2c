import React, { ComponentProps, FC, MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import useClassNames from 'helpers/hooks/useClassNames';
import useControllableState from 'helpers/hooks/useControllable';
import Typography from '../typography';

export interface InputProps extends Omit<ComponentProps<'input'>, 'onChange' | 'key'> {
  label?: string;
  labelDesc?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: 'primary' | 'secondary';
  labelPosition?: 'top' | 'inline';
  innerRef?: MutableRefObject<HTMLInputElement>;
  error?: string;
  errorMessage?: string;
  isValid?: boolean;
  hideCheckIcon?: boolean;
  validation?: (valueToValidate: string) => boolean;
  renderEndIcon?: () => React.ReactNode;
}

const Input: FC<InputProps> = ({
  label,
  labelDesc,
  onChange,
  onBlur,
  onFocus,
  variant = 'primary',
  labelPosition = 'top',
  className = '',
  innerRef,
  value: valueProp,
  errorMessage,
  validation,
  children,
  hideCheckIcon,
  isValid: isValidProp,
  defaultValue = '',
  ...props
}) => {
  const [value, setValue] = useControllableState(valueProp, defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (validation) {
      const shouldBeValidated = isTouched && isEdited;
      const validated = validation?.(value as string);
      setIsValid(shouldBeValidated && !!validated);
      setIsErrored(shouldBeValidated && !validated);
    }
  }, [isEdited, isTouched, validation, value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      setValue(event.target.value);
      setIsEdited(true);
    },
    [onChange, setValue],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setIsTouched(true);
      onBlur?.(e);
    },
    [onBlur],
  );

  const bgClassName = useMemo(
    () =>
      ({
        primary: 'bg-white',
        secondary: 'bg-neutral-200',
      })[variant],
    [variant],
  );

  const isInActiveState = useMemo(() => isFocused || !!value, [isFocused, value]);

  const labelClassName = useClassNames([
    labelPosition ? 'leading-loose' : 'leading-normal',
    labelPosition === 'top' ? 'text-14' : 'text-10',
    'font-medium',
    { ['text-gray-600']: labelPosition === 'top' },
    { [isInActiveState && label ? 'opacity-1 scale-100' : 'scale-0 opacity-0']: labelPosition === 'inline' },
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
    isInActiveState && label && labelPosition == 'inline' ? 'pt-[20px] pb-[4px]' : 'py-10',
    {
      'border-red-500 focus:border-red-500':
        (!!props.error && isInActiveState) ||
        isErrored ||
        (typeof isValidProp !== 'undefined' && !isValidProp && isTouched),
    },
    { 'border-green-500 focus:border-green-500': (!!isValidProp && isInActiveState) || isValid },
    className,
  ]);

  return (
    <div className="relative">
      <div className={labelContainerClassName}>
        {label && (
          <Typography as="label" className={labelClassName} htmlFor={props.name}>
            {props.required ? `${label} *` : label}
          </Typography>
        )}
        {labelDesc && (
          <Typography as="label" className={labelClassName}>
            {` (${labelDesc})`}
          </Typography>
        )}
      </div>
      <div className="relative">
        <input
          className={inputClassName}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={innerRef}
          value={value}
          id={props.name}
          aria-describedby={`${props.name}_input_error`}
          {...props}
        />
        {(isValid || (isValidProp && !isInActiveState)) && !isFocused && !hideCheckIcon && (
          <CheckIcon
            data-testid="check-icon"
            className="absolute right-12 top-1/2 size-16 -translate-y-1/2 text-green-500"
          />
        )}
        {children}
      </div>
      {(isErrored || props.error) && (
        <Typography
          className="mt-12 text-12 font-medium leading-[16px] text-red-500"
          as="span"
          id={`${props.name}_input_error`}
        >
          {props.error ?? errorMessage}
        </Typography>
      )}
    </div>
  );
};

export default Input;
