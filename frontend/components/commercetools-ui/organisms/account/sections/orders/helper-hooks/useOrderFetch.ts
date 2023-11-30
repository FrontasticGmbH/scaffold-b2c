import { useEffect, useState } from 'react';
import { Order } from 'shared/types/cart/Order';
import { useCart } from 'frontastic';

const useOrderFetch = () => {
  const { orderHistory, shippingMethods } = useCart();
  const [orders, setAccountOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderHistory) {
      setLoading(true);

      orderHistory()
        .then((data) => {
          setAccountOrders(data);
          setLoading(false);
        })
        .catch(() => {
          setAccountOrders([]);
          setLoading(false);
        });
    }
  }, [orderHistory]);

  return {
    orders,
    shippingMethods,
    loading,
  };
};

export default useOrderFetch;
