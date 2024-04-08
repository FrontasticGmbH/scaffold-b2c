import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class ValidationError extends ExtensionError {
  static VALIDATION_ERROR_NAME: 'validation_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = ValidationError.VALIDATION_ERROR_NAME;
  }
}
