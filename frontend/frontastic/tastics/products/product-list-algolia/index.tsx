'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useClearRefinements } from 'react-instantsearch';
import ProductList from 'components/commercetools-ui/organisms/product/product-list-algolia';
import ProductListProvider from 'components/commercetools-ui/organisms/product/product-list-algolia/context';
import {
  FacetConfiguration,
  PriceConfiguration,
} from 'components/commercetools-ui/organisms/product/product-list-algolia/types';
import InstantSearch from 'components/HOC/InstantSearch';
import { mapCategotry } from 'helpers/entity-mappers/map-category';
import usePath from 'helpers/hooks/usePath';
import Redirect from 'helpers/redirect';
import { flattenTree } from 'helpers/utils/flattenTree';
import { getLocalizationInfo } from 'project.config';
import LocalizedIndex from 'providers/algolia/localized-index';
import { useCart, useWishlist } from 'frontastic/hooks';
import { TasticProps } from 'frontastic/tastics/types';
import useFacetsConfiguration from './hooks/useFacetsConfiguration';
import usePricesConfiguration from './hooks/usePricesConfiguration';

export interface Props {
  slug?: string;
  searchQuery?: string;
  facetsConfiguration: FacetConfiguration[];
  pricesConfiguration: PriceConfiguration[];
}

function ProductListTastic({ categories }: TasticProps<Props>) {
  const { slug } = useParams();

  const categorySlug = slug?.at(-1);

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('query') as string;

  const { refine: clearAllRefinements } = useClearRefinements();

  const { pathWithoutQuery } = usePath();

  useEffect(() => {
    clearAllRefinements();
  }, [clearAllRefinements, pathWithoutQuery]);

  const isCategoryFoundOrSearchQueryExists = useMemo(() => {
    if (searchQuery) return true;
    if (!categorySlug) return true;

    return !!categories?.find((category) => category.slug === categorySlug);
  }, [searchQuery, categories, categorySlug]);

  if (!isCategoryFoundOrSearchQueryExists) return <Redirect target="/404" />;

  return <ProductList slug={categorySlug} searchQuery={searchQuery} />;
}

function ProductListAlgoliaTastic({ data, categories, ...props }: TasticProps<Props>) {
  const { locale } = useParams();

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('query') as string;

  const { currency } = getLocalizationInfo(locale);

  const { data: wishlist, addToWishlist, removeLineItem } = useWishlist();

  const { addItem, shippingMethods } = useCart();

  const flattenedCategories = categories.map((category) => flattenTree(category, 'descendants')).flat();

  const facetsConfiguration = useFacetsConfiguration({ facetsConfiguration: data.facetsConfiguration, currency });

  const pricesConfiguration = usePricesConfiguration({ pricesConfiguration: data.pricesConfiguration });

  return (
    <InstantSearch>
      <LocalizedIndex type="products">
        <ProductListProvider
          searchQuery={searchQuery}
          categories={flattenedCategories.map((category) => mapCategotry(category, { locale }))}
          shippingMethods={shippingMethods.data}
          facetsConfiguration={facetsConfiguration}
          pricesConfiguration={pricesConfiguration}
          wishlist={wishlist}
          addToWishlist={async (lineItem, count) => {
            if (wishlist) await addToWishlist(wishlist, lineItem, count);
          }}
          removeFromWishlist={async (lineItem) => {
            if (wishlist) await removeLineItem(wishlist, lineItem);
          }}
          onAddToCart={addItem}
        >
          <ProductListTastic data={{ ...data }} categories={flattenedCategories} {...props} />
        </ProductListProvider>
      </LocalizedIndex>
    </InstantSearch>
  );
}

export default ProductListAlgoliaTastic;
