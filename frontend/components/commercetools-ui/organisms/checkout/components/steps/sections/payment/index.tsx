import React, { useCallback, useEffect, useState, type JSX } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Radio from 'components/commercetools-ui/atoms/radio';
import { useCheckout } from 'components/commercetools-ui/organisms/checkout/provider';
import {
  PaymentProviderMethod,
  PaymentMethodType,
  PaymentData,
} from 'components/commercetools-ui/organisms/checkout/provider/payment/types';
import Klarna from './components/klarna';
import Scheme from './components/scheme';

interface Props {
  goToNextStep: () => void;
}

const Payment: React.FC<Props> = ({ goToNextStep }) => {
  const translate = useTranslations();

  const { getPaymentMethods, setPaymentData, paymentData, paymentDataIsValid } = useCheckout();

  const [paymentMethods, setPaymentMethods] = useState<PaymentProviderMethod[]>([]);

  const [selectedType, setSelectedType] = useState<PaymentMethodType>('scheme');

  const fetchPaymentMethods = useCallback(async () => {
    const paymentMethods = await getPaymentMethods();
    setPaymentMethods(paymentMethods);
  }, [getPaymentMethods]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const submit = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const getComponent = useCallback((type: PaymentMethodType) => {
    return (
      (
        {
          scheme: <Scheme />,
          klarna_paynow: <Klarna />,
        } as Record<PaymentMethodType, JSX.Element>
      )[type] ?? <></>
    );
  }, []);

  const handlePaymentMethodSelection = useCallback(
    (type: PaymentMethodType) => {
      setSelectedType(type);
      setPaymentData({ ...paymentData, type } as PaymentData);
    },
    [setPaymentData, paymentData],
  );

  return (
    <div>
      <div className="mt-24 border-x border-t border-neutral-400 bg-white lg:mt-0">
        {paymentMethods.map(({ name, type, image }) => (
          <div
            key={type}
            className="cursor-pointer border-b border-neutral-400 p-16 lg:px-20 lg:py-28"
            onClick={() => handlePaymentMethodSelection(type)}
          >
            <div className="flex items-center justify-between lg:justify-start lg:gap-64">
              <div>
                <div className="flex items-center gap-16">
                  <Radio name="checkout-shipping-method" checked={type === selectedType} />
                  <p className="text-14 font-medium">{name}</p>
                </div>
              </div>
              {/* eslint-disable-next-line */}
              <img src={image.src} className="h-[20px] lg:h-[24px]" />
            </div>
            {type === selectedType && getComponent(type)}
          </div>
        ))}
      </div>
      <div className="mt-24">
        <Button
          variant="primary"
          className="w-full min-w-200 md:text-16 lg:w-fit lg:px-36"
          type="submit"
          onClick={submit}
          disabled={!paymentDataIsValid}
        >
          {translate('cart.review-order')}
        </Button>
      </div>
    </div>
  );
};

export default Payment;
