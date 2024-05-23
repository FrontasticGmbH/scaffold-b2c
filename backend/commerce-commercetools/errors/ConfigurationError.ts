import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class ConfigurationError extends ExtensionError {
  static CONFIGURATION_ERROR_NAME: 'configuration_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = ConfigurationError.CONFIGURATION_ERROR_NAME;
  }
}
