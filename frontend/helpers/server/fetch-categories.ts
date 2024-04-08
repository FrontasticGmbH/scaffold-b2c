import 'server-only';

import { cache } from 'react';
import { Category } from 'shared/types/product';
import { PaginatedResult } from 'shared/types/result';
import { sdk } from 'sdk';
import getServerOptions from './get-server-options';

const fetchCategories = cache(({ format = 'flat', limit = 500 }: { format?: 'tree' | 'flat'; limit?: number } = {}) => {
  return sdk.callAction<PaginatedResult<Category>>({
    actionName: 'product/queryCategories',
    query: { format, limit },
    ...getServerOptions(),
  });
});

export default fetchCategories;
