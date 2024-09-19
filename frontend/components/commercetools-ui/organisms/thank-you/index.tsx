import React, { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from 'shared/types/cart/Order';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import ThankYouOrderInfo from './components/order-info';
import PrintButton from './components/printButton';
import ThankYouFooter from './components/thank-you-footer';
import ThankYouHeader from './components/thank-you-header';
import OrderSummary from '../order-summary';

const ThankYouContent: FC = () => {
  const { formatMessage } = useFormat({ name: 'thank-you' });

  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order>();
  const { getOrder, resetCart } = useCart();

  useEffect(() => {
    if (!order) {
      getOrder(orderId as string).then((res) => {
        setOrder(res);
        resetCart?.();
      });
    }
  }, [getOrder, order, orderId, resetCart]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-neutral-200 lg:gap-26 lg:p-50">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-26 lg:px-20 lg:py-48 xl:px-48">
        <div className="bg-white px-16 md:px-24 lg:w-[65%] lg:rounded-md lg:py-36">
          <ThankYouHeader email={order?.email} onPrint={handlePrint} />
          <ThankYouOrderInfo firstName={order?.shippingAddress?.firstName} order={order} />
          <ThankYouFooter loading={!order?.sum} />
        </div>

        <OrderSummary
          className="bg-white px-16 pb-24 md:px-24 lg:mt-0 lg:block lg:min-w-[35%] lg:p-36"
          title={formatMessage({ id: 'order?.details', defaultMessage: 'Order details' })}
          order={order}
          dataReference="order"
          includeItemsList
          button={
            <PrintButton asSkeleton={!order?.sum} onPrint={handlePrint} className="mt-16 hidden w-full lg:block" />
          }
          classNames={{
            infoContainer: 'border-none p-0 pt-16',
            totalAmount:
              'md:text-18 font-medium flex items-center justify-between lg:border-t lg:border-neutral-400 lg:pt-12',
          }}
        />
      </div>
    </div>
  );
};

export default ThankYouContent;
