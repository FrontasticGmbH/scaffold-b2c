import { UISize } from 'components/commercetools-ui/organisms/product/product-details/types';
import { Product, Variant } from 'types/entity/product';

export const toUISize = (product: Product) => {
  const mappedSizes: UISize[] = [
    ...new Map(
      product.variants?.map((variant: Variant) => [
        variant.attributes?.commonSize?.label,
        variant.attributes?.commonSize,
      ]),
    ).values(),
  ];

  return mappedSizes;
};
