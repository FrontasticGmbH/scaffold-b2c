import React, { useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTranslations } from 'use-intl';
import { Order } from 'types/entity/order';
import OrderItem from './OrderItem';

export interface StatusTab {
  name: string;
  slug: string;
}

interface Props {
  orders: Order[];
  loading?: boolean;
}

const Orders = ({ orders, loading }: Props) => {
  const translate = useTranslations();

  const statusTabs: StatusTab[] = [
    { name: translate('orders.all-orders'), slug: 'allorders' },
    { name: translate('orders.confirmed'), slug: 'confirmed' },
    { name: translate('orders.complete'), slug: 'complete' },
    { name: translate('orders.cancelled'), slug: 'cancelled' },
  ];
  const [selectedTab, setSelectedTab] = useState(statusTabs[0].slug);

  const orderHistoryContent = useMemo(() => {
    if (selectedTab === 'allorders') return orders;
    else return orders?.filter((order: Order) => order.orderState === selectedTab);
  }, [selectedTab, orders]);

  const tabTextClassNames = (tab: StatusTab) => {
    return `border-primary pb-8 ${tab.slug === selectedTab ? 'border-b-2 text-primary font-medium' : 'text-gray-600'}`;
  };

  return (
    <>
      {loading ? (
        <Skeleton className="h-30" />
      ) : (
        <>
          <div>
            <div className="w-full overflow-auto border-b-2 border-neutral-400 pt-24">
              <div className="flex justify-between">
                {statusTabs.map((tab) => (
                  <div
                    key={tab.slug}
                    onClick={() => setSelectedTab(tab.slug)}
                    className="cursor-pointer whitespace-nowrap pr-36"
                  >
                    <p className={tabTextClassNames(tab)}>{tab.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-auto py-24">
            {orderHistoryContent?.map((order?: Order) => <OrderItem key={order?.orderId} order={order} />)}
          </div>
        </>
      )}
    </>
  );
};

export default Orders;
