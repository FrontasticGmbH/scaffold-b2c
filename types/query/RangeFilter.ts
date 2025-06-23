import { BaseFilter, FilterTypes } from './Filter';

export interface RangeFilter extends BaseFilter {
  type: FilterTypes.RANGE;
  min?: number;
  max?: number;
}
