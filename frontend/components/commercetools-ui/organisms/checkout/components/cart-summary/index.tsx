import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'components/commercetools-ui/atoms/image';
import Costs from 'components/commercetools-ui/organisms/order-payment-section/components/costs';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useRouter } from 'i18n/routing';
import { useCart } from 'frontastic';

const CartSummary = () => {
  const router = useRouter();

  const { locale } = useParams();

  const { data } = useCart();

  return (
    <div>
      <div className="divide-y divide-neutral-400 px-16 md:px-24">
        {data?.lineItems?.map((lineItem) => (
          <div
            key={lineItem.lineItemId}
            className="flex cursor-pointer items-center justify-between"
            onClick={() => router.push(lineItem._url ?? '')}
          >
            <div className="flex items-start gap-16 py-16 md:gap-32">
              <div className="relative h-104 w-89 shrink-0">
                <Image fill src={lineItem.variant?.images?.[0]} style={{ objectFit: 'contain' }} />
              </div>
              <div className="mt-10 grow overflow-hidden">
                <span className="block max-w-full truncate text-12 capitalize md:text-14">{lineItem.name}</span>
                <span className="mt-8 block text-12 font-medium md:hidden">
                  {CurrencyHelpers.formatForCurrency(lineItem.price ?? {}, locale)}
                </span>
                {/* eslint-disable-next-line react/jsx-no-literals */}
                <span className="mt-12 block text-14 text-gray-600">x {lineItem.count}</span>
              </div>
            </div>
            <span className="mt-8 hidden text-16 font-medium md:block">
              {CurrencyHelpers.formatForCurrency(lineItem.price ?? {}, locale)}
            </span>
          </div>
        ))}
      </div>
      <Costs
        className="mt-16 border-b border-neutral-400 bg-neutral-200 p-16 pb-24 md:text-16"
        subCostClassName="text-14"
        totalAmountClassName="text-16"
      />
    </div>
  );
};

export default CartSummary;
