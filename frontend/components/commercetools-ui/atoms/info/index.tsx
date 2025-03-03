import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { InformationCircleIcon as InfoIcon } from '@heroicons/react/24/outline';

interface Props {
  message: string;
}

const Info: React.FC<Props> = ({ message }) => {
  const [isShowing, setIsShowing] = useState(false);

  return (
    <div className="relative">
      <InfoIcon
        data-testid="info-icon"
        className="size-24 cursor-default stroke-gray-600"
        onMouseOver={() => setIsShowing(true)}
        onMouseOut={() => setIsShowing(false)}
      />
      <Transition
        as="div"
        show={isShowing}
        className="absolute right-0 top-1/2 w-max max-w-260 -translate-y-1/2 translate-x-[calc(100%+24px)] rounded-md border border-neutral-500 bg-white p-12"
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <p className="text-12 leading-[15px] text-gray-600">{message}</p>
      </Transition>
    </div>
  );
};

export default Info;
