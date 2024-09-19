'use client';

import { Product } from 'shared/types/product/Product';
import ProductDetailsAdapter from 'components/commercetools-ui/organisms/product/product-details/helpers/adapter';
import { DataSource } from 'types/datasource';
import { TasticProps } from 'frontastic/tastics/types';

const ProductDetailsTastic = ({ data, categories }: TasticProps<DataSource<{ product: Product }>>) => {
  if (!data?.data?.dataSource?.product) return null;

  return <ProductDetailsAdapter product={data?.data?.dataSource.product} categories={categories} />;
};

export default ProductDetailsTastic;
