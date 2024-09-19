'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ThankYou from 'components/commercetools-ui/organisms/thank-you';
import { Order } from 'types/entity/order';
import { useCart } from 'frontastic/hooks';

const ThankYouTastic = () => {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order>();
  const { getOrder, resetCart, shippingMethods } = useCart();

  useEffect(() => {
    if (!order) {
      getOrder(orderId as string).then((res) => {
        setOrder(res);
        resetCart?.();
      });
    }
  }, [getOrder, order, orderId, resetCart]);

  return <ThankYou order={order} shippingMethods={shippingMethods.data ?? []} />;
};

export default ThankYouTastic;
