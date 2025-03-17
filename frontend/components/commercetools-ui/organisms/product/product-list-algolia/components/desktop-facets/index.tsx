import { useMemo, Fragment } from 'react';
import { Popover, Transition, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDownIcon as ArrowIcon } from '@heroicons/react/24/solid';
import { useHits } from 'react-instantsearch';
import { useTranslations } from 'use-intl';
import { useLocalizedIndex } from 'providers/algolia/localized-index';
import useDynamicFacets from '../../hooks/useDynamicFacets';
import styles from '../../styles/index.module.css';
import { FacetConfiguration } from '../../types';
import SortFacet from '../facets/sort';

interface Props {
  facetsConfiguration: Record<string, FacetConfiguration>;
}

const DesktopFacets: React.FC<Props> = ({ facetsConfiguration }) => {
  const { indexName: productsIndex } = useLocalizedIndex({ type: 'products' });

  const translate = useTranslations();

  const { results } = useHits();

  const facets = useDynamicFacets({
    configuration: facetsConfiguration,
    ordering: results?.renderingContent?.facetOrdering?.facets?.order,
    render: ({ attribute, Component }) => (
      <Popover as="div" className="relative">
        {({ open }) => (
          <>
            <PopoverButton>
              <div className="flex min-w-80 items-center gap-8 rounded-md border border-transparent bg-white px-12 py-6 text-14 leading-[20px] transition hover:border-gray-500">
                <span className="text-14">{facetsConfiguration[attribute].label}</span>
                <ArrowIcon className="mt-2 w-16 stroke-gray-600" />
              </div>
            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform origin-top scale-y-0"
              enterTo="transform origin-top scale-y-100"
              leave="transition ease-in duration-100"
              leaveFrom="transform origin-top scale-y-150"
              leaveTo="transform origin-top scale-y-0"
            >
              <PopoverPanel
                className={`absolute left-0 max-h-316 min-w-320 origin-top-right translate-y-10 overflow-auto rounded-md bg-white px-36 py-24 shadow-lg transition ${
                  styles.desktop_facet_container
                } ${open ? 'z-20 scale-100' : 'z-[-1] scale-95 opacity-0'}`}
              >
                {Component}
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    ),
  });

  const sortFacet = useMemo(
    () => (
      <div className="flex items-center gap-8">
        <span className="text-14 text-gray-600">{translate('product.sortBy')}</span>
        <SortFacet
          items={[
            {
              label: translate('product.relevance'),
              value: productsIndex,
            },
          ]}
        />
      </div>
    ),
    [translate, productsIndex],
  );

  return (
    <div className="hidden items-center justify-between border-b border-neutral-400 pb-16 pt-48 lg:flex">
      <div className="flex items-center gap-12">{facets}</div>
      <div>{sortFacet}</div>
    </div>
  );
};

export default DesktopFacets;
