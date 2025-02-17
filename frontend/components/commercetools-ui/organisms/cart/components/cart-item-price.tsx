import { FC } from 'react';
import { useParams } from 'next/navigation';
import { LineItem } from 'shared/types/cart';
import Typography from 'components/commercetools-ui/atoms/typography';
import { CurrencyHelpers } from 'helpers/currencyHelpers';

const CartItemPrice: FC<{ item: LineItem }> = ({ item }) => {
  const { locale } = useParams();

  if (item.isGift) {
    return (
      <Typography translation={{ id: 'gift', file: 'cart' }} className="text-14 font-normal">
        Gift
      </Typography>
    );
  }

  return item.discountedPrice ? (
    <div className="flex items-center gap-5">
      <Typography className="text-14 font-medium leading-loose text-accent-red">
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
