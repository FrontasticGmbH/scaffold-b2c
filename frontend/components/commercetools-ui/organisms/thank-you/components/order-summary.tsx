import React, { FC } from 'react';
import { useParams } from 'next/navigation';
import { Order } from 'shared/types/cart/Order';
import { Money } from 'shared/types/product/Money';
import { useTranslations } from 'use-intl';
import Accordion from 'components/commercetools-ui/atoms/accordion';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useClassNames from 'helpers/hooks/useClassNames';
import OrderSummaryList from './order-summary-list';
import OrdersAccordionButton from './ordersAccordionButton';
import PrintButton from './printButton';

type OrderSummaryProps = {
  order: Order;
  onPrint: () => void;
};

const OrderSummary: FC<OrderSummaryProps> = ({ order, onPrint }) => {
  const translate = useTranslations();

  const { locale } = useParams();

  const summaryInfo: Array<{ label: string; value?: Money }> = [
    {
      label: translate('cart.subtotal'),
      value: order.sum,
    },
    {
      label: translate('cart.discount'),
      value: order.sum,
    },
    {
      label: translate('cart.shipping-estimate'),
      value: order.shippingInfo?.price,
    },
    {
      label: translate('cart.tax'),
      value: order.taxed?.taxAmount,
    },
  ];

  return (
    <div className="grow bg-white px-16 md:px-24 lg:p-36">
      <div className="my-16 md:mb-0 md:border-b md:border-neutral-400 md:pb-16 md:text-18 lg:m-0 lg:border-b-0 lg:pb-28">
        <h4 className="w-fit text-18 leading-[20px] text-primary">{translate('thank-you.order-details')}</h4>
      </div>

      <OrderSummaryList
        className={useClassNames([{ 'lg:hidden': !!order.lineItems && order.lineItems.length > 1 }])}
        order={order}
      />

      {order.lineItems && order.lineItems.length > 1 && (
        <Accordion
          closedSectionTitle={translate('thank-you.your-order')}
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
                <p className="text-14 text-primary md:text-16">{label}</p>
                <p className="text-14 text-primary md:text-16">
                  {CurrencyHelpers.formatForCurrency(value ?? 99999, locale)}
                </p>
              </div>
            );
        })}

        <div className="mt-16 flex items-center justify-between lg:mt-12 lg:border-t lg:border-neutral-400 lg:pt-12">
          <p className="font-medium text-primary md:text-18 lg:leading-loose">{translate('cart.total') + ':'}</p>
          <p className="font-medium text-primary md:text-18 lg:leading-loose">
            {CurrencyHelpers.formatForCurrency(order?.sum ?? 999999, locale)}
          </p>
        </div>
      </div>

      <PrintButton asSkeleton={!order.sum} onPrint={onPrint} className="hidden w-full lg:block" />
    </div>
  );
};

export default OrderSummary;
