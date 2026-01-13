import type { Preview } from '@storybook/nextjs';
import 'tailwindcss/tailwind.css';
import 'flag-icons/css/flag-icons.min.css';
import '../styles/app.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import theme from './theme';
import { sdk } from '../sdk';
import { AccountProvider } from '../context/account';
import ShipAndLanguageProvider from '../providers/ship-and-language';
import nextIntl from './next-intl';

const preview: Preview = {
  initialGlobals: {
    locale: 'en',
    locales: {
      en: 'English',
      de: 'German',
    },
  },
  parameters: {
    nextIntl,
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/en',
        query: {},
      },
      router: {
        basePath: '',
        pathname: '/en',
        route: '/[locale]',
        query: { locale: 'en' },
        asPath: '/en',
        push: async () => true,
        replace: async () => true,
        reload: () => {},
        back: () => {},
        forward: () => {},
        prefetch: async () => {},
        beforePopState: () => {},
        events: {
          on: () => {},
          off: () => {},
          emit: () => {},
        },
        isFallback: false,
        isLocaleDomain: false,
        isReady: true,
        isPreview: false,
      },
    },
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
        order: ['Introduction', 'Accessibility', 'Style guide', 'Atoms', 'Molecules', 'Organisms', 'Pages', '*'],
      },
    },
  },

  decorators: [
    (Story) => {
      sdk.defaultConfigure('en');
      return (
        <div data-theme="default">
          <ShipAndLanguageProvider>
            <AccountProvider>
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
