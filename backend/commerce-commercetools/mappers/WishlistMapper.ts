import { Wishlist } from '@Types/wishlist/Wishlist';
import { ShoppingList, ShoppingListDraft, ShoppingListLineItem } from '@commercetools/platform-sdk';
import { LineItem } from '@Types/wishlist/LineItem';
import { Locale } from '../Locale';
import { ProductRouter } from '../utils/ProductRouter';
import LocalizedValue from '../utils/LocalizedValue';
import { ProductMapper } from './ProductMapper';

export class WishlistMapper {
  static commercetoolsShoppingListToWishlist = (
    commercetoolsShoppingList: ShoppingList,
    locale: Locale,
    defaultLocale: string,
  ): Wishlist => {
    return {
      wishlistId: commercetoolsShoppingList.id,
      wishlistVersion: commercetoolsShoppingList.version.toString(),
      anonymousId: commercetoolsShoppingList.anonymousId,
      accountId: commercetoolsShoppingList.customer?.id ?? undefined,
      name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShoppingList.name),
      lineItems: (commercetoolsShoppingList.lineItems || []).map((lineItem) =>
        WishlistMapper.commercetoolsLineItemToLineItem(lineItem, locale, defaultLocale),
      ),
    };
  };

  private static commercetoolsLineItemToLineItem = (
    commercetoolsLineItem: ShoppingListLineItem,
    locale: Locale,
    defaultLocale: string,
  ): LineItem => {
    const lineItem: LineItem = {
      lineItemId: commercetoolsLineItem.id,
      productId: commercetoolsLineItem.productId,
      name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsLineItem.name),
      type: 'variant',
      addedAt: new Date(commercetoolsLineItem.addedAt),
      count: commercetoolsLineItem.quantity,
      variant: ProductMapper.commercetoolsProductVariantToVariant(commercetoolsLineItem.variant, locale),
    };
    lineItem._url = ProductRouter.generateUrlFor(lineItem);
    return lineItem;
  };

  static wishlistToCommercetoolsShoppingListDraft = (
    wishlist: Omit<Wishlist, 'wishlistId'>,
    locale: Locale,
  ): ShoppingListDraft => {
    return {
      anonymousId: wishlist.anonymousId,
      customer: wishlist.accountId === undefined ? undefined : { typeId: 'customer', id: wishlist.accountId },
      name: { [locale.language]: wishlist.name || '' },
    };
  };
}
