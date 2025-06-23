import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { CartFetcher } from '../utils/CartFetcher';
import { getLocale } from '../utils/Request';
import { EmailApiFactory } from '../utils/EmailApiFactory';
import handleError from '@Commerce-commercetools/utils/handleError';
import getAccountApi from '@Commerce-commercetools/utils/apiFactory/getAccountApi';
import { AccountFetcher } from '@Commerce-commercetools/utils/AccountFetcher';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export type AccountRegisterBody = {
  email?: string;
  password?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  birthdayYear?: string;
  birthdayMonth?: string;
  birthdayDay?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
};

export type AccountLoginBody = {
  email?: string;
  password?: string;
};

type AccountChangePasswordBody = {
  oldPassword: string;
  newPassword: string;
};

async function loginAccount(request: Request, actionContext: ActionContext, account: Account): Promise<Response> {
  const accountApi = getAccountApi(request, actionContext.frontasticContext);

  const cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

  const { account: loggedInAccount, cart: loggedInCart } = await accountApi.login(account, cart);

  if (!loggedInAccount.confirmed && loggedInAccount.confirmationToken) {
    const locale = getLocale(request);

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);
    await emailApi.sendAccountVerificationEmail(loggedInAccount);

    throw new AccountAuthenticationError({
      message: `Your email address "${loggedInAccount.email}" was not yet verified. Please check your inbox.`,
    });
  }

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(loggedInAccount),
    sessionData: {
      ...accountApi.getSessionData(),
      ...(loggedInAccount
        ? { accountId: loggedInAccount.accountId, accountGroupIds: loggedInAccount.accountGroupIds }
        : {}),
      ...(loggedInCart ? { cartId: loggedInCart.cartId } : {}),
    },
  };

  return response;
}

function parseBirthday(accountRegisterBody: AccountRegisterBody): Date | undefined {
  if (accountRegisterBody && accountRegisterBody.birthdayYear) {
    return new Date(
      +accountRegisterBody.birthdayYear,
      +(accountRegisterBody.birthdayMonth ?? 1),
      +(accountRegisterBody.birthdayDay ?? 1),
    );
  }

  return null;
}

function mapRequestToAccount(request: Request): Account {
  const accountRegisterBody: AccountRegisterBody = JSON.parse(request.body);

  const account: Account = {
    email: accountRegisterBody?.email,
    password: accountRegisterBody?.password,
    salutation: accountRegisterBody?.salutation,
    firstName: accountRegisterBody?.firstName,
    lastName: accountRegisterBody?.lastName,
    birthday: parseBirthday(accountRegisterBody),
    addresses: [],
  };

  if (accountRegisterBody.billingAddress) {
    accountRegisterBody.billingAddress.isDefaultBillingAddress = true;
    accountRegisterBody.billingAddress.isDefaultShippingAddress = !(accountRegisterBody.shippingAddress !== undefined);

    account.addresses.push(accountRegisterBody.billingAddress);
  }

  if (accountRegisterBody.shippingAddress) {
    accountRegisterBody.shippingAddress.isDefaultShippingAddress = true;
    accountRegisterBody.shippingAddress.isDefaultBillingAddress = !(accountRegisterBody.billingAddress !== undefined);

    account.addresses.push(accountRegisterBody.shippingAddress);
  }

  return account;
}

export const getAccount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSession(request);

    if (!accountId) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          loggedIn: false,
        }),
      };
    }

    const accountApi = getAccountApi(request, actionContext.frontasticContext);
    const account = await accountApi.getById(accountId);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify({
        loggedIn: true,
        account,
      }),
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const register: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const locale = getLocale(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = mapRequestToAccount(request);

    const cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    const createdAccount = await accountApi.create(account, cart);

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

    emailApi.sendWelcomeCustomerEmail(createdAccount);

    if (!createdAccount.confirmed) {
      emailApi.sendAccountVerificationEmail(createdAccount);
    }

    // We are unsetting the confirmationToken to avoid exposing it to the client
    createdAccount.confirmationToken = null;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(createdAccount),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const requestConfirmationEmail: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const locale = getLocale(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const accountLoginBody: AccountLoginBody = JSON.parse(request.body);

    const account = {
      email: accountLoginBody.email,
      password: accountLoginBody.password,
    } as Account;

    const cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    const { account: loggedInAccount, cart: loggedInCart } = await accountApi.login(account, cart);

    if (loggedInAccount.confirmed) {
      const response: Response = {
        statusCode: 405,
        body: JSON.stringify(`Your email address "${loggedInAccount.email}" was verified already.`),
        sessionData: {
          ...accountApi.getSessionData(),
          ...(loggedInAccount ? { accountId: loggedInAccount.accountId } : {}),
          ...(loggedInCart ? { cartId: loggedInCart.cartId } : {}),
        },
      };

      return response;
    }

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);
    emailApi.sendAccountVerificationEmail(loggedInAccount);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const confirm: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    type AccountConfirmBody = {
      token?: string;
    };

    const accountConfirmBody: AccountConfirmBody = JSON.parse(request.body);

    const account = await accountApi.confirmEmail(accountConfirmBody.token);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...accountApi.getSessionData(),
        ...(account ? { accountId: account.accountId } : {}),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const login: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountLoginBody: AccountLoginBody = JSON.parse(request.body);

    const account = {
      email: accountLoginBody.email,
      password: accountLoginBody.password,
    } as Account;

    return await loginAccount(request, actionContext, account);
  } catch (error) {
    return handleError(error, request);
  }
};

export const logout: ActionHook = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
    sessionData: {},
  } as Response;
};

/**
 * Change password
 */
export const password: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const accountChangePasswordBody: AccountChangePasswordBody = JSON.parse(request.body);

    const account = await accountApi.updatePassword(
      accountId,
      accountChangePasswordBody.oldPassword,
      accountChangePasswordBody.newPassword,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

/**
 * Request new reset token
 */
export const requestReset: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const locale = getLocale(request);

    type AccountRequestResetBody = {
      email?: string;
    };

    const accountApi = getAccountApi(request, actionContext.frontasticContext);
    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

    const accountRequestResetBody: AccountRequestResetBody = JSON.parse(request.body);

    const passwordResetToken = await accountApi.generatePasswordResetToken(accountRequestResetBody.email);

    emailApi.sendPasswordResetEmail(accountRequestResetBody as Account, passwordResetToken.token);

    return {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...accountApi.getSessionData(),
        accountId: undefined,
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

/**
 * Reset password
 */
export const reset: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    type AccountResetBody = {
      token?: string;
      newPassword?: string;
    };

    const accountResetBody: AccountResetBody = JSON.parse(request.body);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.resetPassword(accountResetBody.token, accountResetBody.newPassword);
    account.password = accountResetBody.newPassword;

    return await loginAccount(request, actionContext, account);
  } catch (error) {
    return handleError(error, request);
  }
};

export const update: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);
    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, getLocale(request));

    const account = mapRequestToAccount(request);

    const updatedAccount = await accountApi.update(accountId, account);

    if (!updatedAccount.confirmed) {
      emailApi.sendAccountVerificationEmail(updatedAccount);
    }

    // We are unsetting the confirmationToken to avoid exposing it to the client
    updatedAccount.confirmationToken = null;

    return {
      statusCode: 200,
      body: JSON.stringify(updatedAccount),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const addAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const address: Address = JSON.parse(request.body).address;

    const account = await accountApi.addAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const addShippingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const address: Address = JSON.parse(request.body).address;

    const account = await accountApi.addShippingAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const addBillingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const address: Address = JSON.parse(request.body).address;

    const account = await accountApi.addBillingAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const requestBody: { address: Address } = JSON.parse(request.body);

    const account = await accountApi.updateAddress(accountId, requestBody.address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const address: Address = JSON.parse(request.body);

    const account = await accountApi.removeAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const setDefaultBillingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const address: Address = JSON.parse(request.body);

    const account = await accountApi.setDefaultBillingAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const setDefaultShippingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const address: Address = JSON.parse(request.body);

    const account = await accountApi.setDefaultShippingAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...accountApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const deleteAccount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const accountDeleteBody: { password: string } = JSON.parse(request.body);

    const account: Account = {
      email: (await accountApi.getById(accountId)).email,
      password: accountDeleteBody.password,
    };

    // Try to login the account with the provided password before deleting it
    const { account: loggedInAccount } = await accountApi.login(account, undefined);

    await accountApi.delete(loggedInAccount);

    return {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...request.sessionData,
        accountId: undefined,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};
