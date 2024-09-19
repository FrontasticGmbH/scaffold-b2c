import { FC } from 'react';
import { LineItem } from 'shared/types/cart/LineItem';
import useClassNames from 'helpers/hooks/useClassNames';
import OrderItem from './order-item';

type OrderItemsListProps = {
  className?: string;
  lineItems: LineItem[];
};

const OrderItemsList: FC<OrderItemsListProps> = ({ lineItems, className }) => {
  const containerClassName = useClassNames([
    'grid max-h-316 w-full grid-cols-1 divide-y divide-neutral-400 overflow-scroll',
    className,
  ]);

  return (
    <div className={containerClassName}>
      {lineItems.map((lineItem) => (
        <OrderItem key={lineItem.lineItemId} lineItem={lineItem} />
      ))}
    </div>
  );
};

export default OrderItemsList;
