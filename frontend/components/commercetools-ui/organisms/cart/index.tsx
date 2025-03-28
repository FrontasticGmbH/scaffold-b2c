import React, { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import useCloseFlyouts from 'helpers/hooks/useCloseFlyouts';
import CartContent from './components/cart-content';
import { CartProps } from './types';
import OrderSummary from '../order-summary';
import CheckoutButton from '../order-summary/components/checkout-button';
import { CheckoutButtonProps } from '../order-summary/types';

const Cart = ({
  isEmpty,
  hasOutOfStockItems,
  onApplyDiscountCode,
  onRemoveDiscountCode,
  paymentMethods,
  login,
  requestConfirmationEmail,
  requestPasswordReset,
  ...props
}: CartProps) => {
  const translate = useTranslations();

  const closeFlyouts = useCloseFlyouts();

  const defaultCheckoutButtonProps: CheckoutButtonProps = useMemo(() => {
    return {
      text: translate('cart.checkout-go'),
      link: '/checkout',
      onClick: closeFlyouts,
      disabled: isEmpty || hasOutOfStockItems,
    };
  }, [closeFlyouts, translate, hasOutOfStockItems, isEmpty]);

  return (
    <div className="relative bg-neutral-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-26 lg:px-20 lg:py-48 xl:px-48">
        <CartContent
          className="bg-white px-16 md:px-24 lg:w-[70%] lg:rounded-md lg:px-20 lg:py-48 xl:px-48"
          isEmpty={isEmpty}
          {...props}
        />

        <OrderSummary
          className="bg-white px-16 pb-12 pt-24 md:px-24 md:py-12 lg:mt-0 lg:w-[30%] lg:rounded-md lg:p-36 lg:px-32 lg:pb-44 xl:px-48"
          title={translate('cart.order-summary')}
          includeLoginSuggestion
          paymentMethods={paymentMethods}
          button={<CheckoutButton className="hidden md:block" {...defaultCheckoutButtonProps} />}
          discounts={props.cart?.discountCodes ?? []}
          onApplyDiscountCode={onApplyDiscountCode}
          onRemoveDiscountCode={onRemoveDiscountCode}
          login={login}
          requestConfirmationEmail={requestConfirmationEmail}
          requestPasswordReset={requestPasswordReset}
        />
      </div>

      <CheckoutButton
        className="sticky bottom-0 w-full border-t border-neutral-400 bg-white p-16 md:hidden"
        {...defaultCheckoutButtonProps}
      />
    </div>
  );
};

export default Cart;
