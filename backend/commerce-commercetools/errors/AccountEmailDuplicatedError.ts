import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class AccountEmailDuplicatedError extends ExtensionError {
  static ACCOUNT_EMAIL_DUPLICATED_ERROR_NAME: 'account_email_duplicated_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = AccountEmailDuplicatedError.ACCOUNT_EMAIL_DUPLICATED_ERROR_NAME;
  }
}
