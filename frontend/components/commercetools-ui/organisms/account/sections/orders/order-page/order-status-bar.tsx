import React, { FC } from 'react';
import { ShipmentState } from 'shared/types/cart';
import Typography from 'components/commercetools-ui/atoms/typography';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';

export interface Props {
  orderDate: string;
  orderShippingDate: string;
  orderDeliveryDate: string;
  orderState: string;
  orderShippingState: ShipmentState;
}
const OrderStatusBar: FC<Props> = ({
  orderDate,
  orderShippingDate,
  orderDeliveryDate,
  orderState,
  orderShippingState,
}) => {
  const { formatMessage: formatOrdersMessage } = useFormat({ name: 'orders' });

  const statePointer2ClassNames = useClassNames([
    'absolute left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 transform rounded-full md:h-24 md:w-24 lg:h-32 lg:w-32',
    orderShippingState === 'Shipped' || orderState === 'Complete'
      ? 'bg-primary-black'
      : 'bg-neutral-100 border border-primary-black',
  ]);

  const statePointer3ClassNames = useClassNames([
    'absolute right-0 h-20 w-20 -translate-y-1/2 rounded-full md:h-24 md:w-24 lg:h-32 lg:w-32',
    orderState === 'Complete' ? 'bg-primary-black' : 'bg-neutral-100 border border-primary-black',
  ]);

  return (
    <div className="mt-36 flex w-full justify-center px-16 md:mt-48 md:px-0 2xl:mt-80 2xl:justify-start">
      <div className="relative w-[80%] justify-center pb-16 md:w-[70%] 2xl:ml-80 2xl:w-[60%]">
        <div className="h-1 w-full bg-primary-black" />
        <div className="absolute left-0 h-20 w-20 -translate-y-1/2 rounded-full bg-primary-black md:h-24 md:w-24 lg:h-32 lg:w-32" />
        <div className="absolute -left-32 top-20 flex flex-col items-center md:-left-56 md:top-24 md:w-144 lg:top-28">
          <Typography className="w-64 text-center text-14 font-medium text-primary-black lg:text-16">
            {formatOrdersMessage({
              id: 'ordered',
              defaultMessage: 'Ordered',
            })}
          </Typography>

          <Typography className="mt-4 text-center text-14 text-secondary-black lg:text-16">{orderDate}</Typography>
        </div>

        <div className={statePointer2ClassNames} />
        <div className="absolute left-1/2 top-20 -translate-x-1/2 md:top-24 lg:top-28">
          {orderShippingState === 'Shipped' || orderState === 'Complete' ? (
            <Typography className="text-center text-14 font-medium text-primary-black lg:text-16">
              {formatOrdersMessage({
                id: 'shipped',
                defaultMessage: 'Shipped',
              })}
            </Typography>
          ) : (
            <>
              <Typography className="hidden text-center text-14 font-medium text-primary-black md:block lg:text-16">
                {formatOrdersMessage({
                  id: 'estimated.shipping',
                  defaultMessage: 'Estimated Shipping',
                })}
              </Typography>

              <Typography className="block text-center text-14 font-medium text-primary-black md:hidden">
                {formatOrdersMessage({
                  id: 'est.shipping',
                  defaultMessage: 'Est. Shipping',
                })}
              </Typography>
            </>
          )}

          <Typography className="mt-4 text-center text-14 text-secondary-black lg:text-16">
            {orderShippingDate}
          </Typography>
        </div>

        <div className={statePointer3ClassNames} />
        <div className="absolute -right-32 top-20 md:-right-60 md:top-24 md:w-144 lg:top-28">
          {orderState === 'Complete' ? (
            <Typography className="text-center text-14 font-medium text-primary-black lg:text-16">
              {formatOrdersMessage({
                id: 'delivered',
                defaultMessage: 'Delivered',
              })}
            </Typography>
          ) : (
            <>
              <Typography className="hidden text-center text-14 font-medium text-primary-black md:block lg:text-16">
                {formatOrdersMessage({
                  id: 'estimated.delivery',
                  defaultMessage: 'Estimated Delivery',
                })}
              </Typography>

              <Typography className="block text-center text-14 font-medium text-primary-black md:hidden">
                {formatOrdersMessage({
                  id: 'est.delivery',
                  defaultMessage: 'Est. Delivery',
                })}
              </Typography>
            </>
          )}

          <Typography className="mt-4 text-center text-14 text-secondary-black lg:text-16">
            {orderDeliveryDate}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusBar;
