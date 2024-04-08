import { ExtensionError, ExtensionErrorProperties } from '@Commerce-commercetools/errors/Errors';

export class TokenError extends ExtensionError {
  static TOKEN_ERROR_NAME: 'token_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = TokenError.TOKEN_ERROR_NAME;
  }
}
