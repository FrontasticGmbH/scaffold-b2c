import React, { useCallback } from 'react';
import Input from 'components/commercetools-ui/atoms/input';
import { useCheckout } from 'components/commercetools-ui/organisms/checkout/provider';
import { KlarnaData, PaymentData } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';
import { useFormat } from 'helpers/hooks/useFormat';

const Klarna = () => {
  const { formatMessage } = useFormat({ name: 'common' });

  const { paymentData, setPaymentData } = useCheckout();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPaymentData({ ...paymentData, [e.target.name as keyof PaymentData]: e.target.value } as KlarnaData);
    },
    [paymentData, setPaymentData],
  );

  return (
    <div className="pt-24">
      <div className="flex items-center gap-8">
        <div className="flex-1">
          <Input
            name="shopperFirstName"
            className="sm:px-8"
            labelPosition="inline"
            placeholder={formatMessage({ id: 'firstName', defaultMessage: 'First name' })}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Input
            name="shopperLastName"
            className="sm:px-8"
            labelPosition="inline"
            placeholder={`${formatMessage({ id: 'lastName', defaultMessage: 'Last name' })} (${formatMessage({
              id: 'optional',
              defaultMessage: 'Optional',
            })})`}
            onChange={handleChange}
          />
        </div>
      </div>
      <Input
        name="shopperEmail"
        className="mt-16 sm:px-8"
        labelPosition="inline"
        placeholder={formatMessage({ id: 'email', defaultMessage: 'Email' })}
        type="email"
        onChange={handleChange}
      />
    </div>
  );
};

export default Klarna;
