import { SortOrder } from '@Types/query';

export type QueryParams = {
  facets?: Record<string, RawFacetData>;
  sortAttributes?: {
    [key: string]: {
      [attribute: string]: SortOrder | undefined;
    };
  };
};

export interface RawFacetData {
  min?: number;
  max?: number;
  terms?: string[] | Record<string, string>;
  boolean?: string | boolean;
}
