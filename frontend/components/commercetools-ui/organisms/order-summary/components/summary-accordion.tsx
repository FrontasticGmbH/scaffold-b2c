import React, { FC, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Accordion from 'components/commercetools-ui/atoms/accordion';
import Image from 'components/commercetools-ui/atoms/image';
import Typography from 'components/commercetools-ui/atoms/typography';
import Costs from 'components/commercetools-ui/organisms/order-payment-section/components/costs';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useClassNames from 'helpers/hooks/useClassNames';
import useI18n from 'helpers/hooks/useI18n';
import mapCosts from 'helpers/utils/mapCosts';
import { Cart } from 'types/entity/cart';
import { Order } from 'types/entity/order';
import AccordionButton from './accordion-button';

export interface Props {
  className?: string;
  order?: Order;
  cart?: Cart;
}

const SummaryAccordion: FC<Props> = ({ className, order, cart }) => {
  const data = { ...(order ?? cart) } as Cart;

  const { locale } = useParams();
  const { currency } = useI18n();

  const [open, setOpen] = useState(false);

  const accordionClassNames = useClassNames(['block lg:mt-40', className]);

  const toggleAccordion = () => setOpen(!open);

  const lineItemClassNames = (index: number) => {
    return `
      flex justify-start py-16
      ${data?.lineItems && index === data.lineItems.length - 1 ? '' : 'border-b'}`;
  };

  const total = useMemo(
    () => (order ? mapCosts({ cart: order, currency }).total : mapCosts({ cart, currency }).total),
    [cart, currency, order],
  );

  return (
    <Accordion
      className={accordionClassNames}
      buttonClassName="w-full"
      customClosedButton={<AccordionButton open={open} toggleAccordion={toggleAccordion} total={total} />}
    >
      <div className="grid max-h-400 w-full grid-cols-1 overflow-auto">
        {data?.lineItems?.map((lineItem, index) => (
          <div key={lineItem.lineItemId} className={lineItemClassNames(index)}>
            {lineItem.variant?.images?.[0] && (
              <div className="relative h-104 w-88 shrink-0">
                <Image
                  fill
                  src={lineItem.variant.images[0]}
                  style={{ objectFit: 'contain' }}
                  alt={lineItem.name ?? ''}
                />
              </div>
            )}
            <div className="flex flex-col justify-center gap-8 pl-16 text-14 text-primary">
              <Typography>{lineItem?.name}</Typography>
              <Typography className="font-medium">
                {CurrencyHelpers.formatForCurrency(lineItem?.price as number, locale)}
              </Typography>
              <Typography>{`x ${lineItem?.count}`}</Typography>
            </div>
          </div>
        ))}
      </div>

      <Costs className="bg-neutral-200 p-16 md:px-24 lg:px-44" order={order} />
    </Accordion>
  );
};

export default SummaryAccordion;
