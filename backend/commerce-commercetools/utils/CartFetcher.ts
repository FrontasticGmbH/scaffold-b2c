import { Context, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import getCartApi from './apiFactory/getCartApi';
import getAccountApi from './apiFactory/getAccountApi';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';

export class CartFetcher {
  static async fetchCart(request: Request, context: Context): Promise<Cart> {
    const cart = await this.fetchActiveCartFromSession(request, context);

    if (cart) {
      return cart;
    }

    const cartApi = getCartApi(request, context);

    if (request.sessionData?.accountId) {
      const accountApi = getAccountApi(request, context);
      const account = await accountApi.getById(request.sessionData.accountId);

      return await cartApi.createForAccount(account);
    }

    return await cartApi.createAnonymous();
  }

  static async fetchActiveCartFromSession(request: Request, context: Context): Promise<Cart | undefined> {
    const cartApi = getCartApi(request, context);

    if (request.sessionData?.cartId) {
      try {
        const cart = await cartApi.getById(request.sessionData.cartId);
        if (cartApi.assertCartIsActive(cart)) {
          return cart;
        }
      } catch (error) {
        // Ignore the ResourceNotFoundError as it's expected if the cart does not exist
        if (!(error instanceof ResourceNotFoundError)) {
          throw error;
        }
      }
    }

    if (request.sessionData?.accountId) {
      return await cartApi.getActiveCartForAccount(request.sessionData.accountId);
    }

    return undefined;
  }
}
