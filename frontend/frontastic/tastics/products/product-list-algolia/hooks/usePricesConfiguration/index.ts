import { useMemo } from 'react';
import { PriceConfiguration } from 'components/commercetools-ui/organisms/product/product-list/types';

interface Config {
  pricesConfiguration: PriceConfiguration[];
}

const usePricesConfiguration = ({ pricesConfiguration }: Config) => {
  const finalPricesConfiguration = useMemo<Record<string, PriceConfiguration>>(() => {
    return (pricesConfiguration ?? []).reduce(
      (acc, configuration) => ({
        ...acc,
        [configuration.key]: {
          ranges: configuration.ranges,
        } as PriceConfiguration,
      }),
      {},
    );
  }, [pricesConfiguration]);

  return finalPricesConfiguration;
};

export default usePricesConfiguration;
