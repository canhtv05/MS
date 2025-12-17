import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['avatars.githubusercontent.com', 'thumbs.dreamstime.com', 'images.unsplash.com'], // thêm domain avatar GitHub
  },
  async rewrites() {
    const apiBackendUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:1000/api/v1';
    const apiFrontendUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL || '/api/proxy';

    return [
      {
        source: `${apiFrontendUrl}/:path*`,
        destination: `${apiBackendUrl}/:path*`,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
