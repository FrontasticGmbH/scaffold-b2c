import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.rackcdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3-eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.commercetools.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
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
      exclude: /flag-icons/,
      use: ['@svgr/webpack'],
    });

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

const withNextIntl = createNextIntlPlugin();
const plugins = [withBundleAnalyzer, withNextIntl];

const nextConfig = () => {
  return plugins.reduce((acc, plugin) => plugin(acc), config);
};

export default nextConfig;
