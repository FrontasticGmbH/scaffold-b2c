import { CurrentRefinementsConnectorParamsRefinement } from 'instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements';
import { ShippingMethod } from 'types/entity/cart';
import { Category } from 'types/entity/category';
import { Variant } from 'types/entity/product';
import { LineItem as WishlistLineItem, Wishlist } from 'types/entity/wishlist';
import { FacetConfiguration, PriceConfiguration } from '../types';

export interface RefinementRemovedEvent {
  attribute: string;
}

export interface ProductListContextShape {
  searchQuery?: string;
  categories: Category[];
  shippingMethods?: ShippingMethod[];
  facetsConfiguration: Record<string, FacetConfiguration>;
  pricesConfiguration: Record<string, PriceConfiguration>;
  numericRanges: Record<string, [number, number]>;
  updateNumericRange: (attribute: string, range: [number, number]) => void;
  removeRefinement: (refinement: CurrentRefinementsConnectorParamsRefinement) => void;
  removeAllRefinements: () => void;
  wishlist?: Wishlist;
  addToWishlist?: (lineItem: WishlistLineItem, count: number) => Promise<void>;
  removeFromWishlist?: (item: WishlistLineItem) => Promise<void>;
  onAddToCart?: (variant: Variant, quantity: number) => Promise<void>;
}
