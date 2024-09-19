import { Cart, Discount, LineItem as CartLineItem } from 'types/entity/cart';
import { ImageProps } from 'frontastic/lib/image';
import { Link } from '../header/types';

export interface CartSlideoutProps {
  cart?: Cart;
  isEmpty?: boolean;
  onApplyDiscountCode?: (code: string) => Promise<void>;
  onRemoveDiscountCode?: (discount: Discount) => Promise<void>;
  emptyStateImage: ImageProps;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  emptyStateCategories: Link[];
  handleCategoryClick?: () => void;
  onRemoveItem(itemId: string): Promise<void>;
  onUpdateItem(itemId: string, quantity: number): Promise<void>;
  OnMoveToWishlist(lineItem: CartLineItem): Promise<void>;
}
