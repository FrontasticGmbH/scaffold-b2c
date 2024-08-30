import { Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { CartApi } from '../apis/CartApi';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';

export class CartFetcher {
  static async fetchCart(cartApi: CartApi, request: Request): Promise<Cart> {
    const cart = await this.fetchActiveCartFromSession(cartApi, request);

    if (cart) {
      return cart;
    }

    return await cartApi.getAnonymous();
  }

  static async fetchActiveCartFromSession(cartApi: CartApi, request: Request): Promise<Cart | undefined> {
    if (request.sessionData?.cartId !== undefined) {
      try {
        const cart = await cartApi.getById(request.sessionData.cartId);
        if (cartApi.assertCartIsActive(cart)) {
          return cart;
        }
      } catch (error) {
        // A ExternalError might be thrown if the cart does not exist or belongs to a different business unit,
        // in which case we should create a new cart.
        if (!(error instanceof ExternalError)) {
          throw error;
        }
      }
    }

    if (request.sessionData?.account !== undefined) {
      return await cartApi.getForUser(request.sessionData.account);
    }

    return undefined;
  }
}
