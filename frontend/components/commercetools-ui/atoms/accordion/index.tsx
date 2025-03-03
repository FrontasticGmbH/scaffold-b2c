import React, { ReactNode } from 'react';
import { Disclosure, Transition, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import useClassNames from 'helpers/hooks/useClassNames';
import AccordionButton from './AccordionButton';

export interface AccordionProps {
  index?: number;
  variant?: 'arrow' | 'plusAndMinus';
  accordionListLength?: number;
  className?: string;
  openSectionTitle?: string;
  closedSectionTitle?: string;
  iconClassName?: string;
  buttonClassName?: string;
  buttonWrapperClassName?: string;
  panelClassName?: string;
  collapsedLabel?: string;
  customOpenButton?: ReactNode;
  customClosedButton?: ReactNode;
  onClick?: () => void;
  defaultOpen?: boolean;
  ref?: React.RefObject<HTMLDivElement | null>;
}

const Accordion = ({
  ref,
  variant = 'arrow',
  closedSectionTitle,
  openSectionTitle = closedSectionTitle,
  children,
  className = '',
  iconClassName = '',
  buttonClassName = '',
  buttonWrapperClassName = '',
  panelClassName = '',
  collapsedLabel,
  customClosedButton,
  customOpenButton = customClosedButton,
  defaultOpen = false,
  onClick,
}: React.PropsWithChildren<AccordionProps>) => {
  const panelClassNames = useClassNames([panelClassName]);

  return (
    <div className={className} onClick={onClick} ref={ref}>
      <Disclosure as="div" defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            {(open && !customOpenButton) || (!open && !customClosedButton) ? (
              <AccordionButton
                open={open}
                variant={variant}
                collapsedLabel={collapsedLabel}
                buttonClassName={buttonClassName}
                iconClassName={iconClassName}
                openSectionTitle={openSectionTitle}
                closedSectionTitle={openSectionTitle}
                buttonWrapperClassName={buttonWrapperClassName}
              />
            ) : (
              <DisclosureButton className={buttonClassName}>
                {open ? customOpenButton : customClosedButton}
              </DisclosureButton>
            )}

            <Transition
              enter="transition duration-150 ease-out"
              enterFrom="transform scale-y-95 opacity-0"
              enterTo="transform scale-y-100 opacity-100"
              leave="transition duration-100 ease-out"
              leaveFrom="transform scale-y-100 opacity-100"
              leaveTo="transform scale-y-95 opacity-0"
              unmount={false}
            >
              <DisclosurePanel className={panelClassNames} unmount={false}>
                {children}
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Accordion;
