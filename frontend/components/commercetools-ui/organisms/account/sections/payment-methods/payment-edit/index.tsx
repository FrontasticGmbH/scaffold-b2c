import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import Button from 'components/commercetools-ui/atoms/button';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Input from 'components/commercetools-ui/atoms/input';
import Typography from 'components/commercetools-ui/atoms/typography';
import useResolveCCImage from 'components/commercetools-ui/organisms/checkout/hooks/useResolveCCImage';
import { useFormat } from 'helpers/hooks/useFormat';
import useHash from 'helpers/hooks/useHash';
import useEditPaymentMethods from '../helper-hooks/useEditPaymentMethod';
import useCardNumberFormatter from '../helper-hooks/useFormatCredit';
import usePaymentHelpers from '../helper-hooks/usePaymentHelpers';
import PaymentDelete from '../payment-delete';

const PaymentEdit = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, hashId] = useHash();
  const router = useRouter();

  const id = hashId?.split('-')[1];

  const { formatMessage: formatPaymentMessage } = useFormat({ name: 'payment' });
  const paymentEditData = useEditPaymentMethods(id as string);

  const { expiryDateMonthOptions, expiryDateYearOptions } = usePaymentHelpers();

  const cardNumberFormatted = useCardNumberFormatter(paymentEditData.cardNumber ?? '');

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const resolveCCImage = useResolveCCImage();

  return (
    <div className="ml-0 md:ml-24 lg:ml-44">
      <div className="ml-16 mt-24 lg:ml-0 lg:mt-40">
        <Typography as="h2" className="text-18 text-primary md:text-22 lg:text-24">
          {formatPaymentMessage({
            id: 'edit.payment',
            defaultMessage: 'Edit payment method',
          })}
        </Typography>
      </div>

      <PaymentDelete
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        handleCancelClick={closeModal}
        handleDeleteClick={paymentEditData.handleDeleteClick}
      />

      <div className="mt-0 w-full px-16 py-0 lg:mt-36 lg:w-[65%] lg:rounded-md lg:border lg:px-24 lg:py-32">
        <div className="mt-24 md:max-w-[436px] lg:mt-0">
          <div className="relative">
            <Typography as="label" className="text-14 font-medium text-gray-600">
              {formatPaymentMessage({ id: 'card.number', defaultMessage: 'Card number *' })}
            </Typography>
            <Input
              value={cardNumberFormatted}
              className="mt-8 sm:px-8"
              labelPosition="inline"
              type="text"
              onChange={paymentEditData.handleCardNumberChange}
              validation={paymentEditData.isCardNumber}
              errorMessage={formatPaymentMessage({
                id: 'card.number.error',
                defaultMessage: 'Please insert all 16 numbers',
              })}
            />
            {resolveCCImage(cardNumberFormatted) && (
              // eslint-disable-next-line
              <img
                className="absolute right-8 top-52 w-32 -translate-y-1/2"
                src={resolveCCImage(cardNumberFormatted)}
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
                    selectDefaultValue={paymentEditData.cardExpMonthDate}
                    selectOptions={expiryDateMonthOptions.slice(1)}
                    selectOnChange={paymentEditData.handleExpiryDateMonthChange}
                  />
                </div>
                /
                <div className="ml-12">
                  <Dropdown
                    selectDefaultValue={paymentEditData.cardExpYearDate}
                    selectOptions={expiryDateYearOptions.slice(1)}
                    selectOnChange={paymentEditData.handleExpiryDateYearChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 flex-col justify-start lg:mt-32 lg:flex lg:max-w-[436px] lg:flex-row lg:justify-between">
          <Button variant="ghost" size="fit" className="flex items-center px-0" onClick={() => setModalIsOpen(true)}>
            <TrashIcon className="w-20 text-gray-600" />
            <Typography as="h2" className="ml-8 text-center text-14 font-normal text-gray-600">
              {formatPaymentMessage({
                id: 'delete',
                defaultMessage: 'Delete',
              })}
            </Typography>
          </Button>

          <div className="mt-32 flex lg:mt-0">
            <Button variant="secondary" className="ml-0 w-112 lg:ml-64" onClick={() => router.push('/account#payment')}>
              <Typography as="h2" className="text-center text-14 text-primary">
                {formatPaymentMessage({
                  id: 'cancel',
                  defaultMessage: 'Cancel',
                })}
              </Typography>
            </Button>

            <Button variant="primary" className="ml-12 w-112" onClick={paymentEditData.handleSaveClick}>
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
    </div>
  );
};

export default PaymentEdit;
