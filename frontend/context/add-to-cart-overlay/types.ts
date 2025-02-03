import { Product, Variant } from 'types/entity/product';

export interface AddToCartOverlayContextShape {
  show: (product: Product, variant: Variant, count: number) => void;
  hide: () => void;
  fetchRelatedProducts: (product: Product) => Promise<void>;
}

export interface StateProduct extends Product, Variant {
  count: number;
}
