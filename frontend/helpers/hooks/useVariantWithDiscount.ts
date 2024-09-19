import { useMemo } from 'react';
import { Variant } from 'types/entity/product';

const useVariantWithDiscount = (variants: Partial<Variant>[]) => {
  const variant = useMemo(() => {
    return variants.reduce(
      (acc: Partial<Variant> | undefined, curr) =>
        curr.discountedPrice &&
        (!acc || (acc.discountedPrice?.centAmount as number) > (curr.discountedPrice?.centAmount as number))
          ? curr
          : acc,
      undefined,
    );
  }, [variants]);

  return variant;
};

export default useVariantWithDiscount;
