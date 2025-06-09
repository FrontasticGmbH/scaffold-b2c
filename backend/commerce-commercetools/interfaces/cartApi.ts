import { SortOrder } from '@Types/query';
import { RawFacetData } from '@Commerce-commercetools/interfaces/frontastic-override';

export type QueryParams = {
  facets?: Record<string, RawFacetData>;
  sortAttributes?: {
    [key: string]: {
      [attribute: string]: SortOrder | undefined;
    };
  };
};
