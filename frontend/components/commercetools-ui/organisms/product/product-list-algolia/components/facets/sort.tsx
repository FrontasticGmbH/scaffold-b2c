import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon as ArrowIcon } from '@heroicons/react/24/solid';
import { IoCheckmark as CheckIcon } from 'react-icons/io5';
import { useSortBy, UseSortByProps } from 'react-instantsearch';

const SortFacet: React.FC<UseSortByProps> = (props) => {
  const { currentRefinement, options, refine } = useSortBy(props);

  return (
    <Popover className="relative">
      <Popover.Button className="items-center rounded-md border border-gray-300 bg-white py-8 pl-12 pr-4">
        <div className="relative flex w-32 min-w-230 cursor-pointer items-center justify-between">
          <span className="text-14 capitalize text-gray-600">
            {options.find((option) => option.value === currentRefinement)?.label}
          </span>
          <ArrowIcon
            data-testid="chevron-down-icon"
            className="absolute right-5 top-1/2 z-0 h-20 w-30 -translate-y-1/2 stroke-1 text-secondary-black"
          />
        </div>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform origin-top scale-y-0"
        enterTo="transform origin-top scale-y-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform origin-top scale-y-150"
        leaveTo="transform origin-top scale-y-0"
      >
        <Popover.Panel className="absolute left-0 top-40 z-[300] mt-2 w-full rounded-b-sm border bg-white">
          {options.map(({ label, value }) => (
            <button
              key={label}
              className="flex w-full justify-between px-12 py-8 transition hover:bg-neutral-200"
              onClick={() => refine(value)}
            >
              <span className="text-14 text-gray-700">{label}</span>
              {value === currentRefinement && <CheckIcon className="size-20 text-gray-700" />}
            </button>
          ))}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default SortFacet;
