import React, { FC } from 'react';
import { Address } from 'shared/types/account';
import { ShipmentState } from 'shared/types/cart';
import OrderSummary from 'components/commercetools-ui/organisms/order-summary';
import OrderInfoSection from './order-info';
import OrderNumber from './order-number';
import OrderStatusBar from './order-status-bar';
import useOrderData from '../helper-hooks/useOrderData';
import useOrderFetch from '../helper-hooks/useOrderFetch';

export interface Props {
  orderId?: string;
}

const OrderPage: FC<Props> = ({ orderId }) => {
  const { orders } = useOrderFetch();

  const order = orders.find((order) => order.orderId === orderId);
  const { formattedOrderDate, formattedShippingDate, formattedDeliveryDate, shippingInfo, paymentInfo } =
    useOrderData(order);

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
