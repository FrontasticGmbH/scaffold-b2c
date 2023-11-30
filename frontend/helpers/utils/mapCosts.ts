import { Cart } from 'shared/types/cart/Cart';
import { Order } from 'shared/types/cart/Order';
import { UseCartReturn } from 'frontastic/hooks/useCart/types';

type MapCosts = (props: {
  reference?: 'cart' | 'order';
  cart?: Cart;
  order?: Order;
  currency: string;
}) => UseCartReturn['transaction'];

const mapCosts: MapCosts = ({ reference = 'order', cart, order, currency }) => {
  const data = { ...(reference === 'cart' ? cart : order) } as Cart;

  if (!data?.lineItems?.length) {
    return {
      subtotal: { centAmount: 0, currencyCode: currency, fractionDigits: 2 },
      discount: { centAmount: 0, currencyCode: currency, fractionDigits: 2 },
      tax: { centAmount: 0, currencyCode: currency, fractionDigits: 2 },
      shipping: { centAmount: 0, currencyCode: currency, fractionDigits: 2 },
      total: { centAmount: 0, currencyCode: currency, fractionDigits: 2 },
    };
  }

  const currencyCode = data.sum?.currencyCode ?? currency;
  const fractionDigits = data.sum?.fractionDigits ?? 2;

  const totalAmount = data.sum?.centAmount as number;
  const subTotalAmount = data.lineItems.reduce(
    (acc, curr) => acc + (curr.price?.centAmount || 0) * (curr.count as number),
    0,
  );

  const discountedAmount = data.lineItems.reduce(
    (acc, curr) => acc + ((curr.price?.centAmount || 0) * (curr.count as number) - (curr.totalPrice?.centAmount || 0)),
    0,
  );

  const totalTax = totalAmount > 0 ? data.taxed?.amount.centAmount ?? 0 : 0;

  const totalShipping =
    totalAmount > 0
      ? data.shippingInfo?.price?.centAmount ?? data.availableShippingMethods?.[0]?.rates?.[0]?.price?.centAmount ?? 0
      : 0;

  const isEstimatedShipping = !data.shippingInfo?.price?.centAmount;

  return {
    subtotal: {
      centAmount: subTotalAmount,
      currencyCode,
      fractionDigits,
    },
    discount: {
      centAmount: discountedAmount,
      currencyCode,
      fractionDigits,
    },
    shipping: {
      centAmount: totalShipping,
      currencyCode,
      fractionDigits,
    },
    tax: {
      centAmount: totalTax,
      currencyCode,
      fractionDigits,
    },
    total: {
      centAmount: totalAmount + totalTax + (isEstimatedShipping ? totalShipping : 0),
      currencyCode,
      fractionDigits,
    },
  };
};

export default mapCosts;
