import { Filter, FilterTypes } from './Filter';

export interface RangeFilter extends Filter {
  type: FilterTypes.RANGE;
  min?: number;
  max?: number;
}
