import React from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import useResolveCCImage from 'components/commercetools-ui/organisms/checkout/hooks/useResolveCCImage';
import { useRouter } from 'i18n/routing';
import useAddPaymentMethods from '../helper-hooks/useAddPaymentMethod';
import usePaymentHelpers from '../helper-hooks/usePaymentHelpers';

const PaymentAdd = () => {
  const router = useRouter();
  const translate = useTranslations();
  const resolveCCImage = useResolveCCImage();
  const { expiryDateMonthOptions, expiryDateYearOptions } = usePaymentHelpers();
  const paymentAddData = useAddPaymentMethods();

  return (
    <div className="ml-0 mt-20 lg:ml-44 lg:mt-40">
      <div className="mt-24 px-16 md:mt-0 md:px-24 lg:px-0">
        <h2 className="text-primary md:text-22 lg:text-24">{translate('payment.add-card')}</h2>
      </div>

      <div className="mt-0 w-full px-16 py-0 md:px-24 lg:mt-36 lg:w-[65%] lg:rounded-md lg:border lg:px-24 lg:py-32">
        <div className="mt-24 md:w-375 lg:mt-0">
          <div className="relative">
            <label className="text-14 font-medium text-gray-600">{translate('payment.card-number')}</label>
            <Input
              value={paymentAddData.cardNumberFormatted}
              className="mt-8 sm:px-8"
              labelPosition="inline"
              type="text"
              onChange={paymentAddData.handleCardNumberChange}
              errorMessage={translate('payment.card-number-error')}
            />
            {resolveCCImage(paymentAddData.cardNumberFormatted) && (
              // eslint-disable-next-line
              <img
                className="absolute right-8 top-52 w-32 -translate-y-1/2"
                src={resolveCCImage(paymentAddData.cardNumberFormatted)}
              />
            )}
          </div>

          <div className="mt-24 w-full flex-col gap-8 md:max-w-[436px] lg:mt-12 lg:flex lg:flex-row">
            <div className="w-full lg:w-3/5">
              <label className="text-14 font-medium text-gray-600">{translate('payment.expiration-date')}</label>
              <div className="mt-8 flex grow items-center md:flex-1">
                <div className="mr-12">
                  <Dropdown
                    error={!!(paymentAddData.dateError && paymentAddData.cardExpMonthDate.name === 'MM')}
                    selectDefaultValue={paymentAddData.cardExpMonthDate}
                    selectOptions={expiryDateMonthOptions}
                    selectOnChange={paymentAddData.handleExpiryMonthDateChange}
                  />
                  {/* eslint-disable-next-line react/jsx-no-literals */}
                </div>
                /
                <div className="ml-12">
                  <Dropdown
                    error={!!(paymentAddData.dateError && paymentAddData.cardExpYearDate.name === 'YY')}
                    selectDefaultValue={paymentAddData.cardExpYearDate}
                    selectOptions={expiryDateYearOptions}
                    selectOnChange={paymentAddData.handleExpiryYearDateChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {paymentAddData.dateError && (
            <label className="text-12 font-medium text-red-500">
              {
                // @ts-ignore
                translate('payment.' + paymentAddData.dateError)
              }
            </label>
          )}
        </div>
        <div className="mt-32 flex">
          <Button variant="secondary" className="w-112" onClick={() => router.push('/account#payment')}>
            <span className="text-center text-14 text-primary">{translate('payment.cancel')}</span>
          </Button>

          <Button variant="primary" className="ml-12 w-112" onClick={paymentAddData.handleAddClick}>
            <span className="text-center text-14">{translate('payment.save')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentAdd;
