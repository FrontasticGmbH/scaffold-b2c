import { Variant } from 'shared/types/product';

export const filterAttributeBasedVariants = (variants: Variant[], currentVariant: Variant, attribute: string) => {
  const filteredVariants = variants?.filter(
    ({ attributes }) => attributes?.[attribute] === currentVariant.attributes?.[attribute],
  );
  return filteredVariants;
};
