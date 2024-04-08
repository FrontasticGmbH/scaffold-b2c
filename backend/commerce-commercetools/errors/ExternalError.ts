import { ExtensionError, ExtensionErrorProperties } from './Errors';

export interface ExternalErrorProperties extends ExtensionErrorProperties {
  body?: string;
}

export class ExternalError extends ExtensionError {
  static EXTERNAL_ERROR_NAME: 'external_error';
  static DUPLICATED_FIELD_ERROR_NAME: 'duplicate_field';
  static ASSOCIATE_MISSING_PERMISSION_ERROR_NAME: 'associate_missing_permission';

  statusCode: number;

  constructor(props: ExternalErrorProperties) {
    super(props);
    this.statusCode = isNaN(props.statusCode) ? 503 : props.statusCode;
    this.errorName = ExternalError.EXTERNAL_ERROR_NAME;

    if (props.body?.['errors']?.[0]?.['code'] === 'AssociateMissingPermission') {
      this.statusCode = 403;
      this.message = 'Not enough permissions to perform this action';
      this.errorName = ExternalError.ASSOCIATE_MISSING_PERMISSION_ERROR_NAME;
    }

    if (props.body?.['errors']?.[0]?.['code'] === 'DuplicateField') {
      this.errorName = ExternalError.DUPLICATED_FIELD_ERROR_NAME;
    }
  }
}
