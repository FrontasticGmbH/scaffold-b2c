import 'server-only';

import { cache } from 'react';
import { sdk } from 'sdk';
import { SearchParams } from 'types/next';
import getServerOptions from './get-server-options';

const fetchPageData = cache((slug: string[] | undefined, searchParams: SearchParams) => {
  return sdk.page.getPage({
    path: `/${slug?.join('/') ?? ''}`,
    query: searchParams as Record<string, string>,
    ...getServerOptions(),
  });
});

export default fetchPageData;
