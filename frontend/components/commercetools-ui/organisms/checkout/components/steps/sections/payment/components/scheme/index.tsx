import React, { useCallback, useMemo } from 'react';
import Dropdown, { Option } from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import useResolveCCImage from 'components/commercetools-ui/organisms/checkout/hooks/useResolveCCImage';
import { useCheckout } from 'components/commercetools-ui/organisms/checkout/provider';
import { PaymentData, SchemeData } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';
import { useFormat } from 'helpers/hooks/useFormat';

const Scheme = () => {
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });

  const { paymentData, setPaymentData } = useCheckout();

  const resolveCCImage = useResolveCCImage();

  const expiryDateOptions = useMemo(() => {
    const now = new Date();

    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    const options = [] as Option[];

    while (year < now.getFullYear() + 10) {
      options.push({
        name: `${month < 10 ? '0' : ''}${month} / ${year.toString().slice(2)}`,
        value: `${month}/${year}`,
      });

      if (month == 12) (month = 1), (year += 1);
      else month += 1;
    }

    return options;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPaymentData({ ...paymentData, [e.target.name as keyof PaymentData]: e.target.value } as SchemeData);
    },
    [paymentData, setPaymentData],
  );

  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.replace(/(\d{4})(?=\d+)/g, '$1 ').trim();

      setPaymentData({ ...paymentData, number: e.target.value.replace(/\s/g, '') } as SchemeData);
    },
    [paymentData, setPaymentData],
  );

  const handleExpiryDateChange = useCallback(
    (option: Option) => {
      const date = option.value.toString();

      const [expiryMonth, expiryYear] = date.split('/');

      setPaymentData({ ...paymentData, expiryMonth, expiryYear } as SchemeData);
    },
    [paymentData, setPaymentData],
  );

  const handleCVCChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.slice(0, 4);

      setPaymentData({ ...paymentData, cvc: e.target.value } as SchemeData);
    },
    [paymentData, setPaymentData],
  );

  if (paymentData.type !== 'scheme') return <></>;

  return (
    <div className="pt-32 md:max-w-[436px] md:pl-36">
      <Input
        label={formatCheckoutMessage({ id: 'card.holder', defaultMessage: 'Card holder' })}
        labelPosition="top"
        name="holderName"
        className="text-14 placeholder:text-gray-600 sm:px-8"
        placeholder={formatCheckoutMessage({ id: 'card.holder', defaultMessage: 'Card holder' })}
        onChange={handleChange}
        defaultValue={paymentData.holderName}
      />
      <div className="relative mt-16">
        <Input
          label={formatCheckoutMessage({ id: 'card.number', defaultMessage: 'Card number' })}
          labelPosition="top"
          className="text-14 placeholder:text-gray-600 sm:px-8"
          placeholder={formatCheckoutMessage({ id: 'card.number', defaultMessage: 'Card number' })}
          onChange={handleCardNumberChange}
          isValid={!!(paymentData.number && paymentData.number.length >= 12 && paymentData.number.length <= 19)}
          defaultValue={paymentData.number}
        >
          {resolveCCImage(paymentData.number) && (
            // eslint-disable-next-line
            <img
              className="absolute right-8 top-1/2 w-32 -translate-y-1/2"
              src={resolveCCImage(paymentData.number)}
            />
          )}
        </Input>
      </div>
      <div className="mt-16 flex w-full gap-8">
        <div className="w-full grow md:flex-1">
          <Dropdown
            label={formatCheckoutMessage({ id: 'expiry.date', defaultMessage: 'Expiry date' })}
            selectOptions={expiryDateOptions}
            selectOnChange={handleExpiryDateChange}
            selectDefaultValue={
              paymentData.expiryMonth && paymentData.expiryYear
                ? {
                    name: `${+paymentData.expiryMonth < 10 ? '0' : ''}${
                      paymentData.expiryMonth
                    } / ${paymentData.expiryYear.slice(2)}`,
                    value: `${paymentData.expiryMonth}/${paymentData.expiryYear}`,
                  }
                : { name: 'MM / YY', value: 'MM/YY' }
            }
          />
        </div>
        <div className="relative grow md:flex-1">
          <Input
            label={formatCheckoutMessage({ id: 'card.securityNumber', defaultMessage: 'Security number' })}
            labelPosition="top"
            className="text-14 placeholder:text-gray-600 sm:px-8"
            type="number"
            placeholder={formatCheckoutMessage({ id: 'card.securityNumber', defaultMessage: 'Security number' })}
            onChange={handleCVCChange}
            defaultValue={paymentData.cvc}
          >
            {/* eslint-disable-next-line */}
            <img className="absolute right-8 top-1/2 w-[32px] -translate-y-1/2" src="/images/cvc.png" />
          </Input>
        </div>
      </div>
    </div>
  );
};

export default Scheme;
