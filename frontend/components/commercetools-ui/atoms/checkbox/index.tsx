import React, { useCallback, useRef, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import useClassNames from 'helpers/hooks/useClassNames';
import useControllableState from 'helpers/hooks/useControllable';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import { desktop } from 'helpers/utils/screensizes';
import Typography from '../typography';

export interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'onChange' | 'key'> {
  label?: string;
  labelPosition?: 'on-left' | 'on-right';
  containerClassName?: string;
  onChange?: (props: { name: string; checked: boolean }) => void;
  disableBackground?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  className = '',
  checked,
  onChange,
  onMouseOver,
  onMouseLeave,
  containerClassName,
  label,
  defaultChecked = false,
  labelPosition = 'on-right',
  disableBackground = false,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useControllableState(checked, defaultChecked);

  const [isDesktopSize] = useMediaQuery(desktop);

  const checkboxRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (!isDesktopSize) {
      toggleIsChecked();
    }
  };

  const toggleIsChecked = useCallback(() => {
    onChange?.({ name: props.name ?? '', checked: !isChecked });

    setIsChecked(!isChecked);
  }, [isChecked, onChange, props.name, setIsChecked]);

  const handleMouseOver = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsHovered(isDesktopSize);
    onMouseOver?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  const containerClassNames = useClassNames(['flex items-center gap-12', containerClassName]);
  const buttonClassName = useClassNames([
    'h-20 w-20 min-w-[20px] rounded-sm relative outline outline-1 cursor-pointer',
    isHovered ? 'outline-secondary-black' : 'outline-neutral-400',
  ]);

  const inputClassName = useClassNames([
    'absolute w-full h-full z-[2] checked:bg-none bg-transparent text-transparent border-transparent',
    className,
  ]);

  const iconClassName = useClassNames([
    'absolute top-[50%] z-[1] left-[50%] h-16 w-16 translate-y-[-50%] translate-x-[-50%] stroke-[2px]',
    isChecked || isHovered ? 'block' : 'hidden',
    isChecked && !disableBackground ? 'text-white' : 'text-secondary-black',
  ]);

  const backgroundClassName = useClassNames([
    'absolute z-0 h-20 w-20 rounded-sm',
    { 'bg-secondary-black': !!isChecked },
  ]);

  const LabelElement = (
    <Typography id="input-label" as="label" className="text-14 text-secondary-black">
      {label}
    </Typography>
  );

  return (
    <div className={containerClassNames} onClick={handleContainerClick}>
      {label && labelPosition === 'on-left' && LabelElement}

      <div className={buttonClassName}>
        <input
          ref={checkboxRef}
          type="checkbox"
          aria-labelledby="input-label"
          checked={isChecked}
          className={inputClassName}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onChange={toggleIsChecked}
          {...props}
        />

        <CheckIcon className={iconClassName} />

        {!disableBackground && <div className={backgroundClassName} />}
      </div>

      {label && labelPosition === 'on-right' && LabelElement}
    </div>
  );
};

export default Checkbox;
