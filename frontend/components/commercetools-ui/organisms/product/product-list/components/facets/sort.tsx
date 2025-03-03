import React, { useMemo } from 'react';
import { Popover, Transition, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDownIcon as ArrowIcon } from '@heroicons/react/24/solid';
import { IoCheckmark as CheckIcon } from 'react-icons/io5';
import { useFormat } from 'helpers/hooks/useFormat';
import { useProductList } from '../../context';

const SortFacet: React.FC = () => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { replaceSort, activeSort } = useProductList();

  const options = useMemo<Array<{ label: string; attribute: string; value: 'asc' | 'desc' }>>(() => {
    return [
      {
        label: formatProductMessage({ id: 'relevance', defaultMessage: '' }),
        attribute: '',
        value: 'desc',
      },
      {
        label: formatProductMessage({ id: 'price', defaultMessage: 'Price' }),
        attribute: 'price',
        value: 'asc',
      },
      {
        label: formatProductMessage({ id: 'best-selling', defaultMessage: 'Best-Selling' }),
        attribute: 'reviewRatingStatistics.highestRating',
        value: 'desc',
      },
      {
        label: formatProductMessage({ id: 'newest', defaultMessage: 'Newest' }),
        attribute: 'lastModifiedAt',
        value: 'desc',
      },
    ];
  }, [formatProductMessage]);

  return (
    <Popover className="relative">
      <PopoverButton
        name="Sort Option"
        className="items-center rounded-md border border-gray-300 bg-white py-8 pl-12 pr-4"
      >
        <div className="relative flex w-32 min-w-230 items-center justify-between">
          <span className="text-14 text-gray-600">
            {options.find((option) => option.attribute === activeSort?.attribute)?.label}
          </span>
          <ArrowIcon
            data-testid="chevron-down-icon"
            className="absolute right-5 top-1/2 z-0 h-20 w-30 -translate-y-1/2 stroke-1 text-gray-600"
          />
        </div>
      </PopoverButton>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform origin-top scale-y-0"
        enterTo="transform origin-top scale-y-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform origin-top scale-y-150"
        leaveTo="transform origin-top scale-y-0"
      >
        <PopoverPanel className="absolute left-0 top-40 z-[300] mt-2 w-full rounded-b-sm border bg-white">
          {options.map(({ label, attribute, value }) => (
            <PopoverButton
              key={attribute}
              className="flex w-full justify-between px-12 py-8 transition hover:bg-neutral-200"
              onClick={() => replaceSort({ attribute, value })}
            >
              <span className="text-14 text-gray-700">{label}</span>
              {attribute === activeSort?.attribute && <CheckIcon className="size-20 text-gray-700" />}
            </PopoverButton>
          ))}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default SortFacet;
