import React, { useMemo } from 'react';
import { Configure, InfiniteHits } from 'react-instantsearch';
import { useTranslations } from 'use-intl';
import Wrapper from 'components/HOC/wrapper';
import AccumalativeTrace from './components/accumalative-trace';
import Breadcrumbs from './components/breadcrumb';
import CurrentRefinements from './components/current-refinements';
import DesktopFacets from './components/desktop-facets';
import HitComponent from './components/hit-component';
import MobileFacets from './components/mobile-facets';
import SearchHeader from './components/search-header';
import { useProductList } from './context';

interface Props {
  slug?: string;
  searchQuery?: string;
}

const ProductListAlgolia: React.FC<Props> = ({ slug, searchQuery }) => {
  const translate = useTranslations();

  const { categories, facetsConfiguration } = useProductList();

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
          hitComponent={HitComponent}
          classNames={{
            root: 'pt-32',
            list: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 lg:gap-24',
            loadMore:
              'mx-auto bg-primary rounded-md font-medium text-white text-16 px-48 py-12 block mt-[90px] hover:bg-gray-500 transition disabled:bg-neutral-400 disabled:opacity-0',
          }}
          translations={{
            showMoreButtonText: translate('product.load-more'),
          }}
        />

        <AccumalativeTrace />
      </Wrapper>
    </div>
  );
};

export default ProductListAlgolia;
