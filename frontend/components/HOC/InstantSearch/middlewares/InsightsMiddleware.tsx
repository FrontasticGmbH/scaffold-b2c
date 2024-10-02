import { useContext, useEffect } from 'react';
import { Configure } from 'react-instantsearch';
import aa from 'search-insights';
import { v4 as uuidv4 } from 'uuid';
import { AccountContext } from 'context/account';
import { ANONYMOUS_USER_TOKEN } from 'helpers/constants/localStorage';

const InsightsMiddleware: React.FC = () => {
  const { account } = useContext(AccountContext);

  useEffect(() => {
    if (account?.accountId) aa('setAuthenticatedUserToken', account.accountId);
    else {
      const token = window.localStorage.getItem(ANONYMOUS_USER_TOKEN);

      if (token) aa('setUserToken', token);
      else {
        const randomToken = uuidv4();
        window.localStorage.setItem(ANONYMOUS_USER_TOKEN, randomToken);
        aa('setUserToken', randomToken);
      }
    }
  }, [account?.accountId]);

  return <Configure analytics clickAnalytics />;
};

export default InsightsMiddleware;
