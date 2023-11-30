import { CurrentRefinementsConnectorParamsRefinement } from 'instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements';
import { FacetConfiguration, PriceConfiguration } from '../types';

export interface RefinementRemovedEvent {
  attribute: string;
}

export interface ProductListContextShape {
  facetsConfiguration: Record<string, FacetConfiguration>;
  pricesConfiguration: Record<string, PriceConfiguration>;
  numericRanges: Record<string, [number, number]>;
  updateNumericRange: (attribute: string, range: [number, number]) => void;
  updateFacetsConfiguration: (newFacetsConfiguration: Record<string, FacetConfiguration>) => void;
  updatePricesConfiguration: (newPricesConfiguration: Record<string, PriceConfiguration>) => void;
  removeRefinement: (refinement: CurrentRefinementsConnectorParamsRefinement) => void;
  removeAllRefinements: () => void;
}
