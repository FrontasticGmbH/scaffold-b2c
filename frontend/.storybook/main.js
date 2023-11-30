const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  stories: [
    '../components/**/*.stories.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../.storybook/**/*.stories.mdx',
    '../.storybook/**/*.stories.@(js|jsx|ts|tsx)',
    '../frontastic/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-next-router',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          // When using postCSS 8
          implementation: require('postcss'),
          postcssOptions: {
            plugins: {
              tailwindcss: {},
              autoprefixer: {},
            },
          },
        },
      },
    },
  ],
  typescript: { reactDocgen: false },
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.modules.push(path.resolve(__dirname, '..'));

    config.resolve.fallback = {
      fs: false,
      tls: false,
      net: false,
      module: false,
      http: false,
      crypto: false,
      zlib: false,
      stream: false,
      path: require.resolve('path-browserify'),
    };

    config.resolve.alias['next/navigation'] = require.resolve(
      path.resolve(__dirname, '../__mocks__/next/navigation/index.ts'),
    );

    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '..', 'tsconfig.json'),
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.mdx'],
      }),
    ];

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_FRONTASTIC_HOST': JSON.stringify(process.env.NEXT_PUBLIC_FRONTASTIC_HOST),
        'process.env.NEXT_PUBLIC_FRONTASTIC_API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_FRONTASTIC_API_KEY),
        'process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
        SITE_URL: JSON.stringify(process.env.SITE_URL),
        'process.env.NEXT_PUBLIC_TRACKING_ID': JSON.stringify(process.env.NEXT_PUBLIC_TRACKING_ID),
        'process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID': JSON.stringify(
          process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
        ),
        'process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY': JSON.stringify(
          process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
        ),
        'process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX': JSON.stringify(
          process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX,
        ),
      }),
    );
    config.module.rules.find((rule) => rule.test.toString() === '/\\.css$/').exclude = /\.module\.css$/;

    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
      ],
    });

    return config;
  },
};
