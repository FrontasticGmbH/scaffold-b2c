import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Radio from 'components/commercetools-ui/atoms/radio';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useProcessing from 'helpers/hooks/useProcessing';
import { StringHelpers } from 'helpers/stringHelpers';
import { useCart } from 'frontastic';

export interface Props {
  goToNextStep: () => void;
}

const Shipping: React.FC<Props> = ({ goToNextStep }) => {
  const translate = useTranslations();

  const { locale } = useParams();

  const { data, setShippingMethod } = useCart();

  const [selectedId, setSelectedId] = useState('');

  const shippingMethods = useMemo(() => data?.availableShippingMethods ?? [], [data?.availableShippingMethods]);

  useEffect(() => {
    if (!selectedId && shippingMethods?.[0]) setSelectedId(shippingMethods[0].shippingMethodId);
  }, [shippingMethods, selectedId]);

  const { processing, startProcessing, stopProcessing } = useProcessing();

  const submit = useCallback(async () => {
    if (!selectedId || processing) return;

    startProcessing();

    await setShippingMethod(selectedId);

    stopProcessing();
    goToNextStep();
  }, [goToNextStep, setShippingMethod, selectedId, processing, startProcessing, stopProcessing]);

  return (
    <div>
      <div className="bg-white">
        {shippingMethods.map((shippingMethod) => (
          <button
            key={shippingMethod.shippingMethodId}
            className="mb-12 flex w-full items-center justify-between rounded-md border border-gray-300 px-20 py-16 focus:border-transparent focus:ring-2 focus:ring-gray-500"
            onClick={() => setSelectedId(shippingMethod.shippingMethodId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedId(shippingMethod.shippingMethodId);
              }
            }}
            tabIndex={0}
          >
            <div className="flex items-center gap-16">
              <Radio
                id={StringHelpers.convertToKebabCase(shippingMethod.name)}
                name="checkout-shipping-method"
                checked={shippingMethod.shippingMethodId === selectedId}
              />
              <div>
                <label htmlFor={StringHelpers.convertToKebabCase(shippingMethod.name)} className="text-14 font-medium">
                  {shippingMethod.name}
                </label>
                <p className="mt-4 text-14 text-gray-600">{shippingMethod.description}</p>
              </div>
            </div>

            <span className="text-14 font-medium">
              {CurrencyHelpers.formatForCurrency(shippingMethod.rates?.[0]?.price ?? {}, locale)}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-24 flex justify-end">
        <Button
          variant="primary"
          className="w-full min-w-200 md:text-16 lg:w-fit lg:px-36"
          loading={processing}
          type="submit"
          onClick={submit}
        >
          {translate('cart.continue-to')} {translate('cart.payment')}
        </Button>
      </div>
    </div>
  );
};

export default Shipping;
