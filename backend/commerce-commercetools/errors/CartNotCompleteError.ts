import { ErrorProps, ExtensionError } from '../utils/Errors';

export class CartNotCompleteError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'cart_not_complete_error';
  }
}
