import { BaseFilter, FilterTypes } from './Filter';

export interface TermFilter extends BaseFilter {
  type: FilterTypes.ENUM | FilterTypes.TERM | FilterTypes.BOOLEAN;
  terms?: string[];
}
