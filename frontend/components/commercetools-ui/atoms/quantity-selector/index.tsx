import React, { useCallback } from 'react';
import useClassNames from 'helpers/hooks/useClassNames';
import useControllableState from 'helpers/hooks/useControllable';
import { QuantitySelectorProps } from './types';

const QuantitySelector = ({
  value: valueProp,
  defaultValue = 0,
  minValue = -Infinity,
  maxValue = Infinity,
  disabled = false,
  className: classNameProp,
  onChange,
}: QuantitySelectorProps) => {
  const [value, setValue] = useControllableState(valueProp, defaultValue);

  const className = useClassNames([
    'flex w-fit items-center gap-12 rounded-sm border border-neutral-400 transition hover:border-neutral-800',
    disabled ? 'cursor-not-allowed bg-neutral-200 text-gray-400' : 'cursor-pointer bg-white text-secondary-black',
    classNameProp,
  ]);

  const normalizeValue = useCallback(
    (val: number) => Math.max(minValue, Math.min(maxValue, val)),
    [minValue, maxValue],
  );

  const handleChange = useCallback(
    (val: number) => {
      if (disabled) return;

      const normalizedValue = normalizeValue(val);

      setValue(normalizedValue);
      onChange?.(normalizedValue);
    },
    [setValue, normalizeValue, onChange, disabled],
  );

  return (
    <div className={className}>
      <button
        disabled={value <= minValue}
        onClick={() => handleChange(value - 1)}
        className="w-36 cursor-[inherit] self-stretch border-r border-neutral-200 px-12 py-3 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-gray-400"
      >
        -
      </button>
      <span className="py-3 text-14">{value}</span>
      <button
        disabled={value >= maxValue}
        onClick={() => handleChange(value + 1)}
        className="w-36 cursor-[inherit] self-stretch border-l border-neutral-200 px-12 py-3 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-gray-400"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
