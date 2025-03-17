import React, { FC } from 'react';
import { Address } from 'shared/types/account';
import { Order } from 'shared/types/cart/Order';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import SummaryAccordion from 'components/commercetools-ui/organisms/order-summary/components/summary-accordion';

export interface Props {
  order: Order;
  shippingInfo: string;
  paymentInfo: string;
  shippingAddress: Address;
  orderState: string;
}

const OrderInfoSection: FC<Props> = ({ order, shippingInfo, paymentInfo, shippingAddress, orderState }) => {
  const translate = useTranslations();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-fit w-full rounded-none px-16 md:px-24 lg:rounded-md lg:border lg:p-44 2xl:w-3/5 2xl:px-36">
      <div className="mb-24 block w-full lg:hidden">
        <div className="h-1 w-full bg-neutral-400 px-24" />
      </div>

      <div className="flex 2xl:pl-0">
        <Typography className="whitespace-nowrap text-14 text-gray-600 md:text-16">
          {translate('orders.shipping-method')}
        </Typography>

        <Typography className="pl-8 text-14 font-medium text-primary md:pl-20 md:text-16 2xl:whitespace-nowrap 2xl:pl-44">
          {shippingInfo}
        </Typography>
      </div>

      <div className="mt-24 flex 2xl:pl-0">
        <Typography className="whitespace-nowrap text-14 text-gray-600 md:text-16">
          {translate('checkout.shippingAddress')}
        </Typography>

        <div className="pl-8 md:pl-20 2xl:pl-44">
          <Typography className="pb-8 text-14 font-medium text-primary md:text-16">
            {`${shippingAddress.firstName} ${shippingAddress.lastName}`}
          </Typography>
          <Typography className="text-14 text-primary md:text-16">
            {`${shippingAddress.streetName}, ${shippingAddress.city}, ${shippingAddress.postalCode}`}
          </Typography>
          {shippingAddress.additionalAddressInfo && (
            <Typography className="mt-8 text-14 text-primary md:text-16">
              {shippingAddress.additionalAddressInfo}
            </Typography>
          )}
        </div>
      </div>

      <div className="mt-32 flex 2xl:pl-0">
        <Typography className="whitespace-nowrap text-14 text-gray-600 md:text-16">
          {translate('orders.payment-method')}
        </Typography>

        <Typography className="pl-8 text-14 font-medium uppercase text-primary md:pl-20 md:text-16 2xl:pl-44">
          {paymentInfo}
        </Typography>
      </div>

      <SummaryAccordion className="my-24 border-b 2xl:hidden" order={order} />

      <div className="flex flex-col lg:mt-40 2xl:px-0">
        <div className="flex flex-col lg:grid lg:grid-cols-2 2xl:grid-cols-1 2xl:gap-y-16">
          <div className="lg:w-full lg:pr-10 2xl:w-276 2xl:pr-0">
            <Button variant="secondary" className="h-fit w-full" onClick={handlePrint}>
              <Typography className="text-center text-14 md:text-16">{translate('orders.print-invoice')}</Typography>
            </Button>
          </div>

          {orderState === 'Confirmed' && (
            <div className="mt-20 lg:mt-0 lg:w-full lg:pl-10 2xl:w-276 2xl:pl-0">
              <Button variant="secondary" className="h-fit w-full">
                <Typography className="text-center text-14 md:text-16">
                  {translate('orders.request-cancellation')}
                </Typography>
              </Button>
            </div>
          )}

          {orderState === 'Complete' && (
            <div className="mt-20 lg:mt-0 lg:w-full lg:pl-10 2xl:w-276 2xl:pl-0">
              <Button variant="secondary" className="h-fit w-full">
                <Typography className="text-center text-14 md:text-16">{translate('orders.create-return')}</Typography>
              </Button>
            </div>
          )}
        </div>

        <Typography className="mt-40 w-full text-center text-14 text-primary md:text-16 lg:text-left 2xl:text-left">
          {translate('orders.questions')}
        </Typography>

        <Link link={'?hash=support'} className="mt-16 flex cursor-pointer">
          <Typography className="w-full text-center text-14 font-medium text-primary hover:underline md:text-16 lg:text-left 2xl:text-left">
            {translate('orders.contact-support')}
          </Typography>
        </Link>
      </div>
    </div>
  );
};

export default OrderInfoSection;
