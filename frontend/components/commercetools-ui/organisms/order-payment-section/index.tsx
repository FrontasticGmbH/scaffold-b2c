import React, { FC } from 'react';
import useClassNames from 'helpers/hooks/useClassNames';
import Costs from './components/costs';
import DiscountForm from './components/discount-form';
import PaymentMethods from './components/payment-methods';
import { OrderSummaryProps } from '../order-summary/types';

const OrderPaymentSection: FC<OrderSummaryProps> = ({
  discounts,
  onApplyDiscountCode,
  onRemoveDiscountCode,
  isEmpty,
  className,
  paymentMethods = [],
  button,
  dataReference = 'cart',
  classNames,
  order,
  ...props
}) => {
  const infoContainerClassName = useClassNames(['border-t border-neutral-400 bg-white', classNames?.infoContainer]);

  return (
    <div className={className} {...props}>
      {!isEmpty && !order && (
        <DiscountForm
          className={classNames?.applyDiscountButton}
          discounts={discounts}
          onApplyDiscountCode={onApplyDiscountCode}
          onRemoveDiscountCode={onRemoveDiscountCode}
        />
      )}

      <div className={infoContainerClassName}>
        <Costs
          order={order}
          dataReference={dataReference}
          totalAmountClassName={classNames?.totalAmount}
          subCostsContainerClassName={classNames?.subCostsContainer}
          subCostClassName={classNames?.subCost}
        />

        {button}

        {paymentMethods.length > 0 && <PaymentMethods paymentMethods={paymentMethods} />}
      </div>
    </div>
  );
};

export default OrderPaymentSection;
