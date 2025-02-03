'use client';

import { useParams } from 'next/navigation';
import { Product } from 'shared/types/product/Product';
import ProductSlider, { ProductSliderProps } from 'components/commercetools-ui/organisms/product/product-slider';
import { mapProduct } from 'helpers/entity-mappers/map-product';
import { DataSource } from 'types/datasource';
import { useCart, useWishlist } from 'frontastic/hooks';
import { TasticProps } from 'frontastic/tastics/types';

function SimilarProductsTastic({ data }: TasticProps<DataSource<{ items: Product[] }> & ProductSliderProps>) {
  const { locale } = useParams();

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
      shippingMethods={shippingMethods.data}
      products={data.data.dataSource.items.map((product) => mapProduct(product, { locale }))}
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

export default SimilarProductsTastic;
