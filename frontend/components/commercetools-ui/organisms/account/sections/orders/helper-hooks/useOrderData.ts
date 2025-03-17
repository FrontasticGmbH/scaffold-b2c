import { useMemo } from 'react';
import { useFormatter } from 'next-intl';
import { ShippingMethod } from 'types/entity/cart';
import { Order } from 'types/entity/order';

type UseOrderDataProps = {
  order?: Order;
  shippingMethods: ShippingMethod[];
};

const useOrderData = ({ order, shippingMethods }: UseOrderDataProps) => {
  const format = useFormatter();
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
      format.dateTime(orderDateCreated, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    );
  }, [orderDateCreated]);

  const formattedShippingDate = useMemo(() => {
    return (
      orderDateShipping &&
      format.dateTime(orderDateShipping, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    );
  }, [orderDateShipping]);

  const formattedDeliveryDate = useMemo(() => {
    return (
      orderDateDelivery &&
      format.dateTime(orderDateDelivery, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    );
  }, [orderDateDelivery]);

  const shippingName = useMemo(() => {
    return shippingMethods.find(
      (shippingMethod: ShippingMethod) => shippingMethod.shippingMethodId === order?.shippingInfo?.shippingMethodId,
    )?.name;
  }, [order, shippingMethods]);

  const shippingInfo = useMemo(() => {
    return `${
      orderDateDelivery &&
      format.dateTime(orderDateDelivery, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } with ${shippingName}`;
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
