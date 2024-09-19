import { useMemo } from 'react';
import { Order } from 'shared/types/cart/Order';
import { ShippingMethod } from 'shared/types/cart/ShippingMethod';
import useOrderFetch from './useOrderFetch';

const useOrderData = (order?: Order) => {
  const { shippingMethods } = useOrderFetch();

  const orderDateCreated = useMemo(() => {
    return order?.createdAt && new Date(order?.createdAt);
  }, [order]);

  const orderDateShipping = useMemo(() => {
    return order?.createdAt && new Date(new Date(order?.createdAt).setDate(new Date(order?.createdAt).getDate() + 3));
  }, [order]);

  const orderDateDelivery = useMemo(() => {
    return order?.createdAt && new Date(new Date(order?.createdAt).setDate(new Date(order?.createdAt).getDate() + 6));
  }, [order]);

  const formattedOrderDate = useMemo(() => {
    return (
      orderDateCreated &&
      `${new Date(orderDateCreated).toDateString().split(' ')[0]}, ${
        new Date(orderDateCreated).toDateString().split(' ')[1]
      } ${new Date(orderDateCreated).toDateString().split(' ')[2]}`
    );
  }, [orderDateCreated]);

  const formattedShippingDate = useMemo(() => {
    return (
      orderDateShipping &&
      `${new Date(orderDateShipping).toDateString().split(' ')[0]}, ${
        new Date(orderDateShipping).toDateString().split(' ')[1]
      } ${new Date(orderDateShipping).toDateString().split(' ')[2]}`
    );
  }, [orderDateShipping]);

  const formattedDeliveryDate = useMemo(() => {
    return (
      orderDateDelivery &&
      `${new Date(orderDateDelivery).toDateString().split(' ')[0]}, ${
        new Date(orderDateDelivery).toDateString().split(' ')[1]
      } ${new Date(orderDateDelivery).toDateString().split(' ')[2]}`
    );
  }, [orderDateDelivery]);

  const shippingName = useMemo(() => {
    return shippingMethods.data?.find(
      (shippingMethod: ShippingMethod) => shippingMethod.shippingMethodId === order?.shippingInfo?.shippingMethodId,
    )?.name;
  }, [order, shippingMethods]);

  const shippingInfo = useMemo(() => {
    return `${orderDateDelivery && new Date(orderDateDelivery).toISOString().split('T')[0]} with ${shippingName}`;
  }, [orderDateDelivery, shippingName]);

  const paymentInfo = useMemo(() => {
    return order?.payments && `${order?.payments[0]?.paymentMethod}`;
    //return order?.payments && `${order?.payments[0]?.paymentMethod} **${order?.payments[0]?.cardSummary}`;
  }, [order?.payments]);

  return {
    shippingInfo,
    paymentInfo,
    formattedOrderDate,
    formattedShippingDate,
    formattedDeliveryDate,
  };
};
export default useOrderData;
