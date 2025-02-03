'use client';

import React, { useCallback, useContext } from 'react';
import { useParams } from 'next/navigation';
import { LineItem as CartLineItem } from 'shared/types/cart';
import Cart from 'components/commercetools-ui/organisms/cart';
import { CartProps } from 'components/commercetools-ui/organisms/cart/types';
import { AccountContext } from 'context/account';
import { mapCategotry } from 'helpers/entity-mappers/map-category';
import { useCart, useWishlist } from 'frontastic';
import { TasticProps } from '../types';

const CartTastic = ({ data, categories }: TasticProps<CartProps>) => {
  const { locale } = useParams();

  const { login, requestConfirmationEmail, requestPasswordReset } = useContext(AccountContext);

  const {
    data: cart,
    isEmpty,
    hasOutOfStockItems,
    removeItem,
    updateItem,
    redeemDiscountCode,
    removeDiscountCode,
    totalItems,
  } = useCart();

  const { data: wishlist, addToWishlist } = useWishlist();

  const moveToWishlist = useCallback(
    async (lineItem: CartLineItem) => {
      if (!wishlist) return;

      await Promise.all([
        await removeItem(lineItem.lineItemId as string),
        addToWishlist(
          wishlist,
          {
            lineItemId: lineItem.lineItemId ?? '',
            productId: lineItem.productId,
            name: lineItem.name,
            type: lineItem.type,
            count: 1,
            variant: lineItem.variant,
            addedAt: new Date(),
            _url: lineItem._url,
          },
          1,
        ),
      ]);
    },
    [removeItem, addToWishlist, wishlist],
  );

  return (
    <Cart
      {...data}
      cart={cart}
      isEmpty={isEmpty}
      totalItems={totalItems}
      hasOutOfStockItems={hasOutOfStockItems}
      onApplyDiscountCode={redeemDiscountCode}
      onRemoveDiscountCode={removeDiscountCode}
      categories={categories.map((c) => mapCategotry(c, { locale }))}
      onRemoveItem={removeItem}
      onUpdateItem={updateItem}
      OnMoveToWishlist={moveToWishlist}
      login={login}
      requestConfirmationEmail={requestConfirmationEmail}
      requestPasswordReset={requestPasswordReset}
    />
  );
};

export default CartTastic;
