import { Request } from '@frontastic/extension-types';
import { ExternalError } from './Errors';

const handleError = (error: ExternalError | Error | unknown, request?: Request) => {
  if (error instanceof ExternalError) {
    return {
      statusCode: error.status,
      body: JSON.stringify(error.body),
      sessionData: request?.sessionData,
    };
  }

  const errorResponse = error as Error;

  return {
    statusCode: 400,
    message: errorResponse.message,
    sessionData: request?.sessionData,
  };
};

export default handleError;
