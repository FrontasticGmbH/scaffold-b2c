import { ImageProps } from 'components/commercetools-ui/atoms/image';
import { Cart, DiscountCode, LineItem as CartLineItem } from 'types/entity/cart';
import { Category } from 'types/entity/category';
import { Product } from 'types/entity/product';
import { Wishlist, LineItem as WishlistLineItem } from 'types/entity/wishlist';
import { Reference } from 'types/reference';

export interface Link {
  name: string;
  reference: Reference;
}
export interface Market {
  region: string;
  flag: string;
  locale: string;
  currency: string;
  currencyCode: string;
}

export interface Tile {
  tileCategory: string;
  tileImage: ImageProps;
  tileHeaderText: string;
  tileHeaderDecoration: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
  tileButtonLabel: string;
  tileButtonLabelDecoration: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
  tileButtonLink: Reference;
}

export interface EmptyStateProps {
  navLinks: Category[];
  categories: Category[];
  logo: ImageProps;
  logoMobile: ImageProps;
  logoLink: Reference;
  logoLinkMobile: Reference;
  tiles?: Tile[];
  emptyCartTitle: string;
  emptyCartSubtitle: string;
  emptyCartImage: ImageProps;
  emptyCartCategories: Link[];
  emptyWishlistTitle: string;
  emptyWishlistSubtitle: string;
  emptyWishlistImage: ImageProps;
  emptyWishlistCategories: Link[];
}

export interface HeaderProps extends EmptyStateProps {
  cart?: Cart;
  onApplyDiscountCode?: (code: string) => Promise<void>;
  onRemoveDiscountCode?: (discount: DiscountCode) => Promise<void>;
  isEmpty?: boolean;
  totalCartItems?: number;
  totalWishlistItems?: number;
  onRemoveItem(itemId: string): Promise<void>;
  onUpdateItem(itemId: string, quantity: number): Promise<void>;
  OnMoveToWishlist(lineItem: CartLineItem): Promise<void>;
  wishlist?: Wishlist;
  onRemoveFromWishlist?: (lineItemId: string) => Promise<void>;
  onMoveToCart?: (lineItem: WishlistLineItem) => Promise<void>;
  onClearWishlist?: () => Promise<void>;
  categories: Category[];
  logo: ImageProps;
  logoMobile: ImageProps;
  logoLink: Reference;
  logoLinkMobile: Reference;
  tiles?: Tile[];
  enableAlgoliaSearch?: boolean;
  searchItems: Product[];
  onSearchQueryUpdate?: (query: string) => void;
}
