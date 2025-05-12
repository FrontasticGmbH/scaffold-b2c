import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { WishlistApi } from '../apis/WishlistApi';
import { Guid } from '../utils/Guid';
import handleError from '@Commerce-commercetools/utils/handleError';
import { AccountFetcher } from '@Commerce-commercetools/utils/AccountFetcher';
import getWishlistApi from '@Commerce-commercetools/utils/apiFactory/getWishlistApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

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

  const accountId = AccountFetcher.fetchAccountIdFromSession(request);
  if (accountId) {
    const wishlistId = request.query.id;
    if (wishlistId !== undefined) {
      return await wishlistApi.getByIdForAccount(wishlistId, accountId);
    }

    const accountWishlists = await wishlistApi.getForAccount(accountId);
    if (accountWishlists.length > 0) {
      return accountWishlists[0];
    }

    return await wishlistApi.create({ accountId: accountId, name: 'Wishlist' });
  }

  return await wishlistApi.create({ anonymousId: Guid.newGuid(), name: 'Wishlist' });
}

export const getWishlist: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);
    const wishlist = await fetchWishlistFromSession(request, wishlistApi);

    return {
      statusCode: 200,
      body: JSON.stringify(wishlist),
      sessionData: {
        ...wishlistApi.getSessionData(),
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const createWishlist: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);

    const body: {
      name?: string;
    } = JSON.parse(request.body);

    const accountId = AccountFetcher.fetchAccountIdFromSession(request);

    const wishlist = await wishlistApi.create({ accountId: accountId, name: body.name ?? 'Wishlist' });

    return {
      statusCode: 200,
      body: JSON.stringify(wishlist),
      sessionData: {
        ...wishlistApi.getSessionData(),
        wishlistId: wishlist.wishlistId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addToWishlist: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);
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
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeLineItem: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);
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
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const deleteWishlist: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);
    const wishlist = await fetchWishlist(request, wishlistApi);

    await wishlistApi.deleteWishlist(wishlist);

    return {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...wishlistApi.getSessionData(),
        wishlistId: undefined,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateLineItemCount: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);
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
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};
