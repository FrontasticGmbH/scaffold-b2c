import { ExternalError, ExternalErrorProps } from '../utils/Errors';

export class CartRedeemDiscountCodeError extends ExternalError {
  errorCode: number;

  constructor(options: { errorCode: string } & ExternalErrorProps) {
    super(options);
    this.code = 'cart_redeem_discount_code_error';
  }
}
