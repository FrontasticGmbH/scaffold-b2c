import React, { FC } from 'react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { useFormat } from 'helpers/hooks/useFormat';

interface Props {
  orderNumber: string;
}

const OrderNumber: FC<Props> = ({ orderNumber }) => {
  const { formatMessage: formatOrdersMessage } = useFormat({ name: 'orders' });

  return (
    <>
      <div className="mt-16 pb-12 md:mt-0">
        <Typography
          as="h2"
          className="mt-20 pl-16 text-18 text-primary-black md:mt-0 md:pl-24 md:text-22 lg:pl-44 lg:text-24"
        >
          {formatOrdersMessage({
            id: 'order.details',
            defaultMessage: 'Order Details',
          })}
        </Typography>
      </div>

      <div className="mt-8 flex flex-row pl-16 md:mt-12 md:px-0 md:pl-24 lg:mt-24 lg:pl-44">
        <Typography className="whitespace-nowrap text-14 text-secondary-black md:text-16">
          {formatOrdersMessage({
            id: 'order.number',
            defaultMessage: 'Order number:',
          })}
        </Typography>
        <Typography className="ml-8 whitespace-nowrap text-14 font-medium text-primary-black md:text-16">
          {orderNumber.replaceAll('-', ' ')}
        </Typography>
      </div>
    </>
  );
};

export default OrderNumber;
