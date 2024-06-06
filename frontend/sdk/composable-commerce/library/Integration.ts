import { Integration, SDK } from '@commercetools/frontend-sdk';
import { getProjectActions, ProjectActions } from './actions/ProjectActions';
import { getProductActions, ProductActions } from './actions/ProductActions';
import { getCartActions, CartActions } from './actions/CartActions';
import { getWishlistActions, WishlistActions } from './actions/WishlistActions';
import { AccountActions, getAccountActions } from './actions/AccountActions';
import { ComposableCommerceEvents } from '../types/events/ComposableCommerceEvents';

class ComposableCommerce extends Integration<ComposableCommerceEvents> {
  constructor(sdk: SDK<ComposableCommerceEvents>) {
    super(sdk);

    this.project = getProjectActions(sdk);
    this.product = getProductActions(sdk);
    this.cart = getCartActions(sdk);
    this.wishlist = getWishlistActions(sdk);
    this.account = getAccountActions(sdk);
  }

  unregisterExtension(): void {}

  project: ProjectActions;
  product: ProductActions;
  cart: CartActions;
  wishlist: WishlistActions;
  account: AccountActions;
}

export { ComposableCommerce };
