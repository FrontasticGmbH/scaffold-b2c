import { useMemo } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon as ArrowIcon } from '@heroicons/react/24/solid';
import { useHits } from 'react-instantsearch';
import { useFormat } from 'helpers/hooks/useFormat';
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

  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { results } = useHits();

  const facets = useDynamicFacets({
    configuration: facetsConfiguration,
    ordering: results?.renderingContent?.facetOrdering?.facets?.order,
    render: ({ attribute, Component }) => (
      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            <Menu.Button>
              <div className="flex min-w-80 items-center gap-8 rounded-md border border-transparent bg-white px-12 py-6 text-14 leading-[20px] transition hover:border-gray-500">
                <span className="text-14">{facetsConfiguration[attribute].label}</span>
                <ArrowIcon className="mt-2 w-16 stroke-secondary-black" />
              </div>
            </Menu.Button>
            <Menu.Items
              static
              className={`absolute left-0 max-h-316 min-w-320 origin-top-right translate-y-10 overflow-auto rounded-md bg-white px-36 py-24 shadow-lg transition ${
                styles.desktop_facet_container
              } ${open ? 'z-20 scale-100' : 'z-[-1] scale-95 opacity-0'}`}
            >
              <Menu.Item>{Component}</Menu.Item>
            </Menu.Items>
          </>
        )}
      </Menu>
    ),
  });

  const sortFacet = useMemo(
    () => (
      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            <Menu.Button>
              <div className="flex items-center gap-8">
                <span className="text-14 text-secondary-black">
                  {formatProductMessage({ id: 'sortBy', defaultMessage: 'Sort by' })}
                </span>
                <ArrowIcon className="mt-2 w-16 stroke-secondary-black" />
              </div>
            </Menu.Button>
            <Menu.Items
              static
              className={`absolute right-0 min-w-280 origin-top-right translate-y-10 rounded-md bg-white shadow-lg transition ${
                open ? 'z-20 scale-100' : 'z-[-1] scale-95 opacity-0'
              }`}
            >
              <Menu.Item>
                <SortFacet
                  items={[
                    {
                      label: formatProductMessage({ id: 'relevance', defaultMessage: 'Relevance' }),
                      value: productsIndex,
                    },
                  ]}
                />
              </Menu.Item>
            </Menu.Items>
          </>
        )}
      </Menu>
    ),
    [formatProductMessage, productsIndex],
  );

  return (
    <div className="hidden items-center justify-between border-b border-neutral-400 pb-16 pt-48 lg:flex">
      <div className="flex items-center gap-12">{facets}</div>
      <div className="flex items-center gap-18">
        <span className="text-14 text-secondary-black">
          {results?.nbHits ?? 0} {formatProductMessage({ id: 'items', defaultMessage: 'Items' })}
        </span>
        <div>{sortFacet}</div>
      </div>
    </div>
  );
};

export default DesktopFacets;
