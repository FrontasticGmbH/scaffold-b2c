import { useMemo } from 'react';
import { FacetConfiguration } from 'components/commercetools-ui/organisms/product/product-list-algolia/types';

interface Config {
  currency: string;
  facetsConfiguration: FacetConfiguration[];
}

const useFacetsConfiguration = ({ currency, facetsConfiguration }: Config) => {
  const finalFacetsConfiguration = useMemo<Record<string, FacetConfiguration>>(() => {
    return (facetsConfiguration ?? []).reduce(
      (acc, configuration) => ({
        ...acc,
        [configuration.key.replace(/\{currency\}/, currency)]: {
          type: configuration.type,
          label: configuration.label,
        } as FacetConfiguration,
      }),
      {},
    );
  }, [facetsConfiguration, currency]);

  return finalFacetsConfiguration;
};

export default useFacetsConfiguration;
