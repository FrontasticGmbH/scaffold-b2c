import { useState, useEffect, FC } from 'react';
import { Variant } from 'shared/types/product';
import { Product } from 'shared/types/product/Product';
import { UIProduct } from 'components/commercetools-ui/organisms/product/product-details/types';
import usePath from 'helpers/hooks/usePath';
import usePreloadImages from 'helpers/hooks/usePreloadImages';
import { toUIColor } from 'helpers/mappers/toUIColor';
import { toUIProduct } from 'helpers/mappers/toUIProduct';
import { toUISize } from 'helpers/mappers/toUIsize';
import ProductDetails, { ProductDetailsProps } from '..';

type ProductDetailsAdapterProps = {
  product: Product;
  inModalVersion?: ProductDetailsProps['inModalVersion'];
  setIsOpen?: (value: boolean) => void;
  onAddToCart?: () => void;
};

const ProductDetailsAdapter: FC<ProductDetailsAdapterProps> = ({ product, inModalVersion, setIsOpen, onAddToCart }) => {
  const { path } = usePath();

  const [variant, setVariant] = useState<Variant>();
  const [mappedProduct, setMappedProduct] = useState<UIProduct>();

  usePreloadImages(product.variants.map((variant) => variant.images ?? []).flat());

  useEffect(() => {
    if (product && variant) {
      const colors = toUIColor(product);
      const sizes = toUISize(product);
      const productToUse = toUIProduct(product, variant, colors, sizes);
      setMappedProduct({ ...productToUse, images: [productToUse.images[0]] });
    }
  }, [product, variant]);

  useEffect(() => {
    if (!product) return;

    if (inModalVersion) {
      setVariant(product?.variants[0]);
    } else {
      const currentVariantPath = path.split('/');
      const currentVariantSKU = currentVariantPath[2]?.split('?')[0];
      const currentVariantIndex = product?.variants.findIndex(({ sku }) => sku == currentVariantSKU);
      setVariant(product.variants[currentVariantIndex] ?? product.variants?.[0]);
    }
  }, [inModalVersion, product, path]);

  const handleChangeVariant = (sku: string) => {
    const variantsToUse = product.variants.find((variant) => variant.sku === sku);
    setVariant(variantsToUse);
  };

  if (!product || !variant) return <></>;

  return (
    <ProductDetails
      product={mappedProduct as UIProduct}
      variant={variant}
      url={product._url}
      inModalVersion={inModalVersion}
      onChangeVariant={handleChangeVariant}
      setIsOpen={setIsOpen}
      onAddToCart={onAddToCart}
    />
  );
};

export default ProductDetailsAdapter;
