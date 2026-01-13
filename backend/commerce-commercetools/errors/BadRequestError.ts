import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class BadRequestError extends ExtensionError {
  static BAD_REQUEST_ERROR_NAME: 'bad_request_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = BadRequestError.BAD_REQUEST_ERROR_NAME;
    this.statusCode = options.statusCode ?? 400;
  }
}
