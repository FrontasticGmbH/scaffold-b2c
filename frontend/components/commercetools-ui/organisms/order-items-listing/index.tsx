import React, { FC, useMemo, useState } from 'react';
import Accordion from 'components/commercetools-ui/atoms/accordion';
import Typography from 'components/commercetools-ui/atoms/typography';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import { LineItem } from 'types/entity/cart';
import ClosedButton from './closed-button';
import OrderItem from './order-item';
import OrderItemsList from './order-items-list';

type OrderItemsListingProps = {
  className?: string;
  lineItems: LineItem[];
};

const OrderItemsListing: FC<OrderItemsListingProps> = ({ className, lineItems }) => {
  const { formatMessage: formatOrdersMessage } = useFormat({ name: 'orders' });

  const [open, setOpen] = useState(false);

  const containerClassName = useClassNames(['grid w-full grid-cols-1', className]);
  const accordionClassNames = useClassNames(['hidden lg:block lg:pt-0', className]);
  const listClassNames = useClassNames(['lg:hidden block', className]);

  const hiddenItemsCount = useMemo(() => (lineItems?.length ?? 0) - 3, [lineItems?.length]);

  return (
    <>
      {lineItems.length === 1 ? (
        <div className={containerClassName}>
          <div className="border-b pb-16">
            <Typography className="text-gray-600">
              {formatOrdersMessage({
                id: 'your.order',
                defaultMessage: 'Your Order',
              })}
            </Typography>
          </div>
          <OrderItem lineItem={lineItems[0]} />
        </div>
      ) : (
        <Accordion
          closedSectionTitle={formatOrdersMessage({ id: 'your.order', defaultMessage: 'Your order' })}
          customClosedButton={<ClosedButton hiddenItemsCount={hiddenItemsCount} lineItems={lineItems} open={open} />}
          className={accordionClassNames}
          buttonClassName="py-16 w-full"
          onClick={() => setOpen(!open)}
        >
          <OrderItemsList lineItems={lineItems} />
        </Accordion>
      )}

      <OrderItemsList className={listClassNames} lineItems={lineItems} />
    </>
  );
};

export default OrderItemsListing;
