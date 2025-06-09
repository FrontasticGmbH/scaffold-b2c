export enum FilterTypes {
  BOOLEAN = 'boolean',
  ENUM = 'enum',
  RANGE = 'range',
  TERM = 'term',
  MONEY = 'money',
  NUMBER = 'number',
  TEXT = 'text',
}

export interface Filter<T = string[] | number[] | { min: string | number; max: string | number }> {
  type: FilterTypes;
  identifier: string;
  field?: string;
  values?: T;
  terms?: string[];
  name?: string;
  min?: number;
  max?: number;
}

export interface FilterSet<T = never> {
  filters: Filter<T>[];
  values: Record<string, string[]>;
}

export interface QueryParamsWithFilters<T = never> {
  productFilters?: Partial<FilterSet<T>>;
  categoryFilters?: Partial<FilterSet<T>>;
}
