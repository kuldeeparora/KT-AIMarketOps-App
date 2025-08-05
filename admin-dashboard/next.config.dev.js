/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For development and Vercel deployment
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  }
};

module.exports = nextConfig; 