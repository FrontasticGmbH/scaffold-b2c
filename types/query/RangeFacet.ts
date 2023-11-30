import { Facet } from './Facet';
import { FilterTypes } from './Filter';

export interface RangeFacet extends Facet {
  type: FilterTypes.RANGE;
  min?: number;
  max?: number;
}
