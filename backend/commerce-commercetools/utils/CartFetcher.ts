import { Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { CartApi } from '../apis/CartApi';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';

export class CartFetcher {
  static async fetchCart(cartApi: CartApi, request: Request): Promise<Cart> {
    const cart = await this.fetchActiveCartFromSession(cartApi, request);

    if (cart) {
      return cart;
    }

    return request.sessionData?.account !== undefined
      ? await cartApi.createForAccount(request.sessionData.account)
      : await cartApi.createAnonymous();
  }

  static async fetchActiveCartFromSession(cartApi: CartApi, request: Request): Promise<Cart | undefined> {
    if (request.sessionData?.cartId !== undefined) {
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

    if (request.sessionData?.account !== undefined) {
      return await cartApi.getActiveCartForAccount(request.sessionData.account);
    }

    return undefined;
  }
}
