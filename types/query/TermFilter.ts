import { Filter, FilterTypes } from './Filter';

export interface TermFilter extends Filter {
  type: FilterTypes.TERM | FilterTypes.BOOLEAN;
  terms?: string[];
}
