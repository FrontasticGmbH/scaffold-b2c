import { ErrorProps, ExtensionError } from '../utils/Errors';

export class AccountAuthenticationError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'account_authentication_error';
  }
}
