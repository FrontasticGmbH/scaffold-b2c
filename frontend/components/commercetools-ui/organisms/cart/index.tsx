import React, { useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import useCloseFlyouts from 'helpers/hooks/useCloseFlyouts';
import CartContent from './components/cart-content';
import { CartProps } from './types';
import OrderSummary from '../order-summary';
import CheckoutButton from '../order-summary/components/checkout-button';
import { CheckoutButtonProps } from '../order-summary/types';
import InfoBanner from 'components/commercetools-ui/molecules/info-banner';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { classnames } from 'helpers/utils/classnames';

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
      hasOutOfStockItems,
    };
  }, [closeFlyouts, translate, hasOutOfStockItems, isEmpty]);

  const [isProcessing, setIsProcessing] = useState(false);

  const removeAllSoldOutItems = async () => {
    setIsProcessing(true);

    const soldOutItems = (props?.cart?.lineItems ?? []).filter((lineItem) => !lineItem.variant?.isOnStock);

    for (const item of soldOutItems) {
      await props.onRemoveItem(item.lineItemId ?? '');
    }

    setIsProcessing(false);
  };

  return (
    <div className="relative bg-neutral-200 p-20 md:p-24 lg:p-48">
      {hasOutOfStockItems && (
        <div className="pb-24">
          <InfoBanner variant="warning">
            <div className="flex items-start gap-8">
              <ExclamationTriangleIcon className="size-20 shrink-0 text-yellow-600" />
              <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
                <p className="text-gray-600">{translate('cart.items-out-of-stock')}</p>
                <p
                  className={classnames('cursor-pointer font-semibold underline', { 'text-gray-300': isProcessing })}
                  onClick={removeAllSoldOutItems}
                >
                  {translate('cart.remove-unavailable-items')}
                </p>
              </div>
            </div>
          </InfoBanner>
        </div>
      )}
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-26">
        <CartContent className="bg-white p-20 md:p-24 lg:w-[70%] lg:rounded-md" isEmpty={isEmpty} {...props} />

        <OrderSummary
          className="bg-white lg:mt-0 lg:w-[30%] lg:rounded-md"
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
