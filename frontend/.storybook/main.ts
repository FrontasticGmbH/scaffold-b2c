import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../frontastic/**/*.stories.@(js|jsx|ts|tsx)',
    '../**/*.mdx',
    {
      directory: './docs',
      files: '*.mdx',
      titlePrefix: 'Documentation',
    },
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-docs', 'storybook-next-intl'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      builder: {
        viteConfigPath: undefined,
      },
    },
  },
  staticDirs: process.env.NODE_ENV === 'development' ? ['../public/'] : [],
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    NEXT_PUBLIC_ALGOLIA_APPLICATION_ID: process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID || '',
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
  },
  async viteFinal(config) {
    // Ensure resolve config exists
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Force our mocks to override any default Next.js imports
    // Using absolute paths to ensure Vite picks them up correctly
    const mockNavigationPath = path.resolve(__dirname, '../__mocks__/next/navigation.ts');

    config.resolve.alias = {
      'next/navigation$': mockNavigationPath,
      ...config.resolve.alias,
    };

    // Define globals for Next.js
    config.define = config.define || {};
    config.define['process.env.__NEXT_ROUTER_BASEPATH'] = JSON.stringify('');
    config.define['process.env.__NEXT_NEW_LINK_BEHAVIOR'] = JSON.stringify(true);
    config.define['process.env.__NEXT_HAS_REWRITES'] = JSON.stringify(false);

    // Optimize dependencies
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [...(config.optimizeDeps.include || []), 'next-intl'];
    config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
    config.optimizeDeps.exclude.push('next-intl/dist/esm/production/shared/NextIntlClientProvider.js');

    // Force rebuild on these files
    config.server = config.server || {};
    config.server.watch = config.server.watch || {};
    config.server.watch.ignored = config.server.watch.ignored || [];

    return config;
  },
};

export default config;
