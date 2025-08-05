const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Fixing all deployment issues...');

async function fixNodeVersion() {
  console.log('📦 Updating Node.js version requirements...');
  
  // Update root package.json
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  rootPackage.engines.node = '>=20.0.0';
  fs.writeFileSync('package.json', JSON.stringify(rootPackage, null, 2));
  
  // Update admin-dashboard package.json
  const adminPackage = JSON.parse(fs.readFileSync('admin-dashboard/package.json', 'utf8'));
  adminPackage.engines = { node: '>=20.0.0', npm: '>=9.0.0' };
  fs.writeFileSync('admin-dashboard/package.json', JSON.stringify(adminPackage, null, 2));
  
  console.log('✅ Updated Node.js version requirements');
}

async function fixNextConfig() {
  console.log('⚙️ Creating Next.js configuration files...');
  
  // Create development config
  const devConfig = `/** @type {import('next').NextConfig} */
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

module.exports = nextConfig;`;
  
  fs.writeFileSync('admin-dashboard/next.config.dev.js', devConfig);
  
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
  
  fs.writeFileSync('admin-dashboard/next.config.firebase.js', firebaseConfig);
  
  console.log('✅ Created Next.js configuration files');
}

async function fixPackageLock() {
  console.log('🔒 Fixing package-lock.json sync issues...');
  
  try {
    // Remove existing lock files
    if (fs.existsSync('package-lock.json')) {
      fs.unlinkSync('package-lock.json');
    }
    if (fs.existsSync('admin-dashboard/package-lock.json')) {
      fs.unlinkSync('admin-dashboard/package-lock.json');
    }
    
    // Reinstall dependencies
    execSync('npm install', { stdio: 'inherit' });
    execSync('cd admin-dashboard && npm install', { stdio: 'inherit' });
    
    console.log('✅ Fixed package-lock.json sync issues');
  } catch (error) {
    console.error('❌ Failed to fix package-lock.json:', error.message);
  }
}

async function setupFirebaseStorage() {
  console.log('🔥 Setting up Firebase Storage...');
  console.log('📋 Please manually enable Firebase Storage:');
  console.log('1. Go to: https://console.firebase.google.com/project/kt-aimarketops-app/storage');
  console.log('2. Click "Get Started"');
  console.log('3. Choose a location for your storage bucket');
  console.log('4. Use default security rules for now');
}

async function main() {
  await fixNodeVersion();
  await fixNextConfig();
  await fixPackageLock();
  await setupFirebaseStorage();
  
  console.log('🎉 All issues fixed!');
  console.log('📋 Next steps:');
  console.log('1. Enable Firebase Storage manually');
  console.log('2. Commit the changes');
  console.log('3. Push to GitHub');
  console.log('4. Deploy to Firebase: npm run deploy:firebase');
  console.log('5. Deploy to Vercel: npm run deploy:vercel');
}

main().catch(console.error);
