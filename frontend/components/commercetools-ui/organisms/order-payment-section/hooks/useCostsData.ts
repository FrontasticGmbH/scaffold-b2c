import { useEffect, useMemo, useState } from 'react';
import { useFormat } from 'helpers/hooks/useFormat';
import useI18n from 'helpers/hooks/useI18n';
import mapCosts from 'helpers/utils/mapCosts';
import { Money } from 'types/entity/product';
import { useCart } from 'frontastic';
import { CostsProps, CostRef } from '../types';

export type UseCostsData = (props: Pick<CostsProps, 'dataReference' | 'order'>) => {
  costsToRender: CostRef[];
  total: CostRef;
  loading: boolean;
};

const useCostsData: UseCostsData = ({ dataReference = 'cart', order }) => {
  const { transaction } = useCart();
  const { currency } = useI18n();
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const [loading, setLoading] = useState(true);

  const skeletonMoney: Money = useMemo(() => {
    return { fractionDigits: 2, centAmount: 999, currencyCode: 'USD' };
  }, []);

  const skeletonCosts = useMemo(
    () => [
      {
        key: 'subtotal',
        label: formatCartMessage({ id: 'subtotal', defaultMessage: 'Subtotal' }),
        value: skeletonMoney,
      },
      {
        key: 'shipping',
        label:
          dataReference === 'cart' && transaction.isEstimatedShipping
            ? formatCartMessage({ id: 'shipping.estimate', defaultMessage: 'Est. Shipping' })
            : formatCartMessage({ id: 'shipping', defaultMessage: 'Shipping' }),
        value: skeletonMoney,
      },
      {
        key: 'tax',
        label: formatCartMessage({ id: 'tax', defaultMessage: 'Tax' }),
        value: skeletonMoney,
      },
      {
        key: 'discount',
        label: formatCartMessage({
          id: 'discount',
          defaultMessage: 'Discount',
        }),
        value: skeletonMoney,
      },
    ],
    [formatCartMessage, skeletonMoney, transaction.isEstimatedShipping, dataReference],
  ) as CostRef[];

  const costsToRender = useMemo(() => {
    const dataIsHydrated = (dataReference === 'order' && order) || (dataReference === 'cart' && !!transaction.total);

    if (!dataIsHydrated) return [];

    const costsToUse = dataReference === 'cart' ? transaction : mapCosts({ order, currency });

    const costs = [...skeletonCosts].map(({ key, label }) => {
      return {
        key,
        label,
        value: costsToUse[key],
      };
    }) as CostRef[];

    return costs;
  }, [currency, dataReference, order, skeletonCosts, transaction]);

  useEffect(() => {
    if (costsToRender.length) setLoading(false);
  }, [costsToRender]);

  const total: CostRef = {
    key: 'total',
    label: formatCartMessage({ id: 'total', defaultMessage: 'Total' }),
    value: dataReference === 'order' ? mapCosts({ order, currency }).total : transaction.total,
  };

  return { loading, costsToRender: loading ? skeletonCosts : costsToRender, total };
};

export default useCostsData;
