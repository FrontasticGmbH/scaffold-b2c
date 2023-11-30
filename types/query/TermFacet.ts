import { Facet } from './Facet';
import { FilterTypes } from './Filter';

export interface TermFacet extends Facet {
  type: FilterTypes.TERM | FilterTypes.BOOLEAN;
  terms?: string[];
}
