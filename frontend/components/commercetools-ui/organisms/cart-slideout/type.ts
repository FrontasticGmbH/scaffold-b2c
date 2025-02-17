import { ImageProps } from 'components/commercetools-ui/atoms/image';
import { Cart, DiscountCode, LineItem as CartLineItem } from 'types/entity/cart';
import { Link } from '../header/types';

export interface CartSlideoutProps {
  cart?: Cart;
  isEmpty?: boolean;
  onApplyDiscountCode?: (code: string) => Promise<void>;
  onRemoveDiscountCode?: (discount: DiscountCode) => Promise<void>;
  emptyStateImage: ImageProps;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  emptyStateCategories: Link[];
  handleCategoryClick?: () => void;
  onRemoveItem(itemId: string): Promise<void>;
  onUpdateItem(itemId: string, quantity: number): Promise<void>;
  OnMoveToWishlist(lineItem: CartLineItem): Promise<void>;
}
