import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import cloneDeep from 'lodash/cloneDeep';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useI18n from 'helpers/hooks/useI18n';
import usePath from 'helpers/hooks/usePath';
import { refinementRemovedEventName, refinementsClearedEventName } from './constants';
import { ActiveRefinement, ProductListContextShape, RefinementRemovedEvent, Sort, UiState } from './types';
import { BooleanFacet, FacetConfiguration, PriceConfiguration, RangeFacet, TermFacet } from '../types';

export const ProductListContext = createContext<ProductListContextShape>({
  pricesConfiguration: {},
  facetsConfiguration: {},
  totalItems: 0,
  activeRefinements: [],
  updatePricesConfiguration() {},
  updateFacetsConfiguration() {},
  refine() {},
  refineRange() {},
  replaceSort() {},
  removeAllRefinements() {},
  loadMore() {},
});

export interface ProductListPropsProps {
  uiState: UiState;
}

const ProductListProvider = ({ children, uiState }: React.PropsWithChildren<ProductListPropsProps>) => {
  const router = useRouter();

  const { pathWithoutQuery } = usePath();

  const { locale } = useParams();

  const searchParams = useSearchParams();

  const limit = searchParams.get('limit');

  const { currency } = useI18n();

  const [facetsConfiguration, setFacetsConfiguration] = useState<Record<string, FacetConfiguration>>({});

  const [pricesConfiguration, setPricesConfiguration] = useState<Record<string, PriceConfiguration>>({});

  const activeSort = useMemo<Sort | undefined>(() => {
    for (const q in searchParams.entries()) {
      const match = q.match(/sortAttributes\[0\]\[(.+)\]/);

      if (match?.[1]) return { attribute: match[1], value: searchParams.get(q) as 'asc' | 'desc' };
    }
  }, [searchParams]);

  const limitStep = useMemo(() => 24, []);

  const activeLimit = useMemo<number>(() => {
    return limit ? +limit : limitStep;
  }, [limit, limitStep]);

  const updatePricesConfiguration = useCallback((newPricesConfiguration: Record<string, PriceConfiguration>) => {
    setPricesConfiguration(newPricesConfiguration);
  }, []);

  const updateFacetsConfiguration = useCallback((newFacetsConfiguration: Record<string, FacetConfiguration>) => {
    setFacetsConfiguration(newFacetsConfiguration);
  }, []);

  const applyRefinements = useCallback(
    (facetsConfiguration: Record<string, FacetConfiguration>, sort?: Sort, limit?: number) => {
      const params = new URLSearchParams();

      if (uiState?.searchQuery) params.set('query', uiState.searchQuery);

      Object.values(facetsConfiguration).forEach((configuration) => {
        if (!configuration.selected) return;

        if (configuration.type === 'range') {
          params.set(`facets[${configuration.key}][min]`, (configuration.minSelected ?? configuration.min).toString());
          params.set(`facets[${configuration.key}][max]`, (configuration.maxSelected ?? configuration.max).toString());
        } else if (configuration.type === 'term' || configuration.type === 'color') {
          if (configuration.key === 'categories.categoryId') {
            configuration.terms
              .filter((term) => term.selected)
              .forEach((term) => params.append('categories[]', term.key));
          } else {
            configuration.terms
              .filter((term) => term.selected)
              .forEach((term, index) => params.set(`facets[${configuration.key}][terms][${index}]`, term.key));
          }
        } else if (configuration.type === 'boolean') {
          configuration.terms
            .filter((term) => term.selected)
            .forEach((term) => params.set(`facets[${configuration.key}][boolean]`, term.key));
        }
      });

      if (sort) params.set(`sortAttributes[0][${sort.attribute}]`, sort.value);

      if (limit) params.set('limit', limit.toString());

      router.push(`${pathWithoutQuery}?${params.toString()}`);
    },
    [uiState?.searchQuery, router, pathWithoutQuery],
  );

  const activeRefinements = useMemo(() => {
    const refinements = [] as ActiveRefinement[];

    const newFacetsConfiguration = cloneDeep(facetsConfiguration);

    const addRefinement = (configuration: FacetConfiguration, label: string, refineCb: () => void) => {
      refinements.push({
        attribute: configuration.key,
        label,
        refine() {
          refineCb();

          applyRefinements(newFacetsConfiguration, activeSort, activeLimit);

          window.dispatchEvent(
            new CustomEvent<RefinementRemovedEvent>(refinementRemovedEventName, {
              detail: { attribute: configuration.key },
            }),
          );
        },
      });
    };

    Object.values(newFacetsConfiguration)
      .filter((configuration) => configuration.selected)
      .forEach((configuration) => {
        if (configuration.type === 'range') {
          addRefinement(
            configuration,
            `${CurrencyHelpers.formatForCurrency(
              configuration.minSelected ?? configuration.min,
              locale,
              currency,
            )} - ${CurrencyHelpers.formatForCurrency(
              configuration.maxSelected ?? configuration.max,
              locale,
              currency,
            )}`,
            () => {
              configuration.selected = false;
            },
          );
        } else if (
          configuration.type === 'term' ||
          configuration.type === 'color' ||
          configuration.type === 'boolean'
        ) {
          configuration.terms
            .filter((t) => t.selected)
            .forEach((term) => {
              addRefinement(configuration, term.label, () => {
                term.selected = false;
                configuration.selected = configuration.terms.some((t) => t.selected);
              });
            });
        }
      });

    return refinements;
  }, [currency, facetsConfiguration, locale, applyRefinements, activeSort, activeLimit]);

  const replaceSort = useCallback(
    (newSort: Sort) => {
      applyRefinements(facetsConfiguration, newSort, activeLimit);
    },
    [facetsConfiguration, applyRefinements, activeLimit],
  );

  const refine = useCallback(
    (attribute: string, key: string) => {
      const newFacetsConfiguration = cloneDeep(facetsConfiguration);

      const facet = newFacetsConfiguration[attribute] as TermFacet | BooleanFacet;

      const term = facet.terms.find((t) => t.key === key);

      if (term) {
        term.selected = !term.selected;

        if (facet.type === 'boolean')
          facet.terms.filter((t) => t.key !== term.key).forEach((term) => (term.selected = false));
      }

      facet.selected = facet.terms.some((t) => t.selected);

      applyRefinements(newFacetsConfiguration, activeSort);
    },
    [facetsConfiguration, applyRefinements, activeSort],
  );

  const refineRange = useCallback(
    (attribute: string, value: [number, number]) => {
      const newFacetsConfiguration = cloneDeep(facetsConfiguration);

      const facet = newFacetsConfiguration[attribute] as RangeFacet;

      if (facet) {
        facet.minSelected = value[0];
        facet.maxSelected = value[1];
        facet.selected = true;
      }

      applyRefinements(newFacetsConfiguration, activeSort);
    },
    [facetsConfiguration, applyRefinements, activeSort],
  );

  const loadMore = useCallback(() => {
    applyRefinements(facetsConfiguration, activeSort, activeLimit + limitStep);
  }, [facetsConfiguration, activeSort, applyRefinements, activeLimit, limitStep]);

  const removeAllRefinements = useCallback(() => {
    const newFacetsConfiguration = cloneDeep(facetsConfiguration);

    Object.values(newFacetsConfiguration).forEach((configuration) => {
      configuration.selected = false;

      if (configuration.type === 'term' || configuration.type === 'color')
        configuration.terms.forEach((t) => (t.selected = false));
    });

    applyRefinements(newFacetsConfiguration, activeSort);

    window.dispatchEvent(new CustomEvent(refinementsClearedEventName));
  }, [applyRefinements, facetsConfiguration, activeSort]);

  return (
    <ProductListContext.Provider
      value={{
        ...uiState,
        facetsConfiguration,
        pricesConfiguration,
        activeSort,
        activeLimit,
        activeRefinements,
        updateFacetsConfiguration,
        updatePricesConfiguration,
        refine,
        refineRange,
        replaceSort,
        removeAllRefinements,
        loadMore,
      }}
    >
      {children}
    </ProductListContext.Provider>
  );
};

export default ProductListProvider;

export const useProductList = () => useContext(ProductListContext);
