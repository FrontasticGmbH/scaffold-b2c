import React, { FC } from 'react';
import { Product } from 'shared/types/product/Product';
import ProductTile from 'components/commercetools-ui/organisms/product/product-tile';
import useSelectedColorFilterVariant from '../../../../../../../helpers/hooks/useSelectedColorFilterVariant';

interface ProductTileWrapperProps {
  product: Product;
  isSearchResult?: boolean;
  disableQuickView?: boolean;
  disableWishlistButton?: boolean;
  disableVariants?: boolean;
  onClick?: () => void;
}

const PlpProductTileWrapper: FC<ProductTileWrapperProps> = ({ product, isSearchResult, onClick }) => {
  const selectedColorVariantIndex = useSelectedColorFilterVariant(product.variants);
  return (
    <ProductTile
      product={product}
      selectedVariantIndex={selectedColorVariantIndex}
      isSearchResult={isSearchResult}
      onClick={onClick}
    />
  );
};

export default PlpProductTileWrapper;
