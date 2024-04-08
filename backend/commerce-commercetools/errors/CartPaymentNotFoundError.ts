import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class CartPaymentNotFoundError extends ExtensionError {
  static CART_PAYMENT_NOT_FOUND_ERROR_NAME: 'cart_payment_not_found_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = CartPaymentNotFoundError.CART_PAYMENT_NOT_FOUND_ERROR_NAME;
  }
}
