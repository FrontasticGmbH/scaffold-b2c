import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { WishlistApi } from '../apis/WishlistApi';
import { Guid } from '../utils/Guid';
import { Account } from '@Types/account/Account';
import { getCurrency, getLocale } from '../utils/Request';
import { AccountAuthenticationError } from '../errors/AccountAuthenticationError';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

function getWishlistApi(request: Request, actionContext: ActionContext) {
  return new WishlistApi(actionContext.frontasticContext, getLocale(request), getCurrency(request), request);
}

function fetchAccountFromSession(request: Request): Account | undefined {
  return request.sessionData?.account;
}

function fetchAccountFromSessionEnsureLoggedIn(request: Request): Account {
  const account = fetchAccountFromSession(request);
  if (!account) {
    throw new AccountAuthenticationError({ message: 'Not logged in.' });
  }
  return account;
}

async function fetchWishlistFromSession(request: Request, wishlistApi: WishlistApi) {
  if (request.sessionData?.wishlistId !== undefined) {
    try {
      return await wishlistApi.getById(request.sessionData?.wishlistId);
    } catch (error) {
      console.info(`Error fetching the wishlist ${request.sessionData.wishlistId}. ${error}`);
    }
  }

  return undefined;
}

async function fetchWishlist(request: Request, wishlistApi: WishlistApi) {
  if (request.sessionData?.wishlistId !== undefined) {
    try {
      return await wishlistApi.getById(request.sessionData?.wishlistId);
    } catch (error) {
      console.info(`Error fetching the wishlist ${request.sessionData.wishlistId}, creating a new one. ${error}`);
    }
  }

  const account = fetchAccountFromSession(request);
  if (account) {
    const wishlistId = request.query.id;
    if (wishlistId !== undefined) {
      return await wishlistApi.getByIdForAccount(wishlistId, account.accountId);
    }

    const accountWishlists = await wishlistApi.getForAccount(account.accountId);
    if (accountWishlists.length > 0) {
      return accountWishlists[0];
    }

    return await wishlistApi.create({ accountId: account.accountId, name: 'Wishlist' });
  }

  return await wishlistApi.create({ anonymousId: Guid.newGuid(), name: 'Wishlist' });
}

export const getWishlist: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await fetchWishlistFromSession(request, wishlistApi);

  return {
    statusCode: 200,
    body: wishlist ? JSON.stringify(wishlist) : '',
    sessionData: {
      ...wishlistApi.getSessionData(),
    },
  };
};

export const createWishlist: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);

  const body: {
    name?: string;
  } = JSON.parse(request.body);

  const account = fetchAccountFromSessionEnsureLoggedIn(request);

  const wishlist = await wishlistApi.create({ accountId: account.accountId, name: body.name ?? 'Wishlist' });

  return {
    statusCode: 200,
    body: JSON.stringify(wishlist),
    sessionData: {
      ...wishlistApi.getSessionData(),
      wishlistId: wishlist.wishlistId,
    },
  };
};

export const addToWishlist: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await fetchWishlist(request, wishlistApi);

  const body: {
    variant?: { sku?: string };
    count?: number;
  } = JSON.parse(request.body);

  const updatedWishlist = await wishlistApi.addToWishlist(wishlist, {
    sku: body?.variant?.sku || undefined,
    count: body.count || 1,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(updatedWishlist),
    sessionData: {
      ...wishlistApi.getSessionData(),
      wishlistId: updatedWishlist.wishlistId,
    },
  };
};

export const removeLineItem: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await fetchWishlist(request, wishlistApi);

  const body: {
    lineItem?: { id?: string };
  } = JSON.parse(request.body);

  const updatedWishlist = await wishlistApi.removeLineItem(wishlist, body.lineItem?.id ?? undefined);

  return {
    statusCode: 200,
    body: JSON.stringify(updatedWishlist),
    sessionData: {
      ...wishlistApi.getSessionData(),
      wishlistId: updatedWishlist.wishlistId,
    },
  };
};

export const deleteWishlist: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await fetchWishlist(request, wishlistApi);

  await wishlistApi.deleteWishlist(wishlist);

  return {
    statusCode: 200,
    body: '',
    sessionData: {
      ...wishlistApi.getSessionData(),
      wishlistId: undefined,
    },
  };
};

export const updateLineItemCount: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await fetchWishlist(request, wishlistApi);

  const body: {
    lineItem?: { id?: string };
    count?: number;
  } = JSON.parse(request.body);

  const updatedWishlist = await wishlistApi.updateLineItemCount(
    wishlist,
    body.lineItem?.id ?? undefined,
    body.count || 1,
  );

  return {
    statusCode: 200,
    body: JSON.stringify(updatedWishlist),
    sessionData: {
      ...wishlistApi.getSessionData(),
      wishlistId: updatedWishlist.wishlistId,
    },
  };
};
