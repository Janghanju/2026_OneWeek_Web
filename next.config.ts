import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/register',
        destination: `${process.env.BACKEND_URL || 'http://backend:3001'}/auth/register`,
      },
      {
        source: '/api/:path((?!auth).*)',
        destination: `${process.env.BACKEND_URL || 'http://backend:3001'}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
