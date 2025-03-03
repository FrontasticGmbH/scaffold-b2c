import { FC, useMemo } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { LineItem } from 'shared/types/cart/LineItem';
import Image from 'components/commercetools-ui/atoms/image';
import Typography from 'components/commercetools-ui/atoms/typography';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';

type ClosedButtonProps = {
  hiddenItemsCount: number;
  lineItems: LineItem[];
  open: boolean;
};

const ClosedButton: FC<ClosedButtonProps> = ({ lineItems, hiddenItemsCount, open }) => {
  const { formatMessage: formatOrdersMessage } = useFormat({ name: 'orders' });

  const arrowClassNames = useClassNames([open ? 'rotate-180 transform' : '', 'transition mr-8']);

  const lineItemOrderSummary = useMemo(() => {
    if (lineItems.length < 3) return lineItems;
    else return [lineItems[0], lineItems[1], lineItems[2]];
  }, [lineItems]);

  return (
    <div className="flex w-full flex-col overflow-x-visible pb-4">
      <div className="flex w-full justify-between">
        <Typography className="text-gray-600">
          {formatOrdersMessage({
            id: 'your.order',
            defaultMessage: 'Your Order',
          })}
        </Typography>
        <ChevronDownIcon width={20} strokeWidth={1.5} className={arrowClassNames} />
      </div>
      <div className="mt-12 flex justify-between pr-20">
        {!open && (
          <div className="flex w-[70%] items-center">
            {lineItemOrderSummary?.map((lineItem) => (
              <div key={lineItem?.lineItemId} className="pr-16">
                {lineItem?.variant?.images?.[0] && (
                  <div key={lineItem?.lineItemId} className="relative mr-12 h-104 w-88 shrink-0">
                    <Image fill src={lineItem.variant.images[0]} style={{ objectFit: 'contain' }} alt={lineItem.name} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {hiddenItemsCount > 0 && !open && (
          <div className="flex items-center">
            <Typography className="mr-8 whitespace-nowrap text-gray-600">{`+ ${hiddenItemsCount}`}</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosedButton;
