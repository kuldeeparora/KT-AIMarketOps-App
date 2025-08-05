/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For development and Vercel deployment (with API routes)
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  }
};

module.exports = nextConfig;