import 'server-only';

import { cache } from 'react';
import { sdk } from 'sdk';
import getServerOptions from './get-server-options';

const fetchAccount = cache(async () => {
  return sdk.composableCommerce.account.getAccount({ ...(await getServerOptions()) });
});

export default fetchAccount;
