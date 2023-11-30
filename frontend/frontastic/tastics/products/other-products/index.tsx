'use client';

import { Product } from 'shared/types/product/Product';
import ProductSlider, { ProductSliderProps } from 'components/commercetools-ui/organisms/product/product-slider';
import { DataSource } from 'types/datasource';
import { TasticProps } from 'frontastic/tastics/types';

function OtherProductsTastic({ data }: TasticProps<DataSource<{ items: Product[] }> & ProductSliderProps>) {
  if (!data?.data?.dataSource?.items) return <></>;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mobile, tablet, desktop, ...props } = data;

  if (data.variant === 'cart')
    return (
      <div className="bg-neutral-200 pb-64">
        <ProductSlider {...props} products={data.data.dataSource.items ?? []} />
      </div>
    );

  return <ProductSlider {...props} products={data.data.dataSource.items ?? []} />;
}

export default OtherProductsTastic;
