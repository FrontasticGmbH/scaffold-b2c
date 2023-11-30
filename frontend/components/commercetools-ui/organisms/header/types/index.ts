import { Category } from 'shared/types/product/Category';
import { Reference } from 'types/reference';
import { ImageProps } from 'frontastic/lib/image';

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
  categories: Category[];
  logo: ImageProps;
  logoMobile: ImageProps;
  logoLink: Reference;
  logoLinkMobile: Reference;
  tiles?: Tile[];
  enableAlgoliaSearch?: boolean;
}
