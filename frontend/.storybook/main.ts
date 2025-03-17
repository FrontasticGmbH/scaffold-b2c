import type { StorybookConfig } from '@storybook/nextjs';
import webpack from 'webpack';

const config: StorybookConfig = {
  stories: ['./docs/**/*.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    'storybook-next-intl',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: process.env.NODE_ENV === 'development' ? ['../public/'] : [],
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    NEXT_PUBLIC_ALGOLIA_APPLICATION_ID: process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID || '',
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
  }),
  webpackFinal(config) {
    /* Aliases */
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};

    (config.resolve.alias as { [index: string]: string })['next/navigation'] =
      require.resolve('../__mocks__/next/navigation');

    /* Plugins */
    if (!config.plugins) config.plugins = [];

    return config;
  },
};

export default config;
