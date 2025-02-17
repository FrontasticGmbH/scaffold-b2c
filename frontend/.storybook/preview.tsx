import type { Preview } from '@storybook/react';
import 'tailwindcss/tailwind.css';
import 'flag-icons/css/flag-icons.min.css';
import '../styles/app.css';
import 'react-loading-skeleton/dist/skeleton.css';
import theme from './theme';
import { sdk } from '../sdk';
import { AccountProvider } from '../context/account';
import ShipAndLanguageProvider from '../providers/ship-and-language';

const preview: Preview = {
  parameters: {
    docs: {
      theme: theme,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Style guide', 'Atoms', 'Molecules', 'Organisms', 'Pages', '*'],
      },
    },
  },

  decorators: [
    (Story, context) => {
      const { account } = context.parameters;
      sdk.defaultConfigure('en');
      return (
        <div data-theme="default">
          <ShipAndLanguageProvider>
            <AccountProvider value={{ account }}>
              <Story />
            </AccountProvider>
          </ShipAndLanguageProvider>
          <div id="react-modal-custom-portal" />
        </div>
      );
    },
  ],

  tags: ['autodocs'],
};

export default preview;
