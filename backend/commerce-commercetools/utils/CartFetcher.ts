import { Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { CartApi } from '../apis/CartApi';

export class CartFetcher {
  static async fetchCart(cartApi: CartApi, request: Request): Promise<Cart> {
    const cart = await this.fetchCartFromSession(cartApi, request);

    if (cart) {
      return cart;
    }

    if (request.sessionData?.account !== undefined) {
      return await cartApi.getForUser(request.sessionData.account);
    }

    return await cartApi.getAnonymous();
  }

  static async fetchCartFromSession(cartApi: CartApi, request: Request): Promise<Cart | undefined> {
    if (request.sessionData?.cartId !== undefined) {
      try {
        return await cartApi.getActiveCartById(request.sessionData.cartId);
      } catch (error) {
        console.info(`It was not possible to fetch the cart ${request.sessionData.cartId}. ${error}`);
      }
    }

    return undefined;
  }
}
