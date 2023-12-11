import { ErrorProps, ExtensionError } from '../utils/Errors';

export class CartNotMatchOrderError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'cart_not_match_order_error';
  }
}
