import 'server-only';

import { cache } from 'react';
import { Category } from 'shared/types/product';
import { PaginatedResult } from 'shared/types/result';
import { sdk } from 'sdk';
import getServerOptions from './get-server-options';

const memoizedFetchCategories = cache((format = 'flat', limit = 500) => {
  return sdk.callAction<PaginatedResult<Category>>({
    actionName: 'product/queryCategories',
    query: { format, limit },
    ...getServerOptions(),
  });
});

const fetchCategories = cache(({ format = 'flat', limit = 500 }: { format?: 'tree' | 'flat'; limit?: number } = {}) => {
  return memoizedFetchCategories(format, limit);
});

export default fetchCategories;
