import { ExtensionError, ExtensionErrorProperties } from '@Commerce-commercetools/errors/Errors';

export class CartNotMatchOrderError extends ExtensionError {
  static CART_NOT_MATCH_ORDER_ERROR_NAME: 'cart_not_match_order_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = CartNotMatchOrderError.CART_NOT_MATCH_ORDER_ERROR_NAME;
  }
}
