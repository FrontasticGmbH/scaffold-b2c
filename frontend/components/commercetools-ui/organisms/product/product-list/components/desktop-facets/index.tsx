import { useMemo } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon as ArrowIcon } from '@heroicons/react/24/solid';
import { useFormat } from 'helpers/hooks/useFormat';
import { useProductList } from '../../context';
import useDynamicFacets from '../../hooks/useDynamicFacets';
import styles from '../../styles/index.module.css';
import SortFacet from '../facets/sort';

const DesktopFacets: React.FC = () => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { facetsConfiguration } = useProductList();

  const facets = useDynamicFacets({
    configuration: facetsConfiguration,
    render: ({ attribute, Component }) => (
      <Menu as="div" className="relative" key={attribute}>
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
      <div className="flex items-center gap-8">
        <span className="text-14 text-secondary-black">
          {formatProductMessage({ id: 'sortBy', defaultMessage: 'Sort by' })}
        </span>
        <SortFacet />
      </div>
    ),
    [formatProductMessage],
  );

  return (
    <div className="hidden items-center justify-between border-b border-neutral-400 pb-16 pt-48 lg:flex">
      <div className="flex max-w-[70%] flex-wrap items-center gap-12">{facets}</div>
      <div className="flex items-center gap-18">
        <div>{sortFacet}</div>
      </div>
    </div>
  );
};

export default DesktopFacets;
