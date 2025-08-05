import React from 'react';
import { useTranslations } from 'next-intl';
import { Cart } from 'types/entity/cart';
import Skeleton from 'components/commercetools-ui/atoms/skeleton';

interface Props {
  cart?: Cart;
}

const AddressesPreview = ({ cart }: Props) => {
  const translate = useTranslations();

  if (!cart?.shippingAddress || !cart?.billingAddress) {
    return (
      <div className="relative h-200 w-full">
        <Skeleton />
      </div>
    );
  }

  const { shippingAddress, billingAddress } = cart;

  return (
    <div className="flex flex-col gap-32 rounded-md border border-neutral-400 p-20 md:flex-row md:items-start md:gap-64 lg:p-24">
      <div className="md:flex-1">
        <span className="text-14 font-semibold uppercase text-gray-700">{translate('checkout.shipping-address')}</span>
        <p className="pt-8 text-14 text-gray-600">
          {`${shippingAddress.firstName} ${shippingAddress.lastName ?? ''}`}
          <span className="mt-8 block" />
          {`${shippingAddress.streetName} ${shippingAddress.streetNumber ?? ''}, ${shippingAddress.apartment ?? ''}`}
          <span className="mt-8 block" />
          {`${shippingAddress.postalCode} ${shippingAddress.city}, ${shippingAddress.country}`}
        </p>
      </div>

      <div className="md:flex-1">
        <span className="text-14 font-semibold uppercase text-gray-700">{translate('checkout.billingAddress')}</span>
        <p className="pt-8 text-14 text-gray-600">
          {`${billingAddress.firstName} ${billingAddress.lastName ?? ''}`}
          <span className="mt-8 block" />
          {`${billingAddress.streetName} ${billingAddress.streetNumber ?? ''}, ${billingAddress.apartment ?? ''}`}
          <span className="mt-8 block" />
          {`${billingAddress.postalCode} ${billingAddress.city}, ${billingAddress.country}`}
          <span className="mt-8 block" />
        </p>
      </div>
    </div>
  );
};

export default AddressesPreview;
