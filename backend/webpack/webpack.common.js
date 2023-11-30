var path = require('path');

module.exports = {
  target: 'node',
  entry: {
    app: './index.ts',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: [path.resolve(__dirname, './jest.setup.ts'), path.resolve(__dirname, './jest.config.ts')],
      },
      {
        test: /\.(mjs|js|esm|cjs)$/,
        loader: 'babel-loader',
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
      {
        test: /\.test.ts$/,
        loader: 'ignore-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.json', '.ts', '.js'],
    alias: {
      '@Types': path.resolve(__dirname, '../../types'),
      '@Commerce-commercetools': path.resolve(__dirname, '../commerce-commercetools'),
      '@Payment-adyen': path.resolve(__dirname, '../payment-adyen'),
      '@Content-contentful': path.resolve(__dirname, '../content-contentful'),
      '@Content-amplience': path.resolve(__dirname, '../content-amplience'),
      '@Content-dynamicyield': path.resolve(__dirname, '../content-dynamicyield'),
      '@Content-contentstack': path.resolve(__dirname, '../content-contentstack'),
      '@Content-bloomreach': path.resolve(__dirname, '../content-bloomreach'),
      '@Content-nosto': path.resolve(__dirname, '../content-nosto'),
      '@Promotion-talon-one': path.resolve(__dirname, '../promotion-talon-one'),
    },
  },
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, '../build'),
    library: 'extensions',
    libraryTarget: 'umd',
  },
};
