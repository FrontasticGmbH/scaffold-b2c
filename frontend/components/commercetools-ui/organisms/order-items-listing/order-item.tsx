import { FC } from 'react';
import { useParams } from 'next/navigation';
import Image from 'components/commercetools-ui/atoms/image';
import Typography from 'components/commercetools-ui/atoms/typography';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { LineItem } from 'types/entity/cart';

type OrderItemProps = {
  lineItem: LineItem;
};

const OrderItem: FC<OrderItemProps> = ({ lineItem }) => {
  const { locale } = useParams();

  return (
    <div key={lineItem.lineItemId} className="flex justify-start border-b py-16">
      {lineItem.variant?.images?.[0] && (
        <div className="relative h-104 w-88 shrink-0">
          <Image fill src={lineItem.variant.images[0]} style={{ objectFit: 'contain' }} alt={lineItem.name} />
        </div>
      )}
      <div className="flex flex-col justify-center pl-16">
        <Typography className="uppercase text-primary">{lineItem?.name}</Typography>
        <Typography className="mt-8 font-medium text-primary">
          {CurrencyHelpers.formatForCurrency(lineItem?.price as number, locale)}
        </Typography>
        <Typography className="mt-8 text-primary">{`x ${lineItem?.count}`}</Typography>
      </div>
    </div>
  );
};

export default OrderItem;
