import { useCallback, useEffect, useState } from 'react';
import { ShippingMethod } from 'types/entity/cart';
import { Order } from 'types/entity/order';

type UseOrderInfoDataProps = {
  order?: Order;
  shippingMethods: ShippingMethod[];
};

const useOrderInfoData = ({ order, shippingMethods }: UseOrderInfoDataProps) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('');

  const updateOrderNumber = useCallback(() => {
    const label = order?.orderNumber?.split('-').join(' ') ?? '';
    setOrderNumber(label);
  }, [order?.orderNumber]);

  const updateDeliveryMethod = useCallback(() => {
    const shippingMethod = shippingMethods?.find(
      (method) => method.shippingMethodId === order?.shippingInfo?.shippingMethodId,
    ) as ShippingMethod;

    setDeliveryMethod(shippingMethod.name ?? '');
  }, [order?.shippingInfo?.shippingMethodId, shippingMethods]);

  const updateShippingAddress = useCallback(() => {
    if (order?.shippingAddress) {
      const { streetName, city, postalCode } = order.shippingAddress;
      const label = `${streetName}, ${city}, ${postalCode}`;
      setShippingAddress(label);
    }
  }, [order?.shippingAddress]);

  const updatePaymentInfo = useCallback(() => {
    const payment = order?.payments?.[0];
    // const lastDigits = payment?.cardSummary;
    const lastDigits = undefined;
    const cardType = payment?.paymentMethod == 'mc' ? 'MASTERCARD' : 'VISA';
    const label = lastDigits ? `${cardType} **${lastDigits}` : cardType;
    setPaymentInfo(label);
  }, [order?.payments]);

  useEffect(() => {
    if (order) {
      updateOrderNumber();
      updateDeliveryMethod();
      updateShippingAddress();
      updatePaymentInfo();
    }
  }, [order, updateDeliveryMethod, updateOrderNumber, updatePaymentInfo, updateShippingAddress]);

  return {
    orderNumber,
    deliveryMethod,
    shippingAddress,
    paymentInfo,
  };
};

export default useOrderInfoData;
