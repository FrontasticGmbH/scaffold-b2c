'use client';

import React, { createContext } from 'react';
import { useAccount } from 'frontastic';
import { UseAccountReturn } from 'frontastic/hooks/useAccount/types';

const AccountContext = createContext({} as UseAccountReturn);

const AccountProvider = ({ children }: React.PropsWithChildren) => {
  const accountReturn = useAccount();

  return <AccountContext.Provider value={accountReturn}>{children}</AccountContext.Provider>;
};

export { AccountContext, AccountProvider };
