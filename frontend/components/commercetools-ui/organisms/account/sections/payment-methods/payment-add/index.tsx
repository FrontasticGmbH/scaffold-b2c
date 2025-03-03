import React from 'react';
import { useRouter } from 'next/navigation';
import Button from 'components/commercetools-ui/atoms/button';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import Typography from 'components/commercetools-ui/atoms/typography';
import useResolveCCImage from 'components/commercetools-ui/organisms/checkout/hooks/useResolveCCImage';
import { useFormat } from 'helpers/hooks/useFormat';
import useAddPaymentMethods from '../helper-hooks/useAddPaymentMethod';
import usePaymentHelpers from '../helper-hooks/usePaymentHelpers';

const PaymentAdd = () => {
  const router = useRouter();
  const { formatMessage: formatPaymentMessage } = useFormat({ name: 'payment' });
  const resolveCCImage = useResolveCCImage();
  const { expiryDateMonthOptions, expiryDateYearOptions } = usePaymentHelpers();
  const paymentAddData = useAddPaymentMethods();

  return (
    <div className="ml-0 mt-20 lg:ml-44 lg:mt-40">
      <div className="mt-24 px-16 md:mt-0 md:px-24 lg:px-0">
        <Typography as="h2" className="text-primary md:text-22 lg:text-24">
          {formatPaymentMessage({
            id: 'add.card',
            defaultMessage: 'Add new card',
          })}
        </Typography>
      </div>

      <div className="mt-0 w-full px-16 py-0 md:px-24 lg:mt-36 lg:w-[65%] lg:rounded-md lg:border lg:px-24 lg:py-32">
        <div className="mt-24 md:w-375 lg:mt-0">
          <div className="relative">
            <Typography as="label" className="text-14 font-medium text-gray-600">
              {formatPaymentMessage({ id: 'card.number', defaultMessage: 'Card number *' })}
            </Typography>
            <Input
              value={paymentAddData.cardNumberFormatted}
              className="mt-8 sm:px-8"
              labelPosition="inline"
              type="text"
              onChange={paymentAddData.handleCardNumberChange}
              validation={paymentAddData.isCardNumber}
              errorMessage={formatPaymentMessage({
                id: 'card.number.error',
                defaultMessage: 'Please insert all 16 numbers',
              })}
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
              <Typography as="label" className="text-14 font-medium text-gray-600">
                {formatPaymentMessage({ id: 'expiration.date', defaultMessage: 'Expiration date *' })}
              </Typography>
              <div className="mt-8 flex grow items-center md:flex-1">
                <div className="mr-12">
                  <Dropdown
                    error={paymentAddData.dateError && paymentAddData.cardExpMonthDate.name === 'MM' ? true : false}
                    selectDefaultValue={paymentAddData.cardExpMonthDate}
                    selectOptions={expiryDateMonthOptions}
                    selectOnChange={paymentAddData.handleExpiryMonthDateChange}
                  />
                </div>
                /
                <div className="ml-12">
                  <Dropdown
                    error={paymentAddData.dateError && paymentAddData.cardExpYearDate.name === 'YY' ? true : false}
                    selectDefaultValue={paymentAddData.cardExpYearDate}
                    selectOptions={expiryDateYearOptions}
                    selectOnChange={paymentAddData.handleExpiryYearDateChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {paymentAddData.dateError && (
            <Typography as="label" className="text-12 font-medium text-red-500">
              {formatPaymentMessage({ id: paymentAddData.dateError, defaultMessage: paymentAddData.dateError })}
            </Typography>
          )}
        </div>
        <div className="mt-32 flex">
          <Button variant="secondary" className="w-112" onClick={() => router.push('/account#payment')}>
            <Typography as="h2" className="text-center text-14 text-primary">
              {formatPaymentMessage({
                id: 'cancel',
                defaultMessage: 'Cancel',
              })}
            </Typography>
          </Button>

          <Button variant="primary" className="ml-12 w-112" onClick={paymentAddData.handleAddClick}>
            <Typography as="h2" className="text-center text-14">
              {formatPaymentMessage({
                id: 'save',
                defaultMessage: 'Save',
              })}
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentAdd;
