import React, { FC, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Order } from 'shared/types/cart/Order';
import Accordion from 'components/commercetools-ui/atoms/accordion';
import Typography from 'components/commercetools-ui/atoms/typography';
import Costs from 'components/commercetools-ui/organisms/order-payment-section/components/costs';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import useI18n from 'helpers/hooks/useI18n';
import mapCosts from 'helpers/utils/mapCosts';
import Image from 'frontastic/lib/image';

export interface Props {
  order?: Order;
}

const OrderSummaryMobile: FC<Props> = ({ order }) => {
  const { locale } = useParams();
  const { currency } = useI18n();

  const { formatMessage: formatOrdersMessage } = useFormat({ name: 'orders' });

  const [open, setOpen] = useState(false);

  const accordionClassNames = useClassNames(['block 2xl:hidden my-24 lg:mt-40']);

  const accordionContentClassNames = useClassNames([
    'flex w-full justify-between border-y py-16',
    open ? 'border-t' : '',
  ]);

  const lineItemClassNames = (order: Order, index: number) => {
    return `
      flex justify-start py-16
      ${order?.lineItems && index === order.lineItems.length - 1 ? '' : 'border-b'}`;
  };

  const arrowClassNames = useClassNames([open ? 'rotate-180 transform' : '', 'transition mr-8']);
  const orderSummaryAccordion = useMemo(() => {
    return (
      <div className="px-16 md:px-24 lg:px-44">
        <div className={accordionContentClassNames} onClick={() => setOpen(!open)}>
          <Typography className="text-secondary-black">
            {formatOrdersMessage({
              id: 'your.order',
              defaultMessage: 'Your Order',
            })}
          </Typography>

          <div className="flex">
            <Typography className="hidden pr-8 font-medium text-primary-black md:block">
              {CurrencyHelpers.formatForCurrency(mapCosts({ order, currency }).total)}
            </Typography>
            <ChevronDownIcon width={20} strokeWidth={1.5} className={arrowClassNames} />
          </div>
        </div>
      </div>
    );
  }, [accordionContentClassNames, formatOrdersMessage, order, currency, arrowClassNames, open]);

  return (
    <Accordion customClosedButton={orderSummaryAccordion} className={accordionClassNames} buttonClassName="w-full">
      <div className="grid max-h-400 w-full grid-cols-1 overflow-auto px-16 md:px-24 lg:px-44">
        {order?.lineItems?.map((lineItem, index) => (
          <div key={lineItem.lineItemId} className={lineItemClassNames(order, index)}>
            {lineItem.variant?.images?.[0] && (
              <div className="relative h-104 w-88 shrink-0">
                <Image fill src={lineItem.variant.images[0]} style={{ objectFit: 'contain' }} />
              </div>
            )}
            <div className="flex flex-col justify-center pl-16">
              <Typography className="text-14 uppercase text-primary-black">{lineItem?.name}</Typography>
              <Typography className="mt-8 text-14 font-medium text-primary-black">
                {CurrencyHelpers.formatForCurrency(lineItem?.price as number, locale)}
              </Typography>
              <Typography className="mt-8 text-14 text-primary-black">{`x ${lineItem?.count}`}</Typography>
            </div>
          </div>
        ))}
      </div>

      <Costs className="bg-neutral-200 p-16 md:px-24 lg:px-44" order={order} />
    </Accordion>
  );
};

export default OrderSummaryMobile;
