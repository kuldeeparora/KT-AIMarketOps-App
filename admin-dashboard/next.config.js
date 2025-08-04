/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Only enable static export when building for Firebase
  ...(process.env.BUILD_TARGET === 'firebase' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  }),
  experimental: {
    esmExternals: false,
    swcMinify: false
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config, { isServer, dev }) => {
    // Fix for webpack 5 and Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;