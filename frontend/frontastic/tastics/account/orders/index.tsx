'use client';

import React from 'react';
import OrdersHistory from 'components/commercetools-ui/organisms/account/sections/orders';
import useOrderFetch from 'components/commercetools-ui/organisms/account/sections/orders/helper-hooks/useOrderFetch';

const AccountOrdersHistoryTastic = () => {
  const { orders, loading } = useOrderFetch();

  return <OrdersHistory orders={orders} loading={loading} />;
};

export default AccountOrdersHistoryTastic;
