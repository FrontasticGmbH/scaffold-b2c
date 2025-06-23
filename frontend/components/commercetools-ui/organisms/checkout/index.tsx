import React, { useState } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import { desktop } from 'helpers/utils/screensizes';
import { Cart, DiscountCode, ShippingMethod } from 'types/entity/cart';
import { CartDetails, Transaction } from 'frontastic/hooks/useCart/types';
import Footer from './components/footer';
import Header, { Props as HeaderProps } from './components/header';
import Secure from './components/secure';
import Steps from './components/steps';
import usePurchase from './hooks/usePurchase';
import CheckoutProvider, { useCheckout } from './provider';
import OrderSummary from '../order-summary';

export type CheckoutWrappedProps = HeaderProps & {
  cart?: Cart;
  transaction: Transaction;
  hasOutOfStockItems?: boolean;
  shippingMethods: ShippingMethod[];
  onApplyDiscountCode?: (code: string) => Promise<void>;
  onRemoveDiscountCode?: (discount: DiscountCode) => Promise<void>;
  onUpdateCart?: (payload: CartDetails) => Promise<Cart>;
  isCtPaymentOnly?: boolean;
};

export const CheckoutWrapped = ({
  logo,
  isCtPaymentOnly,
  cart,
  transaction,
  totalCartItems,
  hasOutOfStockItems,
  shippingMethods,
  onApplyDiscountCode,
  onRemoveDiscountCode,
  onUpdateCart,
}: CheckoutWrappedProps) => {
  const translate = useTranslations();

  const [isDesktop] = useMediaQuery(desktop);

  const [isFinalStep, setIsFinalStep] = useState(false);

  const { processing } = useCheckout();

  const { purchase } = usePurchase({ cart, transaction, hasOutOfStockItems });

  return (
    <div className="min-h-screen bg-neutral-200">
      <Header logo={logo} totalCartItems={totalCartItems} />
      <div className="lg:mx-48">
        <Secure />
        <div className="flex flex-col gap-24 p-16 md:p-24 lg:flex-row-reverse lg:items-start lg:p-0">
          <OrderSummary
            cart={cart}
            discounts={cart?.discountCodes ?? []}
            onApplyDiscountCode={onApplyDiscountCode}
            onRemoveDiscountCode={onRemoveDiscountCode}
            className="lg:min-w-[30%]"
            includeSummaryAccordion
            includeItemsList
            title={translate('cart.order-summary')}
            classNames={{
              totalAmount: 'text-18',
              subCostsContainer: 'pt-12 md:pt-16 mb-20 lg:py-24 lg:mb-16 lg:border-b border-neutral-400',
            }}
            button={
              isDesktop ? (
                <Button
                  variant="primary"
                  disabled={!isFinalStep || hasOutOfStockItems}
                  className="w-full"
                  type="submit"
                  loading={processing}
                  {...(isCtPaymentOnly
                    ? {
                        'data-ctc-selector': 'paymentButton',
                      }
                    : {
                        onClick: purchase,
                      })}
                >
                  {translate('cart.complete-purchase')}
                </Button>
              ) : undefined
            }
          />
          <Steps
            cart={cart}
            onUpdateCart={onUpdateCart}
            shippingMethods={shippingMethods}
            onPurchase={purchase}
            onFinalStepChange={setIsFinalStep}
            isCtPaymentOnly={isCtPaymentOnly}
            hasOutOfStockItems={hasOutOfStockItems}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Checkout = (props: CheckoutWrappedProps) => (
  <CheckoutProvider>
    <CheckoutWrapped {...props} />
  </CheckoutProvider>
);

export default Checkout;
