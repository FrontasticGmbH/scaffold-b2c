import { useMemo } from 'react';
import { Category } from 'shared/types/product';
import { Facet } from 'shared/types/result';
import { FacetConfiguration, TermFacet } from 'components/commercetools-ui/organisms/product/product-list/types';
import { useFormat } from 'helpers/hooks/useFormat';

interface Config {
  facets: Facet[];
  facetsConfiguration: FacetConfiguration[];
  categories: Category[];
}

const useFacetsConfiguration = ({ facets, facetsConfiguration, categories }: Config) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const externalFacetsConfiguration = useMemo<Record<string, FacetConfiguration>>(() => {
    return (facetsConfiguration ?? []).reduce(
      (acc, configuration) => ({
        ...acc,
        [configuration.key]: configuration as FacetConfiguration,
      }),
      {},
    );
  }, [facetsConfiguration]);

  const finalFacetsConfiguration = useMemo<Record<string, FacetConfiguration>>(() => {
    const finalFacets = facets ?? [];

    const keys = Object.keys(externalFacetsConfiguration);

    finalFacets.sort((a, b) => keys.indexOf(a.key) - keys.indexOf(b.key));

    return finalFacets
      .filter((facet) => facet.key in externalFacetsConfiguration)
      .map((facet) => {
        if (facet.key === 'categories.id') {
          (facet as TermFacet).terms = (facet as TermFacet).terms.map((term) => ({
            ...term,
            label: categories.find((c) => c.categoryId === term.key)?.name ?? '',
          }));
        } else if (facet.type === 'boolean') {
          (facet as TermFacet).terms = (facet as TermFacet).terms.map((term) => ({
            ...term,
            label:
              term.key === 'T'
                ? externalFacetsConfiguration[facet.key].label
                : formatProductMessage({ id: 'regular', defaultMessage: 'Regular' }),
          }));
        }

        return facet;
      })
      .filter(
        (facet) =>
          facet.type !== 'boolean' || !!(facet as TermFacet).terms.find((term) => term.key === 'T' && term.count > 0),
      )
      .reduce(
        (acc, configuration) => ({
          ...acc,
          [configuration.key]: {
            ...configuration,
            label: externalFacetsConfiguration[configuration.key].label,
            type: externalFacetsConfiguration[configuration.key].type,
          } as FacetConfiguration,
        }),
        {},
      );
  }, [facets, externalFacetsConfiguration, categories, formatProductMessage]);

  return finalFacetsConfiguration;
};

export default useFacetsConfiguration;
