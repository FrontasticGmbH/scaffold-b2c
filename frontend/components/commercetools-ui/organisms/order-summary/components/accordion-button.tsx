import { FC } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Typography from 'components/commercetools-ui/atoms/typography';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import { Money } from 'types/entity/product';

type AccordionButtonProps = {
  open: boolean;
  toggleAccordion: () => void;
  total: Required<Money>;
};

const AccordionButton: FC<AccordionButtonProps> = ({ open, toggleAccordion, total }) => {
  const { formatMessage: formatOrdersMessage } = useFormat({ name: 'orders' });

  const accordionContentClassNames = useClassNames([
    'flex w-full justify-between border-t py-16',
    open ? 'border-t' : '',
  ]);

  const arrowClassNames = useClassNames([open ? 'rotate-180 transform' : '', 'transition mr-8']);

  return (
    <div>
      <div className={accordionContentClassNames} onClick={toggleAccordion}>
        <Typography className="text-gray-600">
          {formatOrdersMessage({
            id: 'your.order',
            defaultMessage: 'Your Order',
          })}
        </Typography>

        <div className="flex">
          <Typography className="hidden pr-8 font-medium text-primary md:block">
            {CurrencyHelpers.formatForCurrency(total)}
          </Typography>
          <ChevronDownIcon width={20} strokeWidth={1.5} className={arrowClassNames} />
        </div>
      </div>
    </div>
  );
};

export default AccordionButton;
