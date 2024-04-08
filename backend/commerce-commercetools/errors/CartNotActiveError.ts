import { ExtensionError, ExtensionErrorProperties } from '@Commerce-commercetools/errors/Errors';

export class CartNotActiveError extends ExtensionError {
  static CART_NOT_ACTIVE_ERROR_NAME: 'cart_not_active_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = CartNotActiveError.CART_NOT_ACTIVE_ERROR_NAME;
  }
}
