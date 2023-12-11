import { ErrorProps, ExtensionError } from '../utils/Errors';

export class ValidationError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'validation_error';
  }
}
