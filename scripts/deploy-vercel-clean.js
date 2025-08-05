const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploying KT-AIMarketOps to Vercel...');

async function cleanAndDeploy() {
  try {
    // Clean previous builds
    console.log('🧹 Cleaning previous builds...');
    if (fs.existsSync('admin-dashboard/.next')) {
      fs.rmSync('admin-dashboard/.next', { recursive: true, force: true });
    }
    if (fs.existsSync('admin-dashboard/out')) {
      fs.rmSync('admin-dashboard/out', { recursive: true, force: true });
    }
    
    // Build for Vercel
    console.log('��️ Building for Vercel...');
    execSync('cd admin-dashboard && npm run build:vercel', { stdio: 'inherit' });
    
    // Deploy to Vercel
    console.log('📦 Deploying to Vercel...');
    execSync('vercel --prod', { stdio: 'inherit' });
    
    console.log('✅ Vercel deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

cleanAndDeploy(); 