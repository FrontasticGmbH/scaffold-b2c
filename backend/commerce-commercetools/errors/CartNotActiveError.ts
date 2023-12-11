import { ErrorProps, ExtensionError } from '../utils/Errors';

export class CartNotActiveError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'cart_not_active_error';
  }
}
