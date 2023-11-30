import { ErrorProps, ExtensionError } from '../utils/Errors';

export class CartPaymentNotFoundError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'cart_payment_not_found_error';
  }
}
