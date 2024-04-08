import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class AccountAuthenticationError extends ExtensionError {
  static ACCOUNT_AUTHENTICATION_ERROR_NAME: 'account_authentication_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = AccountAuthenticationError.ACCOUNT_AUTHENTICATION_ERROR_NAME;
  }
}
