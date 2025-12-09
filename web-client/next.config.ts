import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['avatars.githubusercontent.com', 'thumbs.dreamstime.com'], // thêm domain avatar GitHub
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://localhost:1000/api/v1/:path*',
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
