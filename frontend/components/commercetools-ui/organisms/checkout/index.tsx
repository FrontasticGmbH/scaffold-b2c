import React, { FC, useState } from 'react';
import Button from 'components/commercetools-ui/atoms/button';
import { useFormat } from 'helpers/hooks/useFormat';
import Footer from './components/footer';
import Header, { Props as HeaderProps } from './components/header';
import Secure from './components/secure';
import Steps from './components/steps';
import usePurchase from './hooks/usePurchase';
import CheckoutProvider, { useCheckout } from './provider';
import OrderSummary from '../order-summary';

export type CheckoutWrappedProps = HeaderProps;

const CheckoutWrapped: React.FC<CheckoutWrappedProps> = ({ logo, ...emptyState }) => {
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const [isFinalStep, setIsFinalStep] = useState(false);

  const { processing } = useCheckout();

  const { purchase } = usePurchase();

  return (
    <div className="min-h-screen lg:bg-neutral-200">
      <Header logo={logo} {...emptyState} />
      <div className="lg:mx-48">
        <Secure />
        <div className="flex-row-reverse items-start gap-24 lg:flex">
          <OrderSummary
            className="bg-white px-16 md:px-24 lg:w-[30%] lg:rounded-md lg:p-36 xl:px-48"
            includeSummaryAccordion
            title={formatCartMessage({ id: 'order.summary', defaultMessage: 'Order summary' })}
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
                {formatCheckoutMessage({ id: 'complete.purchase', defaultMessage: 'Complete purchase' })}
              </Button>
            }
          />
          <Steps onPurchase={purchase} onFinalStepChange={setIsFinalStep} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Checkout: FC<CheckoutWrappedProps> = (props) => (
  <CheckoutProvider>
    <CheckoutWrapped {...props} />
  </CheckoutProvider>
);

export default Checkout;
