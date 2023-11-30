import { FC } from 'react';
import { useParams } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import { LineItem } from 'shared/types/cart/LineItem';
import Typography from 'components/commercetools-ui/atoms/typography';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import Image from 'frontastic/lib/image';

const OrderLineItem: FC<LineItem> = ({ name, price, count, variant }) => {
  const { locale } = useParams();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-16 py-16 md:gap-32">
        <div className="relative h-[104px] w-[89px] shrink-0">
          {variant?.images?.[0] ? (
            <Image fill src={variant?.images?.[0]} style={{ objectFit: 'contain' }} alt={variant?.sku ?? ''} />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
        <div className="mt-10 grow overflow-hidden">
          <Typography asSkeleton={!name} className="block max-w-[100%] truncate text-12 capitalize md:text-14">
            {name ?? 'product name'}
          </Typography>
          <Typography asSkeleton={!name} className="mt-8 block text-12 font-medium md:hidden lg:block lg:text-14">
            {CurrencyHelpers.formatForCurrency(price ?? 111, locale)}
          </Typography>
          <Typography asSkeleton={!name} className="mt-12 text-14 text-secondary-black">
            {'x ' + (count ?? '2')}
          </Typography>
        </div>
      </div>
      <Typography asSkeleton={!name} className="mt-8 hidden font-medium md:block lg:hidden">
        {CurrencyHelpers.formatForCurrency(price ?? 111, locale)}
      </Typography>
    </div>
  );
};

export default OrderLineItem;
