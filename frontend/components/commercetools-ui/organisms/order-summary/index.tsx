import { useContext } from 'react';
import { AccountContext } from 'context/account';
import { classnames } from 'helpers/utils/classnames';
import LoginSuggestion from './components/login-suggestion';
import SummaryAccordion from './components/summary-accordion';
import { OrderSummaryProps } from './types';
import OrderPaymentSection from '../order-payment-section';

const OrderSummary = ({
  title,
  cart,
  className,
  includeLoginSuggestion,
  includeSummaryAccordion,
  paymentMethods,
  discounts,
  onApplyDiscountCode,
  onRemoveDiscountCode,
  login,
  requestConfirmationEmail,
  requestPasswordReset,
  ...props
}: OrderSummaryProps) => {
  const { loggedIn } = useContext(AccountContext);

  return (
    <div className={classnames('lg:mb rounded-lg bg-white px-16 py-24 lg:px-24', className)}>
      {(title || includeLoginSuggestion) && (
        <div>
          {title && <p className="md:text-18">{title}</p>}

          {includeLoginSuggestion && !loggedIn && (
            <LoginSuggestion
              login={login}
              requestConfirmationEmail={requestConfirmationEmail}
              requestPasswordReset={requestPasswordReset}
            />
          )}
        </div>
      )}

      {includeSummaryAccordion && <SummaryAccordion order={props.order} cart={cart} />}

      <OrderPaymentSection
        discounts={discounts}
        onApplyDiscountCode={onApplyDiscountCode}
        onRemoveDiscountCode={onRemoveDiscountCode}
        classNames={{
          applyDiscountButton: classnames('py-14 text-16', { 'mt-16': !includeSummaryAccordion }),
          totalAmount: 'text-18',
          subCostsContainer: 'pt-12 md:pt-16 mb-20 lg:py-24 lg:mb-16 lg:border-b border-neutral-400',
        }}
        paymentMethods={paymentMethods}
        {...props}
      />
    </div>
  );
};

export default OrderSummary;
