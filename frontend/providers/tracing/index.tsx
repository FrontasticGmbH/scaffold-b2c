import React, { useEffect } from 'react';
import { SDKResponse } from '@commercetools/frontend-sdk';

const TracingProvider = ({ children, tracing }: React.PropsWithChildren<Pick<SDKResponse<unknown>, 'tracing'>>) => {
  const { frontasticRequestId } = tracing;

  useEffect(() => {
    console.log(`%cFrontastic-Request-ID: ${frontasticRequestId}`, 'color: white; font-size: 16px;');
  }, [frontasticRequestId]);

  return <>{children}</>;
};

export default TracingProvider;
