import { ErrorProps, ExtensionError } from '../utils/Errors';

export class LocaleError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'locale_error';
  }
}
