import { Facet, FacetTypes } from './Facet';

export interface RangeFacet extends Facet {
  type: FacetTypes.RANGE;
  min?: number;
  max?: number;
  count?: number;
  minSelected?: number;
  maxSelected?: number;
}
