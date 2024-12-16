import { FC, useState } from 'react';
import usePath from 'helpers/hooks/usePath';
import usePreloadImages from 'helpers/hooks/usePreloadImages';
import { toUIColor } from 'helpers/mappers/toUIColor';
import { toUIProduct } from 'helpers/mappers/toUIProduct';
import { toUISize } from 'helpers/mappers/toUIsize';
import { Cart, ShippingMethod } from 'types/entity/cart';
import { Category } from 'types/entity/category';
import { Product, Variant } from 'types/entity/product';
import { LineItem, Wishlist } from 'types/entity/wishlist';
import ProductDetails, { ProductDetailsProps } from '..';

type ProductDetailsAdapterProps = {
  product: Product;
  inModalVersion?: ProductDetailsProps['inModalVersion'];
  categories: Category[];
  wishlist?: Wishlist;
  cart?: Cart;
  shippingMethods?: ShippingMethod[];
  setIsOpen?: (value: boolean) => void;
  removeLineItem?: (item: LineItem) => Promise<void>;
  addToWishlist?: (lineItem: LineItem, count: number) => Promise<void>;
  onAddToCart?: (variant: Variant, quantity: number) => Promise<void>;
};

const ProductDetailsAdapter: FC<ProductDetailsAdapterProps> = ({
  product,
  inModalVersion,
  categories,
  wishlist,
  cart,
  shippingMethods,
  setIsOpen,
  onAddToCart,
  removeLineItem,
  addToWishlist,
}) => {
  const { path } = usePath();

  const category = categories.find((category) => product.categories?.find((c) => c.slug === category.slug));

  const [variant, setVariant] = useState(() => {
    if (inModalVersion) {
      return product?.variants[0];
    } else {
      const currentVariantPath = path.split('/');
      const currentVariantSKU = currentVariantPath[3]?.split('?')[0];
      const currentVariantIndex = product?.variants.findIndex(({ sku }) => sku == currentVariantSKU);

      return product.variants[currentVariantIndex] ?? product.variants?.[0];
    }
  });

  const inCartQuantity = cart?.lineItems?.find((lineItem) => lineItem.variant?.sku === variant.sku)?.count ?? 0;

  usePreloadImages(product.variants.map((variant) => variant.images ?? []).flat(), 'large');

  const mappedProduct = toUIProduct(product, variant, toUIColor(product), toUISize(product));

  const handleChangeVariant = (sku: string) => {
    const variantsToUse = product.variants.find((variant) => variant.sku === sku);

    if (variantsToUse) setVariant(variantsToUse);
  };

  return (
    <ProductDetails
      product={{ ...mappedProduct, images: [mappedProduct.images[0]] }}
      variant={variant}
      category={category}
      url={product._url}
      inModalVersion={inModalVersion}
      wishlist={wishlist}
      shippingMethods={shippingMethods}
      onChangeVariant={handleChangeVariant}
      setIsOpen={setIsOpen}
      onAddToCart={onAddToCart}
      removeLineItem={removeLineItem}
      addToWishlist={addToWishlist}
      inCartQuantity={inCartQuantity}
    />
  );
};

export default ProductDetailsAdapter;
