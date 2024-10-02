import type { StorybookConfig } from '@storybook/nextjs';
import webpack from 'webpack';

const config: StorybookConfig = {
  stories: ['./docs/**/*.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
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
  webpackFinal(config) {
    /* Aliases */
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};

    (config.resolve.alias as { [index: string]: string })['next/navigation'] =
      require.resolve('../__mocks__/next/navigation');

    /* Plugins */
    if (!config.plugins) config.plugins = [];

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
      }),
    );

    return config;
  },
};

export default config;
