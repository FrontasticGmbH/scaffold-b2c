import React from 'react';
import { Cart } from 'types/entity/cart';
import Preview from '../wrapper';

interface Props {
  cart?: Cart;
}

const AddressesPreview = ({ cart }: Props) => {
  const shippingAddress = cart?.shippingAddress ?? {};

  return (
    <Preview>
      <div className="border-neutral-400 lg:border lg:p-16">
        <p className="text-14 text-secondary-black">
          {`${shippingAddress.firstName} ${shippingAddress.lastName ?? ''}`}
          <span className="mt-8 block" />
          {shippingAddress.streetName}
          <span className="mt-8 block" />
          {shippingAddress.postalCode} {shippingAddress.city}
        </p>
      </div>
    </Preview>
  );
};

export default AddressesPreview;
