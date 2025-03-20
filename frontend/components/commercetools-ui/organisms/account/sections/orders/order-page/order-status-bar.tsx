import React, { FC } from 'react';
import { ShipmentState } from 'shared/types/cart';
import { useTranslations } from 'use-intl';
import useClassNames from 'helpers/hooks/useClassNames';

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
  const translate = useTranslations();

  const statePointer2ClassNames = useClassNames([
    'absolute left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 transform rounded-full md:h-24 md:w-24 lg:h-32 lg:w-32',
    orderShippingState === 'Shipped' || orderState === 'Complete' ? 'bg-primary' : 'bg-white border border-primary',
  ]);

  const statePointer3ClassNames = useClassNames([
    'absolute right-0 h-20 w-20 -translate-y-1/2 rounded-full md:h-24 md:w-24 lg:h-32 lg:w-32',
    orderState === 'Complete' ? 'bg-primary' : 'bg-white border border-primary',
  ]);

  return (
    <div className="mt-36 flex w-full justify-center px-16 md:mt-48 md:px-0 2xl:mt-80 2xl:justify-start">
      <div className="relative w-4/5 justify-center pb-16 md:w-[70%] 2xl:ml-80 2xl:w-3/5">
        <div className="h-1 w-full bg-primary" />
        <div className="absolute left-0 size-20 -translate-y-1/2 rounded-full bg-primary md:size-24 lg:size-32" />
        <div className="absolute -left-32 top-20 flex flex-col items-center md:-left-56 md:top-24 md:w-144 lg:top-28">
          <p className="w-64 text-center text-14 font-medium text-primary lg:text-16">{translate('orders.ordered')}</p>

          <p className="mt-4 text-center text-14 text-gray-600 lg:text-16">{orderDate}</p>
        </div>

        <div className={statePointer2ClassNames} />
        <div className="absolute left-1/2 top-20 -translate-x-1/2 md:top-24 lg:top-28">
          {orderShippingState === 'Shipped' || orderState === 'Complete' ? (
            <p className="text-center text-14 font-medium text-primary lg:text-16">{translate('orders.shipped')}</p>
          ) : (
            <>
              <p className="hidden text-center text-14 font-medium text-primary md:block lg:text-16">
                {translate('orders.estimated-shipping')}
              </p>

              <p className="block text-center text-14 font-medium text-primary md:hidden">
                {translate('orders.est-shipping')}
              </p>
            </>
          )}

          <p className="mt-4 text-center text-14 text-gray-600 lg:text-16">{orderShippingDate}</p>
        </div>

        <div className={statePointer3ClassNames} />
        <div className="absolute -right-32 top-20 md:-right-60 md:top-24 md:w-144 lg:top-28">
          {orderState === 'Complete' ? (
            <p className="text-center text-14 font-medium text-primary lg:text-16">{translate('orders.delivered')}</p>
          ) : (
            <>
              <p className="hidden text-center text-14 font-medium text-primary md:block lg:text-16">
                {translate('orders.estimated-delivery')}
              </p>

              <p className="block text-center text-14 font-medium text-primary md:hidden">
                {translate('orders.est-delivery')}
              </p>
            </>
          )}

          <p className="mt-4 text-center text-14 text-gray-600 lg:text-16">{orderDeliveryDate}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusBar;
