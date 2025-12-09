import type { NextConfig } from 'next';
import { API_BACKEND_URL, API_FRONTEND_URL } from './configs/endpoints';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['avatars.githubusercontent.com', 'thumbs.dreamstime.com'], // thêm domain avatar GitHub
  },
  async rewrites() {
    return [
      {
        source: `${API_FRONTEND_URL}/:path*`,
        destination: `${API_BACKEND_URL}/:path*`,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
