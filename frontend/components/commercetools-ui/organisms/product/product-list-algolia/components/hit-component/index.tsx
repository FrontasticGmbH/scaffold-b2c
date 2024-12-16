import React from 'react';
import { useParams } from 'next/navigation';
import { Hit, BaseHit } from 'instantsearch.js';
import ProductTile from 'components/commercetools-ui/molecules/product-tile';
import { mapProduct } from 'helpers/algolia/map-product';
import { PLP_PRODUCT_CLICKED } from 'helpers/constants/events';
import { useProductList } from '../../context';

const HitComponent = ({ hit }: { hit: Hit<BaseHit> }) => {
  const { locale } = useParams();

  const { searchQuery, wishlist, cart, shippingMethods, addToWishlist, removeFromWishlist, onAddToCart } =
    useProductList();

  return (
    <ProductTile
      product={mapProduct(hit, locale)}
      wishlist={wishlist}
      cart={cart}
      shippingMethods={shippingMethods}
      isSearchResult={!!searchQuery}
      onClick={() => {
        gtag('event', PLP_PRODUCT_CLICKED, hit);
      }}
      addToWishlist={addToWishlist}
      removeLineItem={removeFromWishlist}
      onAddToCart={onAddToCart}
    />
  );
};

export default HitComponent;
