const path = require('path');

//PWA
const generateAppDirEntry = (entry) => {
  const packagePath = require.resolve('next-pwa');
  const packageDirectory = path.dirname(packagePath);
  const registerJs = path.join(packageDirectory, 'register.js');

  return entry().then((entries) => {
    // Register SW on App directory, solution: https://github.com/shadowwalker/next-pwa/pull/427
    if (entries['main-app'] && !entries['main-app'].includes(registerJs)) {
      if (Array.isArray(entries['main-app'])) {
        entries['main-app'].unshift(registerJs);
      } else if (typeof entries['main-app'] === 'string') {
        entries['main-app'] = [registerJs, entries['main-app']];
      }
    }
    return entries;
  });
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: ['app-build-manifest.json'],
});

// Bundle Analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  trailingSlash: true,

  images: {
    loader: 'custom',
    domains: ['res.cloudinary.com', 's3-eu-west-1.amazonaws.com'],
    deviceSizes: [
      640, 750, 828, 1080, 1200, 1280, 1440, 1520, 1640, 1720, 1800, 1920, 2048, 2280, 2460, 2640, 2820, 3000,
    ],
  },

  productionBrowserSourceMaps: true,

  env: {
    NEXT_PUBLIC_EXT_BUILD_ID:
      process.env.NEXT_PUBLIC_EXT_BUILD_ID ??
      JSON.stringify(process.env.NETLIFY ? process.env.COMMIT_REF.substring(0, 7) : 'staging'),
  },

  compiler: {
    reactRemoveProperties: isProd ? { properties: ['^data-test'] } : false,
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      exclude: /flag-icons/, // Exclude flag-icons
      use: ['@svgr/webpack'],
    });

    if (process.env.NODE_ENV !== 'development') {
      const entry = generateAppDirEntry(config.entry);
      config.entry = () => entry;
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/__preview/:path*', destination: '/preview/:path*' },
      { source: '/:locale/__preview/:path*', destination: '/:locale/preview/:path*' },
    ];
  },
  experimental: {
    appDir: true,
  },
};

module.exports = () => {
  const plugins = [withPWA, withBundleAnalyzer];

  return plugins.reduce((acc, plugin) => plugin(acc), config);
};
