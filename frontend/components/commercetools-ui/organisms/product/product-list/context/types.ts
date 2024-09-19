import { FacetConfiguration, PriceConfiguration } from '../types';

export interface RefinementRemovedEvent {
  attribute: string;
}

export interface UiState {
  slug?: string;
  searchQuery?: string;
  previousCursor?: string;
  nextCursor?: string;
  totalItems: number;
}

export interface Sort {
  attribute: string;
  value: 'asc' | 'desc';
}

export interface ActiveRefinement {
  attribute: string;
  label: string;
  refine: () => void;
}

export interface ProductListContextShape extends UiState {
  pricesConfiguration: Record<string, PriceConfiguration>;
  facetsConfiguration: Record<string, FacetConfiguration>;
  activeSort?: Sort;
  activeLimit?: number;
  activeRefinements: Array<ActiveRefinement>;
  updatePricesConfiguration: (newPricesConfiguration: Record<string, PriceConfiguration>) => void;
  updateFacetsConfiguration: (newFacetsConfiguration: Record<string, FacetConfiguration>) => void;
  refine: (attribute: string, key: string) => void;
  refineRange: (attribute: string, value: [number, number]) => void;
  replaceSort: (newSort: Sort) => void;
  removeAllRefinements: () => void;
  loadMore: () => void;
}
