export type ErrorData = { message: string; errors?: string[] };

export interface ErrorProperties {
  message: string;
  errors?: ErrorData[];
}

export interface ExtensionErrorProperties extends ErrorProperties {
  statusCode?: number;
}

export abstract class ExtensionError extends Error {
  errorName?: string;
  errors?: ErrorData[];
  statusCode?: number;

  protected constructor({ message, errors, statusCode }: ExtensionErrorProperties) {
    super(message || errors[0]?.message);

    this.errors = errors || [{ message }];
    this.statusCode = isNaN(statusCode) ? 503 : statusCode;
  }
}
