'use client';

import React from 'react';
import Checkout, { CheckoutWrappedProps } from 'components/commercetools-ui/organisms/checkout';
import CommercetoolsCheckout from 'components/commercetools-ui/organisms/checkout/ct-checkout';
import { useAccount, useCart } from 'frontastic/hooks';
import { TasticProps } from '../types';

const CheckoutTastic = ({ data }: TasticProps<Pick<CheckoutWrappedProps, 'logo'>>) => {
  //CT-Checkout
  return <CommercetoolsCheckout logo={data.logo} />;

  //Fully customized checkout
  // const {
  //   account,
  //   shippingAddresses,
  //   billingAddresses,
  //   defaultBillingAddress,
  //   defaultShippingAddress,
  //   addShippingAddress,
  //   addBillingAddress,
  // } = useAccount();

  // const {
  //   data: cart,
  //   totalItems,
  //   hasOutOfStockItems,
  //   transaction,
  //   shippingMethods,
  //   redeemDiscountCode,
  //   removeDiscountCode,
  //   updateCart,
  // } = useCart();

  // return (
  //   <Checkout
  //     {...data}
  //     account={account}
  //     shippingAddresses={shippingAddresses}
  //     billingAddresses={billingAddresses}
  //     defaultShippingAddress={defaultShippingAddress}
  //     defaultBillingAddress={defaultBillingAddress}
  //     addShippingAddress={addShippingAddress}
  //     addBillingAddress={addBillingAddress}
  //     cart={cart}
  //     transaction={transaction}
  //     hasOutOfStockItems={hasOutOfStockItems}
  //     shippingMethods={shippingMethods?.data ?? []}
  //     totalCartItems={totalItems}
  //     onApplyDiscountCode={redeemDiscountCode}
  //     onRemoveDiscountCode={removeDiscountCode}
  //     onUpdateCart={updateCart}
  //   />
  // );
};

export default CheckoutTastic;
