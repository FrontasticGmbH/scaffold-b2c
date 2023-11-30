import { Variant } from 'shared/types/product';
import { Product } from 'shared/types/product/Product';
import { UIColor } from 'components/commercetools-ui/organisms/product/product-details/types';

const grayFix = (word: string) => (word === 'grey' ? 'gray' : word);

export const toUIColor = (product: Product) => {
  const mappedColors: UIColor[] = [
    ...new Map(
      product.variants?.map((variant: Variant) => [
        variant.attributes?.color?.label,
        {
          name: variant.attributes?.color?.label,
          key: variant.attributes?.color?.key,
          bgColor: grayFix(variant.attributes?.color?.key),
          selectedColor: grayFix(variant.attributes?.color?.key),
        },
      ]),
    ).values(),
  ];

  return mappedColors;
};
