import { Request, Response } from '@frontastic/extension-types';
import { ExtensionError } from '@Commerce-commercetools/errors/Errors';

const handleError = (error: ExtensionError | Error | unknown, request?: Request): Response => {
  if (error instanceof ExtensionError) {
    const statusCode = error.statusCode ?? 503;

    return {
      statusCode: statusCode,
      body: JSON.stringify({
        statusCode: statusCode,
        message: error.message,
      }),
      sessionData: request?.sessionData,
    };
  }

  const errorResponse = error as Error;

  return {
    statusCode: 500,
    body: JSON.stringify({
      statusCode: 500,
      message: errorResponse?.message,
    }),
    sessionData: request?.sessionData,
  };
};

export default handleError;
