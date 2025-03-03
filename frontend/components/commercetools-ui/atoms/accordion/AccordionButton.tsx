import { FC } from 'react';
import { DisclosureButton } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import useClassNames from 'helpers/hooks/useClassNames';
import { AccordionProps } from '.';
import Typography from '../typography';

type AccordionButtonProps = AccordionProps & {
  open: boolean;
  buttonWrapperClassName?: string;
  buttonClassName?: string;
};

const AccordionButton: FC<AccordionButtonProps> = ({
  open,
  buttonWrapperClassName,
  buttonClassName,
  openSectionTitle,
  closedSectionTitle,
  collapsedLabel,
  variant,
  iconClassName,
}) => {
  const buttonClassNames = useClassNames(['w-full flex justify-between', buttonClassName]);

  return (
    <DisclosureButton className={`${buttonWrapperClassName} w-full`}>
      <div className={buttonClassNames}>
        <Typography className="self-center transition">{open ? openSectionTitle : closedSectionTitle}</Typography>
        <div className="flex items-center gap-8">
          {!open && collapsedLabel && <p className="font-medium text-primary">{collapsedLabel}</p>}
          {variant === 'arrow' ? (
            <ChevronDownIcon width={17.5} strokeWidth={1} className={`${open ? 'rotate-180' : ''} ${iconClassName}`} />
          ) : !open ? (
            <PlusIcon width={17.5} strokeWidth={2} className={iconClassName} />
          ) : (
            <MinusIcon width={17.5} strokeWidth={2} className={iconClassName} />
          )}
        </div>
      </div>
    </DisclosureButton>
  );
};

export default AccordionButton;
