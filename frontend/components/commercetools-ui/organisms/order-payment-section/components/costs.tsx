import React, { FC } from 'react';
import { useParams } from 'next/navigation';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useClassNames from 'helpers/hooks/useClassNames';
import useCostsData from '../hooks/useCostsData';
import { CostsProps } from '../types';

const Costs: FC<CostsProps> = ({
  className,
  order,
  dataReference = 'cart',
  subCostsContainerClassName,
  subCostClassName,
  totalAmountClassName,
}) => {
  const { locale } = useParams();
  const { costsToRender, total } = useCostsData({ dataReference, order });

  const totalAmountClassNames = useClassNames([
    'mt-24 flex items-center justify-between font-medium',
    totalAmountClassName,
  ]);

  const subCostsContainerClassNames = useClassNames(['grid gap-8', subCostsContainerClassName]);
  const subCostsClassNames = useClassNames([
    'flex items-center justify-between capitalize text-gray-600 ',
    subCostClassName,
  ]);

  return (
    <div className={className}>
      <div className={subCostsContainerClassNames}>
        {costsToRender.map(
          ({ key, label, value }) =>
            !!value?.centAmount &&
            value.centAmount > 0 && (
              <div key={key} className={subCostsClassNames}>
                <p>{label}</p>
                <p>{CurrencyHelpers.formatForCurrency(value, locale)}</p>
              </div>
            ),
        )}
      </div>
      <div className={totalAmountClassNames}>
        <p>{total.label}</p>
        <p>{CurrencyHelpers.formatForCurrency(total.value, locale)}</p>
      </div>
    </div>
  );
};

export default Costs;
