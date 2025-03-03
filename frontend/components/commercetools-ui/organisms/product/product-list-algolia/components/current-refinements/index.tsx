import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import { CurrentRefinementsConnectorParamsRefinement } from 'instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements';
import { useCurrentRefinements } from 'react-instantsearch';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import useI18n from 'helpers/hooks/useI18n';
import { useProductList } from '../../context';
import useRefinementHelpers from '../../hooks/useRefinementHelpers';

const CurrentRefinements = () => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { locale } = useParams();

  const { numericRanges, removeRefinement, removeAllRefinements } = useProductList();

  const { currency } = useI18n();

  const { items } = useCurrentRefinements();

  const { resolveLabel } = useRefinementHelpers();

  const nonNumericRefinements = useMemo(
    () => items.map((item) => item.refinements.filter((refinement) => refinement.type !== 'numeric')).flat(),
    [items],
  );

  const numericRefinements = useMemo(() => {
    const refinements = items
      .map((item) => item.refinements.filter((refinement) => refinement.type === 'numeric'))
      .flat();

    const refinementsMap = refinements.reduce<Record<string, [number, number]>>(
      (acc, curr) => ({
        ...acc,
        [curr.attribute]: [
          curr.operator?.includes('>') ? +curr.value : (acc[curr.attribute]?.[0] ?? numericRanges[curr.attribute]?.[0]),
          curr.operator?.includes('<') ? +curr.value : (acc[curr.attribute]?.[1] ?? numericRanges[curr.attribute]?.[1]),
        ],
      }),
      {},
    );

    const finalRefinements = Object.entries(refinementsMap).map<CurrentRefinementsConnectorParamsRefinement>(
      ([attribute, range]) =>
        ({
          type: 'numeric',
          attribute,
          label: `${CurrencyHelpers.formatForCurrency(
            range[0],
            locale,
            currency,
          )} - ${CurrencyHelpers.formatForCurrency(range[1], locale, currency)}`,
        }) as CurrentRefinementsConnectorParamsRefinement,
    );

    return finalRefinements;
  }, [items, numericRanges, currency, locale]);

  if (!nonNumericRefinements.length && !numericRefinements.length) return <></>;

  return (
    <div className="flex flex-wrap items-center justify-start gap-14 pt-16">
      {[...numericRefinements, ...nonNumericRefinements].map((refinement) => (
        <div
          key={refinement.value}
          className="flex cursor-default items-center justify-center gap-8 rounded-md border border-neutral-500 bg-white px-8 py-6 transition hover:border-primary"
        >
          <span className="text-14 leading-[20px] text-gray-600">
            {resolveLabel(refinement.attribute, refinement.label)}
          </span>
          <CloseIcon
            className="w-20 cursor-pointer fill-gray-600 stroke-0"
            onClick={() => removeRefinement(refinement)}
          />
        </div>
      ))}
      <div className="flex cursor-default items-center justify-center gap-8 rounded-md border border-transparent bg-white px-8 py-6 transition hover:border-primary">
        <span className="text-14">{formatProductMessage({ id: 'clear.all', defaultMessage: 'Clear All' })}</span>
        <CloseIcon className="w-20 cursor-pointer fill-gray-600 stroke-0" onClick={removeAllRefinements} />
      </div>
    </div>
  );
};

export default CurrentRefinements;
