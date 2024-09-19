'use client';

import { Product } from 'shared/types/product/Product';
import ProductSlider, { ProductSliderProps } from 'components/commercetools-ui/organisms/product/product-slider';
import { DataSource } from 'types/datasource';
import { useCart, useWishlist } from 'frontastic/hooks';
import { TasticProps } from 'frontastic/tastics/types';

function OtherProductsTastic({ data }: TasticProps<DataSource<{ items: Product[] }> & ProductSliderProps>) {
  const { data: wishlist, addToWishlist, removeLineItem } = useWishlist();

  const { addItem, shippingMethods } = useCart();

  if (!data?.data?.dataSource?.items) return <></>;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mobile, tablet, desktop, ...props } = data;

  const Slider = (
    <ProductSlider
      {...props}
      wishlist={wishlist}
      shippingMethods={shippingMethods.data}
      products={data.data.dataSource.items ?? []}
      onAddToCart={addItem}
      addToWishlist={async (lineItem, count) => {
        if (wishlist) await addToWishlist(wishlist, lineItem, count);
      }}
      removeLineItem={async (lineItem) => {
        if (wishlist) await removeLineItem(wishlist, lineItem);
      }}
    />
  );

  if (data.variant === 'cart') return <div className="bg-neutral-200 pb-64">{Slider}</div>;

  return Slider;
}

export default OtherProductsTastic;
