import 'server-only';

import { cache } from 'react';
import { sdk } from 'sdk';
import getServerOptions from './get-server-options';

const fetchAccount = cache(() => {
  return sdk.composableCommerce.account.getAccount({ ...getServerOptions() });
});

export default fetchAccount;
