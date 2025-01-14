import React, { useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';
import useClassNames from 'helpers/hooks/useClassNames';
import useOnClickOutside from 'helpers/hooks/useOnClickOutside';
import useScrollBlock from 'helpers/hooks/useScrollBlock';
import Overlay from '../overlay';

export interface DrawerProps {
  className?: string;
  isOpen: boolean;
  direction?: 'left' | 'top' | 'right' | 'bottom';
  blockScrolling?: boolean;
  onClose?: () => void;
}

const Drawer = ({
  className = '',
  isOpen,
  direction = 'right',
  blockScrolling = true,
  onClose,
  children,
}: React.PropsWithChildren<DrawerProps>) => {
  const { blockScroll } = useScrollBlock();

  useEffect(() => {
    if (blockScrolling) {
      blockScroll(isOpen);
    }
  }, [isOpen, blockScroll, blockScrolling]);

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => {
    !!isOpen && onClose?.();
  });

  const directionStyles = {
    left: 'left-0 top-0 h-full',
    top: 'left-0 top-0 w-full',
    right: 'right-0 top-0 h-full',
    bottom: 'left-0 bottom-0 w-full',
  };

  const drawerTransitions = {
    left: {
      enterFrom: '-translate-x-full transform opacity-0',
      enterTo: 'translate-x-0 opacity-100 transition',
      leaveFrom: 'translate-x-0 opacity-100 transition',
      leaveTo: '-translate-x-full opacity-0 transition',
    },
    top: {
      enterFrom: '-translate-y-full transform opacity-0',
      enterTo: 'translate-y-0 opacity-100 transition',
      leaveFrom: 'translate-y-0 opacity-100 transition',
      leaveTo: '-translate-y-full opacity-0 transition',
    },
    right: {
      enterFrom: 'translate-x-full transform opacity-0',
      enterTo: '-translate-x-0 opacity-100 transition',
      leaveFrom: '-translate-x-0 opacity-100 transition',
      leaveTo: 'translate-x-full opacity-0 transition',
    },
    bottom: {
      enterFrom: 'translate-y-full transform opacity-0',
      enterTo: '-translate-y-0 opacity-100 transition',
      leaveFrom: '-translate-y-0 opacity-100 transition',
      leaveTo: 'translate-y-full opacity-0 transition',
    },
  };

  const drawerClassName = useClassNames([className, 'fixed z-[999] shadow-lg', directionStyles[direction]]);

  return (
    <>
      {isOpen && <Overlay />}

      <Transition show={isOpen}>
        <Transition.Child
          enter="ease-out"
          enterFrom={drawerTransitions[direction].enterFrom}
          enterTo={drawerTransitions[direction].enterTo}
          leave="ease-in duration-75"
          leaveFrom={drawerTransitions[direction].leaveFrom}
          leaveTo={drawerTransitions[direction].leaveTo}
          className={drawerClassName}
        >
          <div ref={ref} className="h-full">
            <div className="flex h-full flex-col items-stretch">{children}</div>
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
};

export default Drawer;
