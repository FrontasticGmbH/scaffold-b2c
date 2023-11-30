import { Request } from '@frontastic/extension-types';
import { Token } from '@Types/Token';

export const getToken = (request: Request): Token | undefined => {
  if (request !== undefined) {
    const token: Token | undefined = request.sessionData?.token ?? undefined;

    return token;
  }

  return undefined;
};

export const tokenHasExpired = (token?: Token): boolean => {
  if (token === undefined) {
    return true;
  }

  return Date.now() >= token.expirationTime;
};
