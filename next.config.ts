const withNextIntl = require('next-intl/plugin')();
const withBundleAnalyzer = require('@next/bundle-analyzer')(
  {
    enabled: process.env.ANALYZE === 'true',
  }
);

module.exports = withBundleAnalyzer(withNextIntl());
