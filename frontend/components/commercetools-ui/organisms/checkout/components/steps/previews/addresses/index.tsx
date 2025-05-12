import React from 'react';
import { useTranslations } from 'next-intl';
import { Cart } from 'types/entity/cart';

interface Props {
  cart?: Cart;
}

const AddressesPreview = ({ cart }: Props) => {
  const translate = useTranslations();

  const shippingAddress = cart?.shippingAddress ?? {};
  const billingAddress = cart?.billingAddress ?? {};

  return (
    <div className="flex flex-col gap-32 rounded-md border border-neutral-400 p-20 md:flex-row md:items-start md:gap-64 lg:p-24">
      <div className="md:flex-1">
        <span className="text-14 font-semibold uppercase text-gray-700">{translate('checkout.deliveryAddress')}</span>
        <p className="pt-8 text-14 text-gray-600">
          {`${shippingAddress.firstName} ${shippingAddress.lastName ?? ''}`}
          <span className="mt-8 block" />
          {shippingAddress.streetName}
          <span className="mt-8 block" />
          {shippingAddress.postalCode} {shippingAddress.city}
          <span className="mt-8 block" />
          {shippingAddress.country}
        </p>
      </div>

      <div className="md:flex-1">
        <span className="text-14 font-semibold uppercase text-gray-700">{translate('checkout.billingAddress')}</span>
        <p className="pt-8 text-14 text-gray-600">
          {`${billingAddress.firstName} ${billingAddress.lastName ?? ''}`}
          <span className="mt-8 block" />
          {billingAddress.streetName}
          <span className="mt-8 block" />
          {billingAddress.postalCode} {billingAddress.city}
          <span className="mt-8 block" />
          {billingAddress.country}
        </p>
      </div>
    </div>
  );
};

export default AddressesPreview;
