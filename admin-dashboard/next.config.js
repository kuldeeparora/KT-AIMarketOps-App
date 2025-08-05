/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For Vercel deployment
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // For static export (if needed for Firebase)
  // output: 'export',
  // trailingSlash: true,
  // images: {
  //   unoptimized: true
  // }
};

module.exports = nextConfig;
