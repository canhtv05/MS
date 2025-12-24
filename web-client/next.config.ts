import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
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
