import { FC, useState } from 'react';
import { Category } from 'shared/types/product';
import { Product } from 'shared/types/product/Product';
import usePath from 'helpers/hooks/usePath';
import usePreloadImages from 'helpers/hooks/usePreloadImages';
import { toUIColor } from 'helpers/mappers/toUIColor';
import { toUIProduct } from 'helpers/mappers/toUIProduct';
import { toUISize } from 'helpers/mappers/toUIsize';
import ProductDetails, { ProductDetailsProps } from '..';

type ProductDetailsAdapterProps = {
  product: Product;
  inModalVersion?: ProductDetailsProps['inModalVersion'];
  categories: Category[];
  setIsOpen?: (value: boolean) => void;
  onAddToCart?: () => void;
};

const ProductDetailsAdapter: FC<ProductDetailsAdapterProps> = ({
  product,
  inModalVersion,
  setIsOpen,
  categories,
  onAddToCart,
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
      onChangeVariant={handleChangeVariant}
      setIsOpen={setIsOpen}
      onAddToCart={onAddToCart}
    />
  );
};

export default ProductDetailsAdapter;
