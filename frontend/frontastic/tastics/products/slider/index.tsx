'use client';

import { Product } from 'shared/types/product/Product';
import ProductSlider, { ProductSliderProps } from 'components/commercetools-ui/organisms/product/product-slider';
import { DataSource } from 'types/datasource';
import { TasticProps } from 'frontastic/tastics/types';

function ProductSliderTastic({ data }: TasticProps<DataSource<{ items: Product[] }> & ProductSliderProps>) {
  if (!data?.data?.dataSource?.items) return <p>No products found.</p>;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mobile, tablet, desktop, ...props } = data;

  return <ProductSlider {...props} products={data.data.dataSource.items} />;
}

export default ProductSliderTastic;
