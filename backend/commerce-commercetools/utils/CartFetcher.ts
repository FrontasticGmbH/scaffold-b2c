import { ActionContext, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { CartApi } from '../apis/CartApi';

export class CartFetcher {
  static async fetchCart(cartApi: CartApi, request: Request, actionContext: ActionContext): Promise<Cart> {
    return (await this.fetchCartFromSession(cartApi, request, actionContext)) ?? (await cartApi.getAnonymous());
  }

  static async fetchCartFromSession(
    cartApi: CartApi,
    request: Request,
    actionContext: ActionContext,
  ): Promise<Cart | undefined> {
    // If the user just logged in and the anonymous cart was merged into the account cart, we want to return
    // the account cart as it might be different from the anonymous cart id that was stored in the session.
    if (request.sessionData?.account !== undefined) {
      return await cartApi.getForUser(request.sessionData.account);
    }

    if (request.sessionData?.cartId !== undefined) {
      try {
        return await cartApi.getActiveCartById(request.sessionData.cartId);
      } catch (error) {
        console.info(`Error fetching the cart ${request.sessionData.cartId}. ${error}`);
      }
    }

    return undefined;
  }
}
