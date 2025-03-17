import React, { useCallback } from 'react';
import { useTranslations } from 'use-intl';
import Input from 'components/commercetools-ui/atoms/input';
import { useCheckout } from 'components/commercetools-ui/organisms/checkout/provider';
import { KlarnaData, PaymentData } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';

const Klarna = () => {
  const translate = useTranslations();

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
            placeholder={translate('common.firstName')}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Input
            name="shopperLastName"
            className="sm:px-8"
            labelPosition="inline"
            placeholder={`${translate('common.lastName')} (${translate('common.optional')})`}
            onChange={handleChange}
          />
        </div>
      </div>
      <Input
        name="shopperEmail"
        className="mt-16 sm:px-8"
        labelPosition="inline"
        placeholder={translate('common.email')}
        type="email"
        onChange={handleChange}
      />
    </div>
  );
};

export default Klarna;
