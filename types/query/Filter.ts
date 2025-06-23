import { RangeFilter } from "./RangeFilter";
import { TermFilter } from "./TermFilter";

export enum FilterTypes {
  BOOLEAN = 'boolean',
  ENUM = 'enum',
  RANGE = 'range',
  TERM = 'term',
  MONEY = 'money',
  NUMBER = 'number',
  TEXT = 'text',
}

export interface BaseFilter {
  identifier: string;
  type: FilterTypes;
}
export type Filter = RangeFilter | TermFilter;
