import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class LocaleError extends ExtensionError {
  static LOCALE_ERROR_NAME: 'locale_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = LocaleError.LOCALE_ERROR_NAME;
  }
}
