import { useState } from 'react';
import { useParams } from 'next/navigation';
import { TruckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ShippingMethod } from 'shared/types/cart/ShippingMethod';
import Input from 'components/commercetools-ui/atoms/input';
import Typography from 'components/commercetools-ui/atoms/typography';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import { clearSpaces, getEstimationPhrase } from '../helpers';

type Error = {
  message: string;
  shippingMethodId: ShippingMethod['shippingMethodId'];
};

const ShippingSection = () => {
  const { locale } = useParams();
  const { shippingMethods } = useCart();
  const { formatMessage } = useFormat({ name: 'cart' });

  const [input, setInput] = useState<string>('');
  const [configured, setConfigured] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [usedPostCode, setUsedPostCode] = useState<string>();
  const [toggledSectionId, setToggledSectionId] = useState<ShippingMethod['shippingMethodId']>();

  const collapseShippingSections = () => {
    setToggledSectionId(undefined);
  };

  const updateToggledSectionId = (shippingMethodId: ShippingMethod['shippingMethodId']) => {
    if (usedPostCode) setInput(usedPostCode);
    setToggledSectionId(shippingMethodId);
  };

  const handleInput = (e: React.FormEvent) => {
    const displayedValue = (e.target as HTMLInputElement).value;
    let value = clearSpaces(displayedValue);

    if (value.length > 3) {
      value = `${value.slice(0, 3)} ${value.slice(3, value.length)}`;
    }

    setInput(value);
    if (error?.message.length) setError(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input.length < 6)
      setError({
        shippingMethodId: toggledSectionId ?? '',
        message: formatMessage({ id: 'postcode.invalid', defaultMessage: 'The postcode is not valid.' }),
      });
    else {
      setUsedPostCode(input);
      collapseShippingSections();
      setConfigured(true);
    }
  };

  const getRateToUse = (rates: ShippingMethod['rates']) => {
    const DEFAULT_SHIPPING_RATE_ID =
      locale == 'en' ? 'f51d093a-07a4-43ac-90a2-ae072a4aabf5' : '34717e18-4b4d-41f9-af68-158142015ea3';
    return rates?.find(({ shippingRateId }) => shippingRateId === DEFAULT_SHIPPING_RATE_ID);
  };

  return (
    <>
      <div className="mt-28 grid border border-neutral-400">
        {shippingMethods.data?.map(({ shippingMethodId, name, description, rates }) => (
          <div
            key={shippingMethodId}
            className="relative flex gap-24 border-b border-neutral-400 px-17 py-11 last:border-b-0 md:gap-12 lg:gap-24"
          >
            <div className="grid h-full items-center">
              <TruckIcon className="h-24 w-24 rounded-full border border-neutral-400 p-4" />
            </div>
            <div className="grid">
              <Typography
                className="text-14 font-medium leading-loose text-primary-black hover:cursor-pointer"
                onClick={() => updateToggledSectionId(shippingMethodId)}
              >
                {name}
              </Typography>
              {toggledSectionId === shippingMethodId ? (
                // Input Form
                <form onSubmit={handleSubmit}>
                  <Input
                    label="Enter postcode"
                    onChange={handleInput}
                    value={input}
                    autoFocus
                    error={error?.shippingMethodId == shippingMethodId ? error?.message : ''}
                  />
                  <XMarkIcon
                    className="absolute right-18 top-18 h-20 w-20 stroke-neutral-800 hover:cursor-pointer"
                    onClick={collapseShippingSections}
                  />
                </form>
              ) : configured ? (
                <div
                  onClick={() => updateToggledSectionId(shippingMethodId)}
                  className="flex gap-4 hover:cursor-pointer"
                >
                  <Typography className="text-14 leading-loose text-secondary-black">
                    {getEstimationPhrase(Number(description))}
                  </Typography>
                  <Typography className="text-14 leading-loose text-secondary-black underline hover:cursor-pointer">
                    {usedPostCode}
                  </Typography>
                </div>
              ) : (
                <Typography
                  className="text-14 leading-loose text-secondary-black underline hover:cursor-pointer"
                  onClick={() => updateToggledSectionId(shippingMethodId)}
                >
                  {formatMessage({ id: 'add.postcode', defaultMessage: 'Add postcode for availability' })}
                </Typography>
              )}
            </div>
            {configured && (
              <Typography className="ml-auto flex items-center text-14 font-medium leading-loose text-primary-black">
                {CurrencyHelpers.formatForCurrency(getRateToUse(rates)?.price ?? 0, locale)}
              </Typography>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ShippingSection;
