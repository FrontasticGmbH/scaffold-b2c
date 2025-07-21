'use client';

import React from 'react';
import Checkout, { CheckoutWrappedProps } from 'components/commercetools-ui/organisms/checkout';
import CommercetoolsCheckout from 'components/commercetools-ui/organisms/checkout/ct-checkout';
import { TasticProps } from '../types';
import { useCart } from 'frontastic/hooks';

const CheckoutTastic = ({
  data,
}: TasticProps<Pick<CheckoutWrappedProps, 'logo' | 'isCtPaymentOnly' | 'callbackUrl'>>) => {
  const { data: cart, transaction, updateCart, shippingMethods, redeemDiscountCode, removeDiscountCode } = useCart();

  //Full commercetools checkout
  if (!data.isCtPaymentOnly) return <CommercetoolsCheckout logo={data.logo} callbackUrl={data.callbackUrl} />;

  //Custom checkout with commercetools payment only
  return (
    <Checkout
      logo={data.logo}
      isCtPaymentOnly
      cart={cart}
      transaction={transaction}
      hasOutOfStockItems={!!cart?.lineItems?.find((item) => !item.variant?.isOnStock)}
      onUpdateCart={updateCart}
      shippingMethods={shippingMethods.data ?? []}
      onApplyDiscountCode={redeemDiscountCode}
      onRemoveDiscountCode={removeDiscountCode}
      callbackUrl={data.callbackUrl}
    />
  );
};

export default CheckoutTastic;
