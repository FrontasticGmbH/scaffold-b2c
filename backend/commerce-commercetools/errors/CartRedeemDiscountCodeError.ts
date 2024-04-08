import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class CartRedeemDiscountCodeError extends ExtensionError {
  static CART_REDEEM_DISCOUNT_CODE_ERROR_NAME: 'cart_redeem_discount_code_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = CartRedeemDiscountCodeError.CART_REDEEM_DISCOUNT_CODE_ERROR_NAME;
  }
}
