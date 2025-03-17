import { FC } from 'react';
import { useTranslations } from 'use-intl';
import Typography from 'components/commercetools-ui/atoms/typography';
import { Account } from 'types/entity/account';
import { ShippingMethod } from 'types/entity/cart';
import { Order } from 'types/entity/order';
import useOrderInfoData from '../hooks/useOrderInfoData';

type ThankYouOrderInfoProps = {
  firstName?: Account['firstName'];
  order?: Order;
  shippingMethods: ShippingMethod[];
};

const ThankYouOrderInfo: FC<ThankYouOrderInfoProps> = ({ firstName, order, shippingMethods }) => {
  const translate = useTranslations();

  const loading = !order;

  const { orderNumber, deliveryMethod, shippingAddress, paymentInfo } = useOrderInfoData({ order, shippingMethods });

  const orderInfo = [
    { label: translate('thank-you.order-number'), value: orderNumber || '-' },
    { label: translate('thank-you.delivery-by'), value: deliveryMethod || '-' },
    {
      label: translate('thank-you.delivery-to'),
      value: firstName || '',
      subValue: shippingAddress || '-',
    },
    { label: translate('thank-you.payment-by'), value: paymentInfo || '-' },
  ];

  return (
    <div className="grid gap-16 border-b border-neutral-400 py-24 md:gap-24 lg:py-36">
      {orderInfo.map(({ label, value, subValue }, index) => (
        <div key={index}>
          <div className="flex flex-wrap gap-5 md:gap-0">
            <div className="md:w-136">
              <Typography className="w-fit text-14 leading-loose text-gray-600 md:text-16" asSkeleton={loading}>
                {label + ':'}
              </Typography>
            </div>
            <Typography className="text-14 font-medium leading-loose text-primary md:text-16" asSkeleton={loading}>
              {value}
            </Typography>
          </div>
          {subValue && (
            <Typography
              className="mt-4 w-fit text-14 leading-loose text-primary md:ml-136 md:text-16"
              asSkeleton={loading}
            >
              {subValue}
            </Typography>
          )}
        </div>
      ))}
    </div>
  );
};

export default ThankYouOrderInfo;
