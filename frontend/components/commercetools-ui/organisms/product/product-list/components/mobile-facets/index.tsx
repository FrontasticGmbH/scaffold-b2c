import { useMemo, useState } from 'react';
import { Popover } from '@headlessui/react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/outline';
import { AdjustmentsHorizontalIcon as FiltersIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'use-intl';
import Accordion from 'components/commercetools-ui/atoms/accordion';
import Drawer from 'components/commercetools-ui/atoms/drawer';
import { useProductList } from '../../context';
import useDynamicFacets from '../../hooks/useDynamicFacets';
import SortFacet from '../facets/sort';

const MobileFacets: React.FC = () => {
  const translate = useTranslations();

  const { removeAllRefinements, facetsConfiguration, totalItems } = useProductList();

  const [isOpen, setIsOpen] = useState(false);

  const accordionClassNames = useMemo(
    () => ({
      root: 'py-20 px-16',
      icon: 'stroke-gray-600  w-20 stroke-2',
      border: 'border-b border-neutral-400',
      button: 'text-14',
    }),
    [],
  );

  const facets = useDynamicFacets({
    configuration: facetsConfiguration,
    render: ({ attribute, Component }) => (
      <Accordion
        key={attribute}
        className={`${accordionClassNames.root} ${accordionClassNames.border}`}
        buttonClassName={accordionClassNames.button}
        closedSectionTitle={facetsConfiguration[attribute].label}
        variant="arrow"
        iconClassName={accordionClassNames.icon}
      >
        <div className="px-16 py-28">
          <Popover>{Component}</Popover>
        </div>
      </Accordion>
    ),
  });

  const sortFacet = useMemo(
    () => (
      <Accordion
        className={accordionClassNames.root}
        buttonClassName={accordionClassNames.button}
        closedSectionTitle={translate('product.sortBy')}
        variant="arrow"
        iconClassName={accordionClassNames.icon}
      >
        <div className="px-16 py-28">
          <SortFacet />
        </div>
      </Accordion>
    ),
    [translate, accordionClassNames],
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-neutral-400 pb-16 pt-40 lg:hidden">
        <div>
          <button
            className="flex min-w-80 cursor-pointer items-center gap-8 rounded-md border border-transparent bg-white px-12 py-6 text-14 leading-[20px] transition hover:border-gray-500"
            onClick={() => setIsOpen(true)}
          >
            <span className="text-14">{translate('product.sortAndFilter')}</span>
            <FiltersIcon className="mt-2 w-16 stroke-gray-600" />
          </button>
        </div>
        <div className="flex items-center gap-16">
          <span className="text-14 text-gray-600">
            {totalItems} {translate('product.items')}
          </span>
        </div>
      </div>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} direction="left" className="w-[90%] max-w-400 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-400 px-12 py-16">
          <h3 className="text-18">{translate('product.sortAndFilter')}</h3>
          <CloseIcon className="w-24 stroke-gray-600" onClick={() => setIsOpen(false)} />
        </div>
        <div className="grow overflow-auto">
          {facets}
          {sortFacet}
        </div>
        <div className="w-full bg-white py-18">
          <div className="border-t border-neutral-400 py-12 text-center text-14 text-gray-600">
            {totalItems} {translate('product.products')}
          </div>
          <div className="flex items-center gap-18 px-14">
            <div className="w-full overflow-hidden rounded-md border border-transparent transition hover:border-primary">
              <button
                onClick={() => {
                  removeAllRefinements();
                  setIsOpen(false);
                }}
                className="w-full cursor-pointer border border-primary py-6 text-14 font-medium"
              >
                {translate('product.clear-all')}
              </button>
            </div>
            <button
              className="w-full rounded-md bg-primary py-8 text-14 font-medium text-white transition hover:bg-gray-500"
              onClick={() => setIsOpen(false)}
            >
              {translate('product.done')}
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileFacets;
