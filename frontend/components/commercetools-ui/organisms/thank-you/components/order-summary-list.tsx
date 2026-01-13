import { FC } from 'react';
import { Order } from 'shared/types/cart/Order';
import OrderLineItem from './order-item';

type OrderSummaryListProps = {
  className?: string;
  order?: Order;
};

const OrderSummaryList: FC<OrderSummaryListProps> = ({ className, order }) => {
  return (
    <div className={className}>
      {order?.lineItems?.map((lineItem) => (
        <OrderLineItem key={lineItem.productId} {...lineItem} />
      ))}

      {!order?.lineItems && <OrderLineItem />}
    </div>
  );
};

export default OrderSummaryList;
