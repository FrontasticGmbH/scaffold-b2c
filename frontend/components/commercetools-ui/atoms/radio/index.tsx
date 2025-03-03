import React from 'react';
import useClassNames from 'helpers/hooks/useClassNames';
import useControllableState from 'helpers/hooks/useControllable';

interface Props extends Omit<React.ComponentProps<'input'>, 'key'> {
  className?: string;
  inputClassName?: string;
  onChecked?: () => void;
}

const Radio: React.FC<Props> = ({
  className = '',
  inputClassName = '',
  onChecked,
  children,
  checked: checkedProp,
  defaultChecked = false,
  onChange,
  ...props
}) => {
  const [checked, setChecked] = useControllableState(checkedProp, defaultChecked);

  const labelClassName = useClassNames([
    'grid place-content-center w-20 h-20 border border-gray-600 rounded-full',
    className,
  ]);

  const inputClassNames = useClassNames(['h-12 w-12 border-0 text-gray-600', inputClassName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onChecked?.();
    setChecked(true);
  };

  return (
    <label className={labelClassName} htmlFor={props.id}>
      <input
        style={{ background: checked ? '#494949' : 'white' }}
        className={inputClassNames}
        type="radio"
        checked={checked}
        onChange={(e) => handleChange(e)}
        {...props}
      />
      {children}
    </label>
  );
};

export default Radio;
