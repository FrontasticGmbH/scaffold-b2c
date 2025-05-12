import { Request } from '@frontastic/extension-types';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';

export class AccountFetcher {
  static fetchAccountIdFromSession(request: Request): string | undefined {
    if (request.sessionData?.accountId !== undefined) {
      return request.sessionData.accountId;
    }

    return undefined;
  }

  static fetchAccountIdFromSessionEnsureLoggedIn(request: Request): string {
    const accountId = this.fetchAccountIdFromSession(request);
    if (!accountId) {
      throw new AccountAuthenticationError({ message: 'Not logged in.' });
    }

    return accountId;
  }
}
