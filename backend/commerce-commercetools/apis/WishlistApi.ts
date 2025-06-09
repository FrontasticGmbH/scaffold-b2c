import { Wishlist } from '@Types/wishlist/Wishlist';
import { WishlistMapper } from '../mappers/WishlistMapper';

import { BaseApi } from './BaseApi';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';

const expandVariants = ['lineItems[*].variant'];

interface AddToWishlistRequest {
  sku: string;
  count: number;
}

export class WishlistApi extends BaseApi {
  async getById(wishlistId: string): Promise<Wishlist> {
    const locale = await this.getCommercetoolsLocal();
    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlistId })
      .get({
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getForAccount(accountId: string): Promise<Wishlist[]> {
    const locale = await this.getCommercetoolsLocal();
    return await this.requestBuilder()
      .shoppingLists()
      .get({
        queryArgs: {
          where: `customer(id="${accountId}")`,
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return response.body.results.map((shoppingList) =>
          WishlistMapper.commercetoolsShoppingListToWishlist(shoppingList, locale, this.defaultLocale),
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getByIdForAccount(wishlistId: string, accountId: string): Promise<Wishlist> {
    const locale = await this.getCommercetoolsLocal();
    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlistId })
      .get({
        queryArgs: {
          where: `customer(id="${accountId}")`,
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async create(wishlist: Omit<Wishlist, 'wishlistId'>): Promise<Wishlist> {
    const locale = await this.getCommercetoolsLocal();
    const body = WishlistMapper.wishlistToCommercetoolsShoppingListDraft(wishlist, locale);
    return await this.requestBuilder()
      .shoppingLists()
      .post({
        body: body,
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async addToWishlist(wishlist: Wishlist, request: AddToWishlistRequest): Promise<Wishlist> {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .post({
        body: {
          version: +wishlist.wishlistVersion,
          actions: [
            {
              action: 'addLineItem',
              sku: request.sku,
              quantity: request.count,
            },
          ],
        },
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async removeLineItem(wishlist: Wishlist, lineItemId: string): Promise<Wishlist> {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .post({
        body: {
          version: +wishlist.wishlistVersion,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId,
            },
          ],
        },
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async deleteWishlist(wishlist: Wishlist): Promise<void> {
    await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .delete({
        queryArgs: {
          version: +wishlist.wishlistVersion,
        },
      })
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async updateLineItemCount(wishlist: Wishlist, lineItemId: string, count: number): Promise<Wishlist> {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .post({
        body: {
          version: +wishlist.wishlistVersion,
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId,
              quantity: count,
            },
          ],
        },
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }
}
