import React, { useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useCart } from 'frontastic';
import Preview from '../wrapper';

const ShippingPreview = () => {
  const { locale } = useParams();

  const { data, shippingMethods } = useCart();

  const shippingMethod = useMemo(() => {
    if (!data?.shippingInfo) return;

    const method = shippingMethods?.data?.find((m) => m.shippingMethodId === data.shippingInfo?.shippingMethodId);

    return {
      name: method?.name ?? '',
      price: data?.shippingInfo.price,
      description: method?.description,
    };
  }, [data, shippingMethods?.data]);

  const getEstimatedDate = useCallback((days: number) => {
    if (isNaN(days)) return '';

    const date = new Date(Date.now());

    date.setDate(date.getDate() + days);

    return date.toLocaleDateString().replace(/\//g, '-');
  }, []);

  return (
    <Preview>
      <div className="flex items-center justify-between border border-neutral-400 p-16">
        <div>
          <p className="text-14 font-medium">{shippingMethod?.name}</p>
          <p className="mt-4 text-14 text-secondary-black">
            Est: {getEstimatedDate(+(shippingMethod?.description ?? 0))}
          </p>
        </div>

        <span className="text-14 font-medium">
          {CurrencyHelpers.formatForCurrency(shippingMethod?.price ?? {}, locale)}
        </span>
      </div>
    </Preview>
  );
};

export default ShippingPreview;
