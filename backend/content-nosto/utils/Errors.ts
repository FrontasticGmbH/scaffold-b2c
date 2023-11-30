export type ErrorData = { message: string; errors?: never };

export type ErrorProps = ErrorData | { message?: never; errors: ErrorData[] };

export type ExternalErrorProps = {
  status: number;
  body?: string;
} & ErrorProps;

export abstract class ExtensionError extends Error {
  protected code?: string;
  errors: ErrorData[];

  protected constructor({ message, errors }: ErrorProps) {
    super(message || errors?.[0]?.message);

    this.errors = errors || [{ message }];
  }
}

export class ValidationError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'validation_error';
  }
}

export class ExternalError extends ExtensionError {
  status: number;
  body?: string | Record<string, unknown>;

  constructor(options: ExternalErrorProps) {
    super(options);
    this.status = options.status;
    this.body = options.body;
    this.code = 'external_error';
  }
}
