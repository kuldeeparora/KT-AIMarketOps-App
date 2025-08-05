/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For Firebase static hosting
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // For Vercel deployment (comment out the above and use this)
  // output: 'standalone',
  // experimental: {
  //   outputFileTracingRoot: undefined,
  // }
};

module.exports = nextConfig;
