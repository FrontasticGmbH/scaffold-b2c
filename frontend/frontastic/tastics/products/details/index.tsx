'use client';

import { Product } from 'shared/types/product/Product';
import ProductDetailsAdapter from 'components/commercetools-ui/organisms/product/product-details/helpers/adapter';
import { DataSource } from 'types/datasource';
import { useCart, useWishlist } from 'frontastic/hooks';
import { TasticProps } from 'frontastic/tastics/types';

const ProductDetailsTastic = ({ data, categories }: TasticProps<DataSource<{ product: Product }>>) => {
  const { data: wishlist, addToWishlist, removeLineItem } = useWishlist();

  const { addItem, shippingMethods } = useCart();

  if (!data?.data?.dataSource?.product) return null;

  return (
    <ProductDetailsAdapter
      product={data?.data?.dataSource.product}
      wishlist={wishlist}
      shippingMethods={shippingMethods.data}
      categories={categories}
      onAddToCart={addItem}
      addToWishlist={async (lineItem, count) => {
        if (wishlist) await addToWishlist(wishlist, lineItem, count);
      }}
      removeLineItem={async (lineItem) => {
        if (wishlist) await removeLineItem(wishlist, lineItem);
      }}
    />
  );
};

export default ProductDetailsTastic;
