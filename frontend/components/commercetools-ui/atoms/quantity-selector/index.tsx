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
  const normalizeValue = useCallback(
    (val: number) => Math.max(minValue, Math.min(maxValue, val)),
    [minValue, maxValue],
  );

  const [value, setValue] = useControllableState(valueProp ? normalizeValue(valueProp) : undefined, defaultValue);

  const className = useClassNames([
    'flex w-fit items-center gap-12 rounded-sm border border-neutral-400 transition hover:border-neutral-800',
    disabled ? 'cursor-not-allowed bg-neutral-200 text-gray-400' : 'cursor-pointer bg-white text-secondary-black',
    classNameProp,
  ]);

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
      <button onClick={() => handleChange(value - 1)} className="cursor-[inherit] py-3 pl-12">
        -
      </button>
      <span className="py-3 text-14">{value}</span>
      <button onClick={() => handleChange(value + 1)} className="cursor-[inherit] py-3 pr-12">
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
