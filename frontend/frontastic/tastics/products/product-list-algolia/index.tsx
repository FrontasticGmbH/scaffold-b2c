'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { InstantSearchServerState, useClearRefinements } from 'react-instantsearch-hooks';
import NotFound from 'components/commercetools-ui/organisms/not-found';
import ProductList from 'components/commercetools-ui/organisms/product/product-list-algolia';
import ProductListProvider, {
  useProductList,
} from 'components/commercetools-ui/organisms/product/product-list-algolia/context';
import {
  FacetConfiguration,
  PriceConfiguration,
} from 'components/commercetools-ui/organisms/product/product-list-algolia/types';
import InstantSearch from 'components/HOC/InstantSearch';
import usePath from 'helpers/hooks/usePath';
import { flattenTree } from 'helpers/utils/flattenTree';
import { getLocalizationInfo } from 'project.config';
import LocalizedIndex from 'providers/algolia/localized-index';
import { TasticProps } from 'frontastic/tastics/types';

export interface Props {
  slug?: string;
  searchQuery?: string;
  facetsConfiguration: FacetConfiguration[];
  pricesConfiguration: PriceConfiguration[];
  serverUrl: string;
  serverState?: InstantSearchServerState;
}

function ProductListTastic({ categories, data }: TasticProps<Props>) {
  const { updateFacetsConfiguration, updatePricesConfiguration } = useProductList();

  const { locale, slug } = useParams();

  const { currency } = getLocalizationInfo(locale);

  const categorySlug = (slug as string).split('/').at(-1);

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('query') as string;

  const { refine: clearAllRefinements } = useClearRefinements();

  const { pathWithoutQuery } = usePath();

  const facetsConfiguration = useMemo<Record<string, FacetConfiguration>>(() => {
    return (data.facetsConfiguration ?? []).reduce(
      (acc, configuration) => ({
        ...acc,
        [configuration.key.replace(/\{currency\}/, currency)]: {
          type: configuration.type,
          label: configuration.label,
        } as FacetConfiguration,
      }),
      {},
    );
  }, [data.facetsConfiguration, currency]);

  const pricesConfiguration = useMemo<Record<string, PriceConfiguration>>(() => {
    return (data.pricesConfiguration ?? []).reduce(
      (acc, configuration) => ({
        ...acc,
        [configuration.key]: {
          ranges: configuration.ranges,
        } as PriceConfiguration,
      }),
      {},
    );
  }, [data.pricesConfiguration]);

  useEffect(() => {
    updateFacetsConfiguration(facetsConfiguration);
    updatePricesConfiguration(pricesConfiguration);
  }, [facetsConfiguration, pricesConfiguration, updateFacetsConfiguration, updatePricesConfiguration]);

  useEffect(() => {
    clearAllRefinements();
  }, [clearAllRefinements, pathWithoutQuery]);

  const flattenedCategories = categories.map((category) => flattenTree(category, 'subCategories')).flat();

  const isCategoryFoundOrSearchQueryExists = useMemo(() => {
    if (searchQuery) return true;
    if (!categorySlug) return true;

    return !!flattenedCategories?.find((category) => category.slug === categorySlug);
  }, [searchQuery, flattenedCategories, categorySlug]);

  if (!isCategoryFoundOrSearchQueryExists) return <NotFound />;

  return (
    <ProductList
      slug={categorySlug}
      searchQuery={searchQuery}
      categories={flattenedCategories}
      facetsConfiguration={facetsConfiguration}
    />
  );
}

function ProductListAlgoliaTastic({ data, ...props }: TasticProps<Props>) {
  return (
    <InstantSearch>
      <LocalizedIndex type="products">
        <ProductListProvider>
          <ProductListTastic data={{ ...data }} {...props} />
        </ProductListProvider>
      </LocalizedIndex>
    </InstantSearch>
  );
}

export default ProductListAlgoliaTastic;
