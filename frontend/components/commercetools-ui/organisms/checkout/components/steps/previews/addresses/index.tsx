import React from 'react';
import { useCart } from 'frontastic';
import Preview from '../wrapper';

const AddressesPreview = () => {
  const { data } = useCart();

  const shippingAddress = data?.shippingAddress ?? {};
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
