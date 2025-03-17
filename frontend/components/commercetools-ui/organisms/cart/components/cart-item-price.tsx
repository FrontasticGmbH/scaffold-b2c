import { FC } from 'react';
import { useParams } from 'next/navigation';
import { LineItem } from 'shared/types/cart';
import { useTranslations } from 'use-intl';
import Typography from 'components/commercetools-ui/atoms/typography';
import { CurrencyHelpers } from 'helpers/currencyHelpers';

const CartItemPrice: FC<{ item: LineItem }> = ({ item }) => {
  const { locale } = useParams();
  const translate = useTranslations();

  if (item.isGift) {
    return <Typography className="text-14 font-normal">{translate('cart.gift')}</Typography>;
  }

  return item.discountedPrice ? (
    <div className="flex items-center gap-5">
      <Typography className="text-14 font-medium leading-loose text-red-500">
        {CurrencyHelpers.formatForCurrency(item.discountedPrice?.value ?? 0, locale)}
      </Typography>
      <Typography className="text-12 font-normal leading-loose text-gray-500 line-through">
        {CurrencyHelpers.formatForCurrency(item.price ?? 0, locale)}
      </Typography>
    </div>
  ) : (
    <Typography className="text-14 font-medium leading-loose">
      {CurrencyHelpers.formatForCurrency(item.price ?? 0, locale)}
    </Typography>
  );
};

export default CartItemPrice;
