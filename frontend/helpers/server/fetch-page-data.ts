import 'server-only';

import { cache } from 'react';
import { sdk } from 'sdk';
import { Params, SearchParams } from 'types/next';
import getServerOptions from './get-server-options';

//Memoized function call
const memoizedFetchPageData = cache((slug: string, qs: string) => {
  return sdk.page.getPage({
    path: slug,
    query: Object.fromEntries(new URLSearchParams(qs).entries()),
    ...getServerOptions(),
  });
});

//This just serializers parameters for memoization to work
const fetchPageData = (params: Params, searchParams: SearchParams) => {
  return memoizedFetchPageData(
    `/${(params.slug as string[])?.join('/') ?? ''}`,
    new URLSearchParams(searchParams).toString(),
  );
};

export default fetchPageData;
