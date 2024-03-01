import { FilterTypes } from './Filter';

export interface Facet {
  type: FilterTypes.BOOLEAN | FilterTypes.ENUM | FilterTypes.RANGE | FilterTypes.TERM;
  identifier: string;
}
