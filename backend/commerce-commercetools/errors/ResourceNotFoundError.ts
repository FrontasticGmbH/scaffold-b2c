import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class ResourceNotFoundError extends ExtensionError {
  static RESOURCE_NOT_FOUND_ERROR_NAME: 'resource_not_found_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = ResourceNotFoundError.RESOURCE_NOT_FOUND_ERROR_NAME;
    this.statusCode = options.statusCode ?? 404;
  }
}
