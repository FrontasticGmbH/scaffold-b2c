import React, { FC } from 'react';
import { useTranslations } from 'use-intl';
interface Props {
  orderNumber: string;
}

const OrderNumber: FC<Props> = ({ orderNumber }) => {
  const translate = useTranslations();

  return (
    <>
      <div className="mt-16 pb-12 md:mt-0">
        <h2 className="mt-20 pl-16 text-18 text-primary md:mt-0 md:pl-24 md:text-22 lg:pl-44 lg:text-24">
          {translate('orders.order-details')}
        </h2>
      </div>

      <div className="mt-8 flex flex-row pl-16 md:mt-12 md:px-0 md:pl-24 lg:mt-24 lg:pl-44">
        <h2 className="whitespace-nowrap text-14 text-gray-600 md:text-16">{translate('orders.order-number')}</h2>
        <h2 className="ml-8 whitespace-nowrap text-14 font-medium text-primary md:text-16">
          {orderNumber.replaceAll('-', ' ')}
        </h2>
      </div>
    </>
  );
};

export default OrderNumber;
