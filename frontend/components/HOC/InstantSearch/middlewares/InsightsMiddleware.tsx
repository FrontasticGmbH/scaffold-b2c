import { useContext, useEffect } from 'react';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import { Configure, useInstantSearch } from 'react-instantsearch-hooks-web';
import aa from 'search-insights';
import { v4 as uuidv4 } from 'uuid';
import { AccountContext } from 'context/account';
import { ANONYMOUS_USER_TOKEN, LAST_ALGOLIA_QUERY_ID } from 'helpers/constants/localStorage';

const InsightsMiddleware: React.FC = () => {
  const {
    addMiddlewares,
    results: { queryID },
  } = useInstantSearch();

  const { account } = useContext(AccountContext);

  useEffect(() => {
    const middleware = createInsightsMiddleware({
      insightsClient: aa,
      onEvent({ insightsMethod, payload }, insightsClient) {
        const isExcluded = ['Hits Viewed'].includes((payload as Record<string, string>).eventName);

        if (!insightsMethod || isExcluded) return;

        insightsClient(insightsMethod, payload as Record<string, string>);
      },
    });

    return addMiddlewares(middleware);
  }, [addMiddlewares]);

  useEffect(() => {
    if (account?.accountId) aa('setUserToken', account.accountId);
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

  useEffect(() => {
    if (queryID) window.localStorage.setItem(LAST_ALGOLIA_QUERY_ID, queryID);
  }, [queryID]);

  return (
    <>
      <Configure clickAnalytics={true} />
    </>
  );
};

export default InsightsMiddleware;
