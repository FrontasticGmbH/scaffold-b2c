import extensions from '../demo-docs';

import { DataSourceContext } from '@frontastic/extension-types';

const DynamicPageHandler = extensions['dynamic-page-handler'];

test('Get by query path', async () => {
  const response = await DynamicPageHandler(
    { method: 'GET', path: '/', query: { path: '/foo-handler' }, headers: {} },
    {} as DataSourceContext,
  );

  expect(response).toStrictEqual({
    dynamicPageType: 'frontastic/foo-handler',
    dataSourcePayload: { foo: { result: 'test' } },
    pageMatchingPayload: { foo: { result: 'test' } },
  });
});

export {};
