import { Product } from 'shared/types/product';
import { Product as EntityProduct } from 'types/entity/product';
import { mapCategotry } from '../map-category';

export const mapProduct = (product: Product, { locale = 'en' }: { locale?: string } = {}): EntityProduct => {
  return {
    ...product,
    categories: (product.categories ?? []).map((category) => mapCategotry(category, { locale })),
  };
};
