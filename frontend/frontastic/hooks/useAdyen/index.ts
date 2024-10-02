import { useCallback } from 'react';
import {
  PaymentResponse,
  PaymentRequestPayload,
  KlarnaPaymentRequestPayload,
  PaymentProviderMethod,
} from 'components/commercetools-ui/organisms/checkout/provider/payment/types';
import { sdk } from 'sdk';

const useAdyen = () => {
  const getPaymentMethods = useCallback(async () => {
    const response = await sdk.callAction({
      actionName: 'adyen/getPaymentMethods',
    });

    return response.isError ? [] : (response.data as PaymentProviderMethod[]);
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
