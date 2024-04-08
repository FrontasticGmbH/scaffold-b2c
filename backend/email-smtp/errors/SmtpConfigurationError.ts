import { ErrorProperties, ExtensionError } from '@Commerce-commercetools/errors/Errors';

export class SmtpConfigurationError extends ExtensionError {
  static SMTP_CONFIGURATION_ERROR_NAME: 'smtp_configuration_error';

  constructor(options: ErrorProperties) {
    super(options);
    this.errorName = SmtpConfigurationError.SMTP_CONFIGURATION_ERROR_NAME;
  }
}
