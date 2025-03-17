import 'server-only';

import { cache } from 'react';
import { sdk } from 'sdk';
import getServerOptions from './get-server-options';

const fetchProjectSettings = cache(async () => {
  return sdk.composableCommerce.project.getSettings({ ...(await getServerOptions()) });
});

export default fetchProjectSettings;
