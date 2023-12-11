import React, { useCallback } from 'react';
import { PaymentProvider } from './payment/types';

const CheckoutContext = React.createContext({});

const CheckoutProvider = ({ children }: React.PropsWithChildren) => {
  return <CheckoutContext.Provider value={{}}>{children}</CheckoutContext.Provider>;
};

export default CheckoutProvider;

export const useCheckout = () => {
  //Call `useContext` here with your implemented provider
  return {
    paymentData: { type: 'scheme' },
    paymentDataIsValid: true,
    processing: false,
    setProcessing: () => {},
    getPaymentMethods: useCallback(async () => [{ name: 'Credit Card', type: 'scheme', image: {} }], []),
    makePayment: async () => {},
    makeKlarnaPayment: async () => {},
    setPaymentData: () => {},
    handleThreeDS2Action: async () => {},
  } as unknown as PaymentProvider;
};
