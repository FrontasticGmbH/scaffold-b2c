'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Product } from 'shared/types/product/Product';
import { Facet } from 'shared/types/result/Facet';
import ProductList, { ProductListProps } from 'components/commercetools-ui/organisms/product/product-list';
import ProductListProvider from 'components/commercetools-ui/organisms/product/product-list/context';
import {
  FacetConfiguration,
  PriceConfiguration,
} from 'components/commercetools-ui/organisms/product/product-list/types';
import { mapCategotry } from 'helpers/entity-mappers/map-category';
import { mapProduct } from 'helpers/entity-mappers/map-product';
import { flattenTree } from 'helpers/utils/flattenTree';
import { DataSource } from 'types/datasource';
import { useCart, useWishlist } from 'frontastic/hooks';
import { TasticProps } from 'frontastic/tastics/types';
import useFacetsConfiguration from './hooks/useFacetsConfiguration';
import usePricesConfiguration from './hooks/usePricesConfiguration';

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

const ProductListWrapped = ({ data }: TasticProps<DataSource<DataSourceProps> & Props & ProductListProps>) => {
  const { locale } = useParams();

  const { data: cart } = useCart();

  return (
    <ProductList
      products={(data.data?.dataSource?.items ?? []).map((product) => mapProduct(product, { locale }))}
      cart={cart}
    />
  );
};

const filterMatchingVariants = (items: Product[]) => {
  return items.map((item) => ({
    ...item,
    variants: item.variants.filter((variant) => variant.isMatchingVariant !== false),
  }));
};

const ProductListTastic = ({
  data,
  categories,
  ...props
}: TasticProps<DataSource<DataSourceProps> & Props & ProductListProps>) => {
  const { slug, locale } = useParams();

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('query') as string;

  const flattenedCategories = categories.map((category) => flattenTree(category, 'descendants')).flat();

  const facetsConfiguration = useFacetsConfiguration({
    facets: data.data?.dataSource?.facets ?? [],
    facetsConfiguration: data.facetsConfiguration,
    categories: flattenedCategories,
  });

  const pricesConfiguration = usePricesConfiguration({
    pricesConfiguration: data.pricesConfiguration,
  });

  const { data: wishlist, addToWishlist, removeLineItem } = useWishlist();

  const { addItem, shippingMethods } = useCart();

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
        slug: slug?.at(-1),
        previousCursor: data.data.dataSource.previousCursor,
        nextCursor: data.data.dataSource.nextCursor,
        totalItems: data.data.dataSource.total,
      }}
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
      <ProductListWrapped data={updatedData} categories={categories} {...props} />
    </ProductListProvider>
  );
};
export default ProductListTastic;
