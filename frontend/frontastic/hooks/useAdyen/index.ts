import { useCallback } from 'react';
import { sdk } from 'sdk';
import {
  PaymentMethod,
  PaymentResponse,
  PaymentRequestPayload,
  KlarnaPaymentRequestPayload,
} from 'components/commercetools-ui/organisms/checkout/provider/payment/types';

const useAdyen = () => {
  const getPaymentMethods = useCallback(async () => {
    const response = await sdk.callAction({
      actionName: 'adyen/getPaymentMethods',
    });

    return response.isError ? [] : (response.data as PaymentMethod[]);
  }, []);

  const makePayment = useCallback(async (data: PaymentRequestPayload | KlarnaPaymentRequestPayload) => {
    const response = await sdk.callAction({
      actionName: 'adyen/makePayment',
      payload: data,
    });

    return (response.isError ? {} : response.data) as PaymentResponse;
  }, []);

  const paymentDetails = useCallback(async (data: Record<string, string>) => {
    const response = await sdk.callAction({
      actionName: 'adyen/paymentDetails',
      payload: data,
    });

    return (response.isError ? {} : response.data) as PaymentResponse;
  }, []);

  return { getPaymentMethods, makePayment, paymentDetails };
};

export default useAdyen;
