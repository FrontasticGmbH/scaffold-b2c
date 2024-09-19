'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Product } from 'shared/types/product/Product';
import { Facet } from 'shared/types/result/Facet';
import ProductList, { ProductListProps } from 'components/commercetools-ui/organisms/product/product-list';
import ProductListProvider, {
  useProductList,
} from 'components/commercetools-ui/organisms/product/product-list/context';
import {
  TermFacet,
  FacetConfiguration,
  PriceConfiguration,
} from 'components/commercetools-ui/organisms/product/product-list/types';
import { useFormat } from 'helpers/hooks/useFormat';
import { flattenTree } from 'helpers/utils/flattenTree';
import { DataSource } from 'types/datasource';
import { TasticProps } from 'frontastic/tastics/types';

interface Props {
  facetsConfiguration: FacetConfiguration[];
  pricesConfiguration: PriceConfiguration[];
}

interface DataSourceProps {
  items: Product[];
  category: string;
  facets: Facet[];
  previousCursor?: string;
  nextCursor?: string;
  total: number;
  totalItems: number;
}

const ProductListWrapped = ({
  data,
  categories,
}: TasticProps<DataSource<DataSourceProps> & Props & ProductListProps>) => {
  const flattenedCategories = useMemo(
    () => categories.map((category) => flattenTree(category, 'subCategories')).flat(),
    [categories],
  );

  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { updatePricesConfiguration, updateFacetsConfiguration } = useProductList();

  const externalFacetsConfiguration = useMemo<Record<string, FacetConfiguration>>(() => {
    return (data.facetsConfiguration ?? []).reduce(
      (acc, configuration) => ({
        ...acc,
        [configuration.key]: configuration as FacetConfiguration,
      }),
      {},
    );
  }, [data.facetsConfiguration]);

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
    updatePricesConfiguration(pricesConfiguration);
  }, [pricesConfiguration, updatePricesConfiguration]);

  const facetsConfiguration = useMemo<Record<string, FacetConfiguration>>(() => {
    const facets = data.data?.dataSource?.facets ?? [];

    const keys = Object.keys(externalFacetsConfiguration);

    facets.sort((a, b) => keys.indexOf(a.key) - keys.indexOf(b.key));

    return facets
      .filter((facet) => facet.key in externalFacetsConfiguration)
      .map((facet) => {
        if (facet.key === 'categories.id') {
          (facet as TermFacet).terms = (facet as TermFacet).terms.map((term) => ({
            ...term,
            label: flattenedCategories.find((c) => c.categoryId === term.key)?.name ?? '',
          }));
        } else if (facet.type === 'boolean') {
          (facet as TermFacet).terms = (facet as TermFacet).terms.map((term) => ({
            ...term,
            label:
              term.key === 'T'
                ? externalFacetsConfiguration[facet.key].label
                : formatProductMessage({ id: 'regular', defaultMessage: 'Regular' }),
          }));
        }

        return facet;
      })
      .filter(
        (facet) =>
          facet.type !== 'boolean' || !!(facet as TermFacet).terms.find((term) => term.key === 'T' && term.count > 0),
      )
      .reduce(
        (acc, configuration) => ({
          ...acc,
          [configuration.key]: {
            ...configuration,
            label: externalFacetsConfiguration[configuration.key].label,
            type: externalFacetsConfiguration[configuration.key].type,
          } as FacetConfiguration,
        }),
        {},
      );
  }, [data.data?.dataSource?.facets, externalFacetsConfiguration, flattenedCategories, formatProductMessage]);

  useEffect(() => {
    updateFacetsConfiguration(facetsConfiguration);
  }, [facetsConfiguration, updateFacetsConfiguration]);

  return <ProductList products={data.data?.dataSource?.items ?? []} categories={flattenedCategories} />;
};

const filterMatchingVariants = (items: Product[]) => {
  return items.map((item) => ({
    ...item,
    variants: item.variants.filter((variant) => variant.isMatchingVariant !== false),
  }));
};

const ProductListTastic = ({ data, ...props }: TasticProps<DataSource<DataSourceProps> & Props & ProductListProps>) => {
  const { slug } = useParams();

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('query') as string;

  if (!data?.data?.dataSource) return <></>;

  // Apply the filter to the items
  const filteredItems = filterMatchingVariants(data.data.dataSource.items);

  // Update the data object with filtered items
  const updatedData = {
    ...data,
    data: {
      ...data.data,
      dataSource: {
        ...data.data.dataSource,
        items: filteredItems,
      },
    },
  };

  return (
    <ProductListProvider
      uiState={{
        searchQuery,
        slug: (slug as string)?.split('/').at(-1),
        previousCursor: data.data.dataSource.previousCursor,
        nextCursor: data.data.dataSource.nextCursor,
        totalItems: data.data.dataSource.total,
      }}
    >
      <ProductListWrapped data={updatedData} {...props} />
    </ProductListProvider>
  );
};
export default ProductListTastic;
