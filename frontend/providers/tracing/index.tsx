import React, { useEffect, useMemo } from 'react';
import { SDKResponse } from '@commercetools/frontend-sdk';
import { PageResponse } from '@commercetools/frontend-sdk/lib/types/api/page';

const TracingProvider = ({ children, page }: React.PropsWithChildren<{ page: SDKResponse<PageResponse> }>) => {
  const { frontasticRequestId } = page.tracing;

  const data = useMemo(() => (page.isError ? null : page.data), [page]);

  useEffect(() => {
    console.log(`%cFrontastic-Request-ID: ${frontasticRequestId}`, 'font-size: 16px;');
  }, [frontasticRequestId]);

  useEffect(() => {
    if (!data || process.env.NODE_ENV === 'production') return;

    console.log('Datasources:', data.data.dataSources);
    console.log('Studio:', { page: data.page, pageFolder: data.pageFolder });
  }, [data]);

  return <>{children}</>;
};

export default TracingProvider;
