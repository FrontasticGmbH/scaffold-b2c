import React, { Fragment, useCallback } from 'react';
import { Transition, Menu } from '@headlessui/react';

export interface CustomDropdownProps {
  buttonElement?: JSX.Element;
  buttonClassNames?: (open?: boolean) => string | string;
  menuWrapperClassNames?: string;
  menuClassNames?: (open?: boolean) => string | string;
}

const CustomDropDown = ({
  buttonElement,
  buttonClassNames,
  menuWrapperClassNames,
  menuClassNames,
  children,
}: React.PropsWithChildren<CustomDropdownProps>) => {
  const defaultButtonClassNames = useCallback((open?: boolean) => {
    return `flex h-40 w-full items-center justify-between border ${
      open
        ? `rounded-t-sm border-x-neutral-500 border-t-neutral-500 border-b-neutral-400`
        : 'rounded-sm border-neutral-500'
    } bg-white px-16 py-12 active:border-gray-500 focus:border-gray-500 focus:shadow-md`;
  }, []);

  const defaultMenuClassNames = useCallback((open?: boolean) => {
    return `max-h-300 overflow-scroll rounded-b-sm border ${
      open ? `border-x-neutral-500 border-b-neutral-500` : 'border-neutral-400'
    } bg-white`;
  }, []);

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button as="div" className={buttonClassNames ? buttonClassNames(open) : defaultButtonClassNames(open)}>
            {buttonElement}
          </Menu.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform origin-top scale-y-0"
            enterTo="transform origin-top scale-y-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform origin-top scale-y-150"
            leaveTo="transform origin-top scale-y-0"
          >
            <Menu.Items className={menuWrapperClassNames ?? 'absolute left-0 top-40 w-full'}>
              <div className={menuClassNames ? menuClassNames(open) : defaultMenuClassNames(open)}>{children}</div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default CustomDropDown;
