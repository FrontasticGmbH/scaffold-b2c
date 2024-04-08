import 'server-only';

import { cache } from 'react';
import { sdk } from 'sdk';

const fetchPreview = cache((previewId: string) => {
  return sdk.page.getPreview({ previewId: previewId as string });
});

export default fetchPreview;
