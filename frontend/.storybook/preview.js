import { RouterContext } from 'next/dist/shared/lib/router-context';
import { sdk } from '../sdk';
import 'tailwindcss/tailwind.css';
import '../styles/app.css';
import 'react-loading-skeleton/dist/skeleton.css';
import theme from './theme';

export const parameters = {
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
  nextRouter: {
    Provider: RouterContext.Provider,
    locales: ['en_US', 'de_DE'],
    locale: 'en_US',
  },
  options: {
    storySort: {
      order: ['Style guide', 'Atoms', 'Molecules', 'Organisms', 'Pages', '*'],
    },
    showPanel: false,
  },
};

const StoryWrapper = ({ Story }) => {
  sdk.defaultConfigure('en');

  return (
    <div data-theme="default">
      <Story />
      <div id="react-modal-custom-portal" />
    </div>
  );
};

export const decorators = [(Story) => <StoryWrapper Story={Story} />];
