import { LineItem } from 'shared/types/wishlist/LineItem';
import { Wishlist } from 'shared/types/wishlist/Wishlist';

export interface UseWishlist {
  data?: Wishlist;
  totalItems: number;
  addToWishlist: (wishlist: Wishlist, lineItem: LineItem, count?: number) => Promise<void>;
  removeLineItem: (wishlist: Wishlist, lineItem: LineItem) => Promise<void>;
  deleteWishlist: (wishlist: Wishlist) => Promise<void>;
  updateLineItem: (wishlist: Wishlist, lineItem: LineItem, count?: number) => Promise<void>;
}
