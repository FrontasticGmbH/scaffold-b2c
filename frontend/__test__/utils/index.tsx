import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
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
export * from '@testing-library/react';

// Override render method
export { customRender as render };
