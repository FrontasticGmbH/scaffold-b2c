import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class CartNotCompleteError extends ExtensionError {
  static CART_NOT_COMPLETE_ERROR_NAME: 'cart_not_complete_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = CartNotCompleteError.CART_NOT_COMPLETE_ERROR_NAME;
  }
}
