import React, { useMemo } from 'react';
import useCloseFlyouts from 'helpers/hooks/useCloseFlyouts';
import { useFormat } from 'helpers/hooks/useFormat';
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
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const closeFlyouts = useCloseFlyouts();

  const defaultCheckoutButtonProps: CheckoutButtonProps = useMemo(() => {
    return {
      text: formatCartMessage({ id: 'checkout.go', defaultMessage: 'Go to checkout' }),
      link: '/checkout',
      onClick: closeFlyouts,
      disabled: isEmpty || hasOutOfStockItems,
    };
  }, [closeFlyouts, formatCartMessage, hasOutOfStockItems, isEmpty]);

  return (
    <div className="relative bg-neutral-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-26 lg:px-20 lg:py-48 xl:px-48">
        <CartContent
          className="bg-white px-16 py-12 md:px-24 md:py-12 lg:w-[70%] lg:rounded-md lg:px-20 lg:py-36 xl:px-48"
          {...props}
        />

        <OrderSummary
          className="bg-white px-16 pb-12 pt-24 md:px-24 md:py-12 lg:mt-0 lg:w-[30%] lg:rounded-md lg:p-36 lg:px-2 lg:pb-44 xl:px-48"
          title={formatCartMessage({ id: 'order.summary', defaultMessage: 'Order Summary' })}
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
