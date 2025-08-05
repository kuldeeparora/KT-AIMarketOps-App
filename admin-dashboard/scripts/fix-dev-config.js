const fs = require('fs');

console.log('�� Fixing development configuration...');

// Create development config
const devConfig = `/** @type {import('next').NextConfig} */
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

module.exports = nextConfig;`;

// Create Firebase config
const firebaseConfig = `/** @type {import('next').NextConfig} */
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
  experimental: {
    appDir: false
  }
};

module.exports = nextConfig;`;

// Write the configs
fs.writeFileSync('next.config.dev.js', devConfig);
fs.writeFileSync('next.config.firebase.js', firebaseConfig);

// Update main config for development
fs.writeFileSync('next.config.js', devConfig);

console.log('✅ Fixed development configuration!');
console.log('📋 Now you can run:');
console.log('- npm run dev (for development)');
console.log('- npm run build:firebase (for Firebase deployment)');
console.log('- npm run build:vercel (for Vercel deployment)'); 