import { Filter, FilterTypes } from './Filter';

export interface TermFilter extends Filter {
  type: FilterTypes.ENUM | FilterTypes.TERM | FilterTypes.BOOLEAN;
  terms?: string[];
}
