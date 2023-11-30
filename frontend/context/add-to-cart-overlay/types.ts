import { Product } from 'shared/types/product/Product';
import { Variant } from 'shared/types/product';

export interface AddToCartOverlayContextShape {
  show: (product: Product, variant: Variant, count: number) => void;
  hide: () => void;
  fetchRelatedProducts: (product: Product) => Promise<void>;
}

export interface StateProduct extends Product, Variant {
  count: number;
}
