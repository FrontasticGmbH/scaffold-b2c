import React, { useState } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
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
};

export const CheckoutWrapped = ({
  logo,
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

  const [isFinalStep, setIsFinalStep] = useState(false);

  const { processing } = useCheckout();

  const { purchase } = usePurchase({ cart, transaction, hasOutOfStockItems });

  return (
    <div className="min-h-screen lg:bg-neutral-200">
      <Header logo={logo} totalCartItems={totalCartItems} />
      <div className="lg:mx-48">
        <Secure />
        <div className="flex-row-reverse items-start gap-24 lg:flex">
          <OrderSummary
            discounts={cart?.discountCodes ?? []}
            onApplyDiscountCode={onApplyDiscountCode}
            onRemoveDiscountCode={onRemoveDiscountCode}
            className="bg-white px-16 md:px-24 lg:w-[30%] lg:rounded-md lg:p-36 xl:px-48"
            includeSummaryAccordion
            title={translate('cart.order-summary')}
            classNames={{
              applyDiscountButton: 'lg:mb-0 py-14 text-16 mb-16 border-b border-neutral-400 lg:border-b-transparent',
              totalAmount: 'text-18 md:pb-20',
              subCostsContainer: 'pt-12 md:pt-16 mb-20 lg:py-24 lg:mb-16 lg:border-b border-neutral-400',
            }}
            button={
              <Button
                variant="primary"
                disabled={!isFinalStep}
                className="w-full"
                type="submit"
                onClick={purchase}
                loading={processing}
              >
                {translate('cart.complete-purchase')}
              </Button>
            }
          />
          <Steps
            cart={cart}
            onUpdateCart={onUpdateCart}
            shippingMethods={shippingMethods}
            onPurchase={purchase}
            onFinalStepChange={setIsFinalStep}
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
