import React from 'react';
import { useParams } from 'next/navigation';
import { Money } from 'shared/types/product/Money';
import Typography from 'components/commercetools-ui/atoms/typography';
import { CurrencyHelpers } from 'helpers/currencyHelpers';

interface Props {
  discountedPrice?: Money;
  price?: Money;
}

const Prices: React.FC<Props> = ({ price, discountedPrice }) => {
  const { locale } = useParams();

  return (
    <>
      {discountedPrice ? (
        <div className="flex items-center gap-8">
          <Typography className="text-11 font-medium leading-loose text-accent-red md:text-14">
            {CurrencyHelpers.formatForCurrency(discountedPrice, locale)}
          </Typography>
          <Typography className="text-10 font-medium leading-loose text-gray-500 line-through md:text-12">
            {CurrencyHelpers.formatForCurrency(price ?? '', locale)}
          </Typography>
        </div>
      ) : (
        <Typography className="text-11 font-medium leading-loose text-primary-black md:text-14">
          {CurrencyHelpers.formatForCurrency(price ?? '', locale)}
        </Typography>
      )}
    </>
  );
};

export default Prices;
