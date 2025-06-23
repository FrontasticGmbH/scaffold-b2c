import { FilterTypes } from '@Types/query/Filter';

export interface ProductListDataSourceConfiguration {
  productFilters: DynamicFilter;
  productIds: string;
  productSkus: string;
}

interface DynamicFilterDefinition {
  field: string;
  type: FilterTypes;
}

export type DynamicFilterValue =
  | string
  | boolean
  | number
  | string[]
  | boolean[]
  | number[]
  | { min?: number; max?: number };

export interface DynamicFilter {
  filters: DynamicFilterDefinition[];
  values: Record<string, DynamicFilterValue>;
}
