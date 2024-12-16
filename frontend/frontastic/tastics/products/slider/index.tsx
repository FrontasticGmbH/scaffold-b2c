'use client';

import { Product } from 'shared/types/product/Product';
import ProductSlider, { ProductSliderProps } from 'components/commercetools-ui/organisms/product/product-slider';
import { DataSource } from 'types/datasource';
import { useCart, useWishlist } from 'frontastic/hooks';
import { TasticProps } from 'frontastic/tastics/types';

function ProductSliderTastic({ data }: TasticProps<DataSource<{ items: Product[] }> & ProductSliderProps>) {
  const { data: wishlist, addToWishlist, removeLineItem } = useWishlist();

  const { addItem, shippingMethods, data: cart } = useCart();

  if (!data?.data?.dataSource?.items) return <p>No products found.</p>;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mobile, tablet, desktop, ...props } = data;

  return (
    <ProductSlider
      {...props}
      wishlist={wishlist}
      cart={cart}
      products={data.data.dataSource.items}
      shippingMethods={shippingMethods.data}
      onAddToCart={addItem}
      addToWishlist={async (lineItem, count) => {
        if (wishlist) await addToWishlist(wishlist, lineItem, count);
      }}
      removeLineItem={async (lineItem) => {
        if (wishlist) await removeLineItem(wishlist, lineItem);
      }}
    />
  );
}

export default ProductSliderTastic;
