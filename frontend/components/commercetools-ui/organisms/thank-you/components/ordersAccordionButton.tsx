import { FC } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Order } from 'shared/types/cart/Order';
import Image from 'frontastic/lib/image';

type OrdersAccordionButtonProps = { order?: Order };

const OrdersAccordionButton: FC<OrdersAccordionButtonProps> = ({ order }) => {
  const hiddenItemsCount = (order?.lineItems?.length ?? 0) - 3;
  return (
    <div className="hidden w-full justify-between gap-20 lg:flex">
      <div className={`grid max-h-[104px] grid-cols-3 gap-20 overflow-hidden`}>
        {order?.lineItems?.map((lineItem) => (
          <div key={lineItem.lineItemId} className="relative h-[104px] w-[88px] shrink-0">
            <Image
              fill
              src={lineItem.variant?.images?.[0]}
              style={{ objectFit: 'contain' }}
              suffix="small"
              alt={lineItem.name ?? ''}
            />
          </div>
        ))}
      </div>
      {hiddenItemsCount > 0 && (
        <div className="flex cursor-pointer items-center">
          <span className="text-14 text-secondary-black">+{hiddenItemsCount}</span>
          <ChevronDownIcon strokeWidth={1} className="w-24" />
        </div>
      )}
    </div>
  );
};

export default OrdersAccordionButton;
