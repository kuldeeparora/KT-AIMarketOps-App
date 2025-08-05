const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Building for Vercel deployment...');

// Copy the Vercel-compatible config
const vercelConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For Vercel deployment (with API routes)
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  }
};

module.exports = nextConfig;`;

fs.writeFileSync('next.config.js', vercelConfig);
console.log('✅ Updated Next.js config for Vercel');

// Build the application
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully for Vercel');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 