import { useContext } from 'react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { AccountContext } from 'context/account';
import useClassNames from 'helpers/hooks/useClassNames';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import { desktop } from 'helpers/utils/screensizes';
import LoginSuggestion from './components/login-suggestion';
import SummaryAccordion from './components/summary-accordion';
import { OrderSummaryProps } from './types';
import OrderItemsListing from '../order-items-listing';
import OrderPaymentSection from '../order-payment-section';
import DiscountForm from '../order-payment-section/components/discount-form';

const OrderSummary = ({
  title,
  cart,
  className,
  includeLoginSuggestion,
  includeSummaryAccordion,
  paymentMethods,
  includeItemsList,
  discounts,
  onApplyDiscountCode,
  onRemoveDiscountCode,
  login,
  requestConfirmationEmail,
  requestPasswordReset,
  ...props
}: OrderSummaryProps) => {
  const [isDesktopSize] = useMediaQuery(desktop);

  const { loggedIn } = useContext(AccountContext);

  const itemsListClassName = useClassNames(['mb-24 border-y border-neutral-400', props.classNames?.itemsList]);

  return (
    <div className={className}>
      {(title || includeLoginSuggestion) && (
        <div className="py-16 md:py-24 lg:pb-24 lg:pt-0">
          {title && <Typography className="md:text-18">{title}</Typography>}

          {includeLoginSuggestion && !loggedIn && (
            <LoginSuggestion
              login={login}
              requestConfirmationEmail={requestConfirmationEmail}
              requestPasswordReset={requestPasswordReset}
            />
          )}
        </div>
      )}

      {includeItemsList && props.order?.lineItems && (
        <OrderItemsListing className={itemsListClassName} lineItems={props.order?.lineItems} />
      )}

      {includeSummaryAccordion && <SummaryAccordion className="lg:hidden" order={props.order} cart={cart} />}

      {!isDesktopSize && includeSummaryAccordion && (
        <DiscountForm
          discounts={discounts}
          onApplyDiscountCode={onApplyDiscountCode}
          onRemoveDiscountCode={onRemoveDiscountCode}
          className={props.classNames?.applyDiscountButton}
        />
      )}

      {(isDesktopSize || !includeSummaryAccordion) && (
        <OrderPaymentSection
          discounts={discounts}
          onApplyDiscountCode={onApplyDiscountCode}
          onRemoveDiscountCode={onRemoveDiscountCode}
          classNames={{
            applyDiscountButton: 'py-14 text-16',
            totalAmount: 'text-18 md:pb-20',
            subCostsContainer: 'pt-12 md:pt-16 mb-20 lg:py-24 lg:mb-16 lg:border-b border-neutral-400',
          }}
          paymentMethods={paymentMethods}
          {...props}
        />
      )}
    </div>
  );
};

export default OrderSummary;
