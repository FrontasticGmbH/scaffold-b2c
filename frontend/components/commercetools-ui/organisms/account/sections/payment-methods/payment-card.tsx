import React, { FC } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import useResolveCCImage from 'components/commercetools-ui/organisms/checkout/hooks/useResolveCCImage';
import { useRouter } from 'i18n/routing';
import { Payment } from '.';

interface Props {
  payment: Payment;
}

const PaymentCard: FC<Props> = ({ payment }) => {
  const translate = useTranslations();
  const router = useRouter();
  const resolveCCImage = useResolveCCImage();

  const goToEdit = (payment: Payment) => {
    router.push(`?hash=payment&id=edit-${payment.id}`);
  };
  return (
    <div className="mt-16 flex items-center justify-between rounded-md border px-16 py-12 lg:p-24">
      <div className="flex items-center">
        {/* eslint-disable-next-line */}
        <img className="h-fit w-[32px]" src={resolveCCImage(payment.cardNumber)} />
        <p className="ml-16 text-14 text-primary">
          {`...${payment.cardNumber.substring(payment.cardNumber.length - 4, payment.cardNumber.length)} ${
            payment.cardExpiryMonth.name
          }/${payment.cardExpiryYear.name}`}
        </p>
      </div>
      <Button variant="ghost" onClick={() => goToEdit(payment)} className="py-0 text-primary hover:underline">
        <span className="hidden text-14 text-primary md:block">{translate('payment.edit')}</span>
      </Button>

      <Button
        variant="ghost"
        size="fit"
        onClick={() => goToEdit(payment)}
        className="rounded-full bg-neutral-200 p-12 md:hidden"
      >
        <PencilSquareIcon className="w-20" />
      </Button>
    </div>
  );
};

export default PaymentCard;
