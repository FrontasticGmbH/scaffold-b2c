import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Configure, InfiniteHits } from 'react-instantsearch-hooks-web';
import { Category } from 'shared/types/product/Category';
import Wrapper from 'components/HOC/wrapper';
import { mapProduct } from 'helpers/algolia/map-product';
import { PLP_PRODUCT_CLICKED } from 'helpers/constants/events';
import { useFormat } from 'helpers/hooks/useFormat';
import AccumalativeTrace from './components/accumalative-trace';
import Breadcrumbs from './components/breadcrumb';
import CurrentRefinements from './components/current-refinements';
import DesktopFacets from './components/desktop-facets';
import MobileFacets from './components/mobile-facets';
import SearchHeader from './components/search-header';
import { FacetConfiguration } from './types';
import ProductTile from '../product-tile';

interface Props {
  slug?: string;
  searchQuery?: string;
  categories: Category[];
  facetsConfiguration: Record<string, FacetConfiguration>;
}

const ProductListAlgolia: React.FC<Props> = ({ slug, searchQuery, categories, facetsConfiguration }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { locale } = useParams();

  const category = useMemo(() => categories.find((category) => category.slug === slug), [categories, slug]);

  return (
    <div className="min-h-screen bg-neutral-200 py-48">
      <Configure
        query={searchQuery ?? ''}
        filters={!!category ? `categories.id:${category.categoryId}` : ''}
        maxValuesPerFacet={1000}
      />

      {searchQuery ? (
        <Wrapper background="neutral-200">
          <SearchHeader query={searchQuery ?? ''} />
        </Wrapper>
      ) : (
        <Breadcrumbs categories={categories} categoryId={category?.categoryId} />
      )}

      <Wrapper className="relative" background="neutral-200">
        <MobileFacets facetsConfiguration={facetsConfiguration} />
        <DesktopFacets facetsConfiguration={facetsConfiguration} />

        <CurrentRefinements />

        <InfiniteHits
          showPrevious={false}
          hitComponent={({ hit }) => (
            <ProductTile
              product={mapProduct(hit, locale)}
              isSearchResult={!!searchQuery}
              onClick={() => {
                gtag('event', PLP_PRODUCT_CLICKED, hit);
              }}
            />
          )}
          classNames={{
            root: 'pt-32',
            list: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 lg:gap-24',
            loadMore:
              'mx-auto bg-primary-black rounded-md font-medium text-white text-16 px-48 py-12 block mt-[90px] hover:bg-gray-500 transition disabled:bg-neutral-400 disabled:opacity-0',
          }}
          translations={{
            showMoreButtonText: formatProductMessage({ id: 'load.more', defaultMessage: 'Load More' }),
          }}
        />

        <AccumalativeTrace />
      </Wrapper>
    </div>
  );
};

export default ProductListAlgolia;
