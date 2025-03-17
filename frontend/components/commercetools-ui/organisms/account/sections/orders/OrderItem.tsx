import React, { FC } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useI18n from 'helpers/hooks/useI18n';
import mapCosts from 'helpers/utils/mapCosts';
import { Order } from 'types/entity/order';
import useOrderData from './helper-hooks/useOrderData';

interface Props {
  order?: Order;
}

const OrderItem: FC<Props> = ({ order }) => {
  const { currency } = useI18n();
  const { locale } = useParams();

  const { formattedOrderDate } = useOrderData({
    order,
    shippingMethods: [],
  });

  const translate = useTranslations();
  const { total: getTotal } = mapCosts({ cart: order, currency });

  const handleReturnClick = () => {
    toast.success(translate('orders.return-success'));
  };

  return (
    <div className="mb-24 w-full rounded-md border-[1.5px] border-neutral-300">
      <div className="grid grid-cols-1 items-center rounded-t-md bg-neutral-150 p-12 md:grid-cols-3 md:p-16 lg:grid-cols-4 lg:px-24 lg:py-32">
        <div className="flex-col">
          <div className="flex whitespace-nowrap pb-16">
            <Typography className="text-14 font-medium text-primary lg:text-16">
              {translate('orders.order-number')}
            </Typography>
            <Typography
              className="truncate pl-5 text-14 text-primary lg:text-16"
              title={order?.orderNumber?.replaceAll('-', ' ')}
            >
              {order?.orderNumber?.replaceAll('-', ' ')}
            </Typography>
          </div>

          <div className="flex">
            <Typography className="text-14 font-medium text-primary md:hidden">
              {translate('orders.order-date')}
            </Typography>
            <Typography className="pl-5 text-14 text-primary md:pl-0 md:text-gray-600">{formattedOrderDate}</Typography>
          </div>
        </div>

        <div className="ml-48 hidden md:flex md:flex-col">
          <Typography className="pb-15 font-medium text-primary">{translate('orders.total')}</Typography>
          <Typography className="text-14 text-gray-600">
            {CurrencyHelpers.formatForCurrency(getTotal, locale)}
          </Typography>
        </div>

        <div className="hidden md:flex md:flex-col">
          <Typography className="pb-15 font-medium text-primary">{translate('orders.status')}</Typography>
          <Typography className="text-14 text-gray-600">
            {
              // @ts-ignore
              translate(`orders.${order?.orderState?.toLowerCase()}`)
            }
          </Typography>
        </div>
        <div className="hidden justify-end lg:flex">
          <Button variant="primary" size="s" onClick={handleReturnClick} className="rounded-md px-16 py-8">
            <Typography className="text-14 font-medium">{translate('orders.create-return')}</Typography>
          </Button>
        </div>
      </div>
      <Link link={`?hash=orders&id=order_${order?.orderId}`}>
        <div className="flex w-full cursor-pointer items-center justify-between px-12 py-16 md:px-16 lg:px-24 lg:py-20">
          <div className="flex">
            <Typography className="text-14 text-primary">{order?.lineItems?.length.toString()}</Typography>
            <Typography className="pl-7 text-14 text-primary">{translate('orders.articles')}</Typography>
          </div>

          <ChevronRightIcon strokeWidth={1.5} className="w-24 text-gray-600" />
        </div>
      </Link>
    </div>
  );
};

export default OrderItem;
