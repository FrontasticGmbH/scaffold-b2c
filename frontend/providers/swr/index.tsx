'use client';

import { SWRConfig } from 'swr';

export const SWRProvider = ({ children, value }: React.PropsWithChildren<React.ComponentProps<typeof SWRConfig>>) => {
  return (
    <SWRConfig value={{ revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: true, ...value }}>
      {children}
    </SWRConfig>
  );
};
