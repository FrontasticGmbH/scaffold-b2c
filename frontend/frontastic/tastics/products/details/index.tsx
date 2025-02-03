'use client';

import { useParams } from 'next/navigation';
import { Product } from 'shared/types/product/Product';
import ProductDetailsAdapter from 'components/commercetools-ui/organisms/product/product-details/helpers/adapter';
import { mapCategotry } from 'helpers/entity-mappers/map-category';
import { mapProduct } from 'helpers/entity-mappers/map-product';
import { DataSource } from 'types/datasource';
import { useCart, useWishlist } from 'frontastic/hooks';
import { TasticProps } from 'frontastic/tastics/types';

const ProductDetailsTastic = ({ data, categories }: TasticProps<DataSource<{ product: Product }>>) => {
  const { locale } = useParams();

  const { data: wishlist, addToWishlist, removeLineItem } = useWishlist();

  const { addItem, shippingMethods, data: cart } = useCart();

  if (!data?.data?.dataSource?.product) return null;

  return (
    <ProductDetailsAdapter
      product={mapProduct(data?.data?.dataSource.product)}
      wishlist={wishlist}
      cart={cart}
      shippingMethods={shippingMethods.data}
      categories={categories.map((category) => mapCategotry(category, { locale }))}
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
