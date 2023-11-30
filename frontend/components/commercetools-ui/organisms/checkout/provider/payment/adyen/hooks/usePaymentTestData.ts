import { useMemo } from 'react';
import { PaymentData } from '../../types';

const usePaymentTestData = () => {
  const data = useMemo(
    () =>
      ({
        holderName: 'Joe Wheeler',
        number: '4917 6100 0000 0000',
        expiryMonth: '3',
        expiryYear: '2030',
        cvc: '737',
      } as PaymentData),
    [],
  );

  return data;
};

export default usePaymentTestData;
