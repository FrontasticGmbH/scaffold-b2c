import { ErrorProps, ExtensionError } from '../utils/Errors';

export class TokenError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'token_error';
  }
}
