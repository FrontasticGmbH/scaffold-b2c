import React, { createContext } from 'react';
import { UseAccountReturn } from 'frontastic/hooks/useAccount/types';

const AccountContext = createContext({} as UseAccountReturn);

const AccountProvider = ({ children, value }: React.PropsWithChildren<{ value: UseAccountReturn }>) => {
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export { AccountContext, AccountProvider };
