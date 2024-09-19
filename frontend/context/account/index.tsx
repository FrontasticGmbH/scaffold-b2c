import React, { createContext } from 'react';
import { useAccount } from 'frontastic';
import { UseAccountReturn } from 'frontastic/hooks/useAccount/types';

const AccountContext = createContext({
  requestPasswordReset: {} as UseAccountReturn['requestPasswordReset'],
} as UseAccountReturn);

const AccountProvider = ({ children }: React.PropsWithChildren) => {
  const { requestPasswordReset, ...accountReturn } = useAccount();

  return (
    <AccountContext.Provider value={{ requestPasswordReset, ...accountReturn }}>{children}</AccountContext.Provider>
  );
};

export { AccountContext, AccountProvider };
