import { useMemo } from 'react';
import { Category } from 'shared/types/product';
import { Facet } from 'shared/types/result';
import { useTranslations } from 'use-intl';
import { FacetConfiguration, TermFacet } from 'components/commercetools-ui/organisms/product/product-list/types';

interface Config {
  facets: Facet[];
  facetsConfiguration: FacetConfiguration[];
  categories: Category[];
}

const useFacetsConfiguration = ({ facets, facetsConfiguration, categories }: Config) => {
  const translate = useTranslations();

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
            label: term.key === 'true' ? externalFacetsConfiguration[facet.key].label : translate('product.regular'),
          }));
        }

        return facet;
      })
      .filter(
        (facet) =>
          facet.type !== 'boolean' ||
          !!(facet as TermFacet).terms.find((term) => term.key === 'true' && term.count > 0),
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
  }, [facets, externalFacetsConfiguration, categories, translate]);

  return finalFacetsConfiguration;
};

export default useFacetsConfiguration;
