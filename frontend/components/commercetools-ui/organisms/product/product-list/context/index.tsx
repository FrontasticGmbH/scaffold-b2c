import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import cloneDeep from 'lodash/cloneDeep';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useI18n from 'helpers/hooks/useI18n';
import usePath from 'helpers/hooks/usePath';
import { useRouter } from 'i18n/routing';
import { ShippingMethod } from 'types/entity/cart';
import { Category } from 'types/entity/category';
import { Variant } from 'types/entity/product';
import { LineItem as WishlistLineItem, Wishlist } from 'types/entity/wishlist';
import { refinementRemovedEventName, refinementsClearedEventName } from './constants';
import { ActiveRefinement, ProductListContextShape, RefinementRemovedEvent, Sort, UiState } from './types';
import { BooleanFacet, FacetConfiguration, PriceConfiguration, RangeFacet, TermFacet } from '../types';
import { useTranslations } from 'use-intl';

export const ProductListContext = createContext<ProductListContextShape>({
  categories: [],
  pricesConfiguration: {},
  facetsConfiguration: {},
  totalItems: 0,
  activeRefinements: [],
  refine() {},
  refineRange() {},
  replaceSort() {},
  removeAllRefinements() {},
  loadMore() {},
});

export interface ProductListPropsProps {
  uiState: UiState;
  categories: Category[];
  shippingMethods?: ShippingMethod[];
  pricesConfiguration: Record<string, PriceConfiguration>;
  facetsConfiguration: Record<string, FacetConfiguration>;
  wishlist?: Wishlist;
  addToWishlist?: (lineItem: WishlistLineItem, count: number) => Promise<void>;
  removeFromWishlist?: (item: WishlistLineItem) => Promise<void>;
  onAddToCart?: (variant: Variant, quantity: number) => Promise<void>;
}

const ProductListProvider = ({
  children,
  categories,
  shippingMethods,
  uiState,
  facetsConfiguration,
  pricesConfiguration,
  wishlist,
  addToWishlist,
  removeFromWishlist,
  onAddToCart,
}: React.PropsWithChildren<ProductListPropsProps>) => {
  const router = useRouter();
  const translate = useTranslations();

  const { pathWithoutQuery } = usePath();

  const { locale } = useParams();

  const searchParams = useSearchParams();

  const limit = searchParams.get('limit');

  const { currency } = useI18n();

  const activeSort = useMemo<Sort | undefined>(() => {
    for (const q of searchParams.entries()) {
      const match = q[0].match(/sortAttributes\[0\]\[(.+)\]/);

      if (match?.[1]) return { attribute: match[1], value: q[1] as 'asc' | 'desc' };
    }

    return { attribute: '', value: 'desc' }; //Relevance
  }, [searchParams]);

  const limitStep = useMemo(() => 24, []);

  const activeLimit = useMemo<number>(() => {
    return limit ? +limit : limitStep;
  }, [limit, limitStep]);

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

      if (sort && sort.attribute) params.set(`sortAttributes[0][${sort.attribute}]`, sort.value);

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
          let refinementLabel = `${CurrencyHelpers.formatForCurrency(
            configuration.minSelected ?? configuration.min,
            locale,
            currency,
          )} - ${CurrencyHelpers.formatForCurrency(configuration.maxSelected ?? configuration.max, locale, currency)}`;

          if (configuration.max === configuration.maxSelected) {
            refinementLabel = `${translate('common.from')} ${CurrencyHelpers.formatForCurrency(
              configuration.minSelected ?? configuration.min,
              locale,
              currency,
            )}`;
          }

          addRefinement(configuration, refinementLabel, () => {
            configuration.selected = false;
          });
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
        categories,
        shippingMethods,
        facetsConfiguration,
        pricesConfiguration,
        activeSort,
        activeLimit,
        activeRefinements,
        refine,
        refineRange,
        replaceSort,
        removeAllRefinements,
        loadMore,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        onAddToCart,
      }}
    >
      {children}
    </ProductListContext.Provider>
  );
};

export default ProductListProvider;

export const useProductList = () => useContext(ProductListContext);
