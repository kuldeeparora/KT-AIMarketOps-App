const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploying KT-AIMarketOps-App to Vercel...');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { encoding: 'utf8' });
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
}

// Deploy to Vercel
try {
  console.log('🏗️ Building and deploying...');
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Vercel deployment completed!');
} catch (error) {
  console.error('❌ Vercel deployment failed:', error.message);
  process.exit(1);
} 