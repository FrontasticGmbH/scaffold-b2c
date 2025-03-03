import React, { FC } from 'react';
import { useParams } from 'next/navigation';
import { Order } from 'shared/types/cart/Order';
import { Money } from 'shared/types/product/Money';
import Accordion from 'components/commercetools-ui/atoms/accordion';
import Typography from 'components/commercetools-ui/atoms/typography';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import OrderSummaryList from './order-summary-list';
import OrdersAccordionButton from './ordersAccordionButton';
import PrintButton from './printButton';

type OrderSummaryProps = {
  order: Order;
  onPrint: () => void;
};

const OrderSummary: FC<OrderSummaryProps> = ({ order, onPrint }) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const { formatMessage } = useFormat({ name: 'thank-you' });

  const { locale } = useParams();

  const summaryInfo: Array<{ label: string; value?: Money }> = [
    {
      label: formatCartMessage({ id: 'subtotal', defaultMessage: 'Subtotal' }),
      value: order.sum,
    },
    {
      label: formatCartMessage({ id: 'discount', defaultMessage: 'Discount' }),
      value: order.sum,
      //value: order.shippingInfo?.discounts,
    },
    {
      label: formatCartMessage({ id: 'shipping.estimate', defaultMessage: 'Est. Shipping' }),
      value: order.shippingInfo?.price,
    },
    {
      label: formatCartMessage({ id: 'tax', defaultMessage: 'Tax' }),
      value: order.taxed?.taxAmount,
    },
  ];

  return (
    <div className="grow bg-white px-16 md:px-24 lg:p-36">
      <div className="my-16 md:mb-0 md:border-b md:border-neutral-400 md:pb-16 md:text-18 lg:m-0 lg:border-b-0 lg:pb-28">
        <Typography as="h4" asSkeleton={!order.sum} className="w-fit text-18 leading-[20px] text-primary">
          {formatMessage({ id: 'order.details', defaultMessage: 'Order details' })}
        </Typography>
      </div>

      <OrderSummaryList
        className={useClassNames([{ 'lg:hidden': !!order.lineItems && order.lineItems.length > 1 }])}
        order={order}
      />

      {order.lineItems && order.lineItems.length > 1 && (
        <Accordion
          closedSectionTitle={formatMessage({ id: 'your.order', defaultMessage: 'Your order' })}
          className="hidden divide-y divide-neutral-400 lg:block lg:pt-0"
          buttonClassName="py-16 border-y w-full border-neutral-400"
          customClosedButton={<OrdersAccordionButton order={order} />}
        >
          <OrderSummaryList className="max-h-316 divide-y divide-neutral-400 overflow-scroll" order={order} />
        </Accordion>
      )}

      {/* Order summary info */}
      <div className="grid gap-8 border-t border-neutral-400 bg-white py-16 lg:pt-32">
        {summaryInfo.map(({ label, value }, index) => {
          if ((value?.centAmount && value.centAmount > 0 && !!order.sum) || !order.sum)
            return (
              <div key={index} className="flex items-center justify-between">
                <Typography asSkeleton={!order.sum} className="text-14 text-primary md:text-16">
                  {label}
                </Typography>
                <Typography asSkeleton={!order.sum} className="text-14 text-primary md:text-16">
                  {CurrencyHelpers.formatForCurrency(value ?? 99999, locale)}
                </Typography>
              </div>
            );
        })}

        <div className="mt-16 flex items-center justify-between lg:mt-12 lg:border-t lg:border-neutral-400 lg:pt-12">
          <Typography asSkeleton={!order.sum} className="font-medium text-primary md:text-18 lg:leading-loose">
            {formatCartMessage({ id: 'total', defaultMessage: 'Total' }) + ':'}
          </Typography>
          <Typography asSkeleton={!order.sum} className="font-medium text-primary md:text-18 lg:leading-loose">
            {CurrencyHelpers.formatForCurrency(order?.sum ?? 999999, locale)}
          </Typography>
        </div>
      </div>

      <PrintButton asSkeleton={!order.sum} onPrint={onPrint} className="hidden w-full lg:block" />
    </div>
  );
};

export default OrderSummary;
