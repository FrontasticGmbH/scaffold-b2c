import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import messages from '../../messages/en.json';

// Custom render function that wraps components in NextIntlClientProvider
const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
    options,
  );

// Re-export everything from React Testing Library
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// Override render method
// eslint-disable-next-line import/export
export { customRender as render };
