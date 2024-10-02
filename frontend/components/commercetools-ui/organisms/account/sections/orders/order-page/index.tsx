import React, { FC } from 'react';
import OrderSummary from 'components/commercetools-ui/organisms/order-summary';
import { Address } from 'types/entity/account';
import { ShippingMethod } from 'types/entity/cart';
import { Order, ShipmentState } from 'types/entity/order';
import OrderInfoSection from './order-info';
import OrderNumber from './order-number';
import OrderStatusBar from './order-status-bar';
import useOrderData from '../helper-hooks/useOrderData';

export interface Props {
  order: Order;
  shippingMethods: ShippingMethod[];
}

const OrderPage: FC<Props> = ({ order, shippingMethods }) => {
  const { formattedOrderDate, formattedShippingDate, formattedDeliveryDate, shippingInfo, paymentInfo } = useOrderData({
    order,
    shippingMethods,
  });

  return (
    <div className="md:mt-20 lg:mt-40">
      {order && (
        <>
          <OrderNumber orderNumber={order.orderId ?? ''} />

          <div className="mt-12">
            <OrderStatusBar
              orderDate={formattedOrderDate ?? ''}
              orderShippingDate={formattedShippingDate ?? ''}
              orderDeliveryDate={formattedDeliveryDate ?? ''}
              orderState={order.orderState ?? 'Registered'}
              orderShippingState={'Pending' as ShipmentState}
            />
          </div>

          <div className="mt-96 flex px-0 lg:flex-col lg:px-44 xl:flex-row">
            <OrderInfoSection
              order={order}
              shippingInfo={shippingInfo}
              paymentInfo={paymentInfo ?? ''}
              shippingAddress={order.shippingAddress as Address}
              orderState={order.orderState ?? 'Registered'}
            />

            <OrderSummary
              discounts={[]}
              onApplyDiscountCode={async () => {}}
              onRemoveDiscountCode={async () => {}}
              order={order}
              includeItemsList
              includeSummaryAccordion
              className="ml-44 hidden h-fit w-[42%] rounded-md border lg:px-36 lg:py-20 2xl:block 3xl:w-[37%]"
              classNames={{
                itemsList: 'border-transparent lg:m-0',
                subCostsContainer: 'border-b border-neutral-400 pb-24',
                totalAmount: 'mt-16',
                infoContainer: 'lg:pt-24',
              }}
              button={undefined}
              dataReference="order"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;
