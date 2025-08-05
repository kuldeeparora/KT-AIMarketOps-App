#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`\n🔄 ${description}...`, 'blue');
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    log(`✅ ${description} completed successfully`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return false;
  }
}

async function preDeploymentChecks() {
  log('\n🔍 Running pre-deployment checks...', 'cyan');
  
  // Check if required files exist
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'pages/api/health.js',
    'vercel.json',
    'render.yaml',
    'firebase.json'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      log(`❌ Missing required file: ${file}`, 'red');
      return false;
    }
  }
  
  // Check environment variables
  const requiredEnvVars = [
    'SELLERDYNAMICS_API_URL',
    'SELLERDYNAMICS_API_KEY',
    'SHOPIFY_SHOP',
    'SHOPIFY_ACCESS_TOKEN'
  ];
  
  log('\n📋 Environment variables check:', 'yellow');
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      log(`✅ ${envVar}: configured`, 'green');
    } else {
      log(`⚠️  ${envVar}: not set (will need to be configured on deployment platforms)`, 'yellow');
    }
  }
  
  return true;
}

async function runTests() {
  log('\n🧪 Running tests...', 'cyan');
  
  // Build the application first
  if (!execCommand('npm run build', 'Building application')) {
    return false;
  }
  
  // Test health endpoint
  log('\n🏥 Testing health endpoint...', 'blue');
  try {
    const { spawn } = require('child_process');
    
    // Start the server in background
    const server = spawn('npm', ['start'], { detached: true });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test health endpoint
    const fetch = require('node-fetch');
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();
    
    if (data.success) {
      log('✅ Health check passed', 'green');
    } else {
      log('❌ Health check failed', 'red');
      return false;
    }
    
    // Kill the server
    process.kill(-server.pid);
    
  } catch (error) {
    log(`❌ Health check test failed: ${error.message}`, 'red');
    return false;
  }
  
  return true;
}

async function deployToVercel() {
  log('\n🚀 Deploying to Vercel...', 'magenta');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { encoding: 'utf8' });
  } catch (error) {
    log('📦 Installing Vercel CLI...', 'blue');
    if (!execCommand('npm install -g vercel', 'Installing Vercel CLI')) {
      return false;
    }
  }
  
  // Deploy to Vercel
  if (!execCommand('vercel --prod --yes', 'Deploying to Vercel')) {
    return false;
  }
  
  log('✅ Vercel deployment completed!', 'green');
  return true;
}

async function deployToRender() {
  log('\n🚀 Deploying to Render...', 'magenta');
  
  log('📋 Render deployment instructions:', 'yellow');
  log('1. Push your code to GitHub/GitLab', 'yellow');
  log('2. Connect your repository to Render', 'yellow');
  log('3. Use the render.yaml configuration file', 'yellow');
  log('4. Set up environment variables in Render dashboard', 'yellow');
  log('5. Deploy automatically via git push', 'yellow');
  
  log('✅ Render configuration ready (manual deployment required)', 'green');
  return true;
}

async function deployToFirebase() {
  log('\n🚀 Deploying to Firebase (KT-AIMarketOps-App)...', 'magenta');
  
  // Check if Firebase CLI is installed
  try {
    execSync('firebase --version', { encoding: 'utf8' });
  } catch (error) {
    log('📦 Installing Firebase CLI...', 'blue');
    if (!execCommand('npm install -g firebase-tools', 'Installing Firebase CLI')) {
      return false;
    }
  }
  
  // Build for static export (Firebase Hosting)
  log('🏗️ Building for Firebase...', 'blue');
  
  // Update next.config.js for static export
  const nextConfigPath = 'next.config.js';
  const originalConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  const staticConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    swcMinify: false
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;`;
  
  // Temporarily update config for static export
  fs.writeFileSync(nextConfigPath, staticConfig);
  
  try {
    // Build static export
    if (!execCommand('npm run build', 'Building static export for Firebase')) {
      return false;
    }
    
    // Deploy to Firebase
    if (!execCommand('firebase deploy', 'Deploying to Firebase')) {
      return false;
    }
    
    log('✅ Firebase deployment completed for KT-AIMarketOps-App!', 'green');
    return true;
    
  } finally {
    // Restore original config
    fs.writeFileSync(nextConfigPath, originalConfig);
  }
}

async function main() {
  log('🚀 AIMarketOps Multi-Platform Deployment Script', 'cyan');
  log('=====================================', 'cyan');
  
  // Pre-deployment checks
  if (!(await preDeploymentChecks())) {
    log('\n❌ Pre-deployment checks failed. Please fix the issues and try again.', 'red');
    process.exit(1);
  }
  
  // Run tests
  if (!(await runTests())) {
    log('\n❌ Tests failed. Please fix the issues and try again.', 'red');
    process.exit(1);
  }
  
  log('\n✅ All pre-deployment checks passed!', 'green');
  
  // Ask user which platforms to deploy to
  const platforms = process.argv.slice(2);
  
  if (platforms.length === 0) {
    log('\n📋 Usage: npm run deploy:all [vercel] [render] [firebase]', 'yellow');
    log('Example: npm run deploy:all vercel firebase', 'yellow');
    process.exit(0);
  }
  
  let allSuccess = true;
  
  // Deploy to specified platforms
  for (const platform of platforms) {
    switch (platform.toLowerCase()) {
      case 'vercel':
        if (!(await deployToVercel())) allSuccess = false;
        break;
      case 'render':
        if (!(await deployToRender())) allSuccess = false;
        break;
      case 'firebase':
        if (!(await deployToFirebase())) allSuccess = false;
        break;
      default:
        log(`❌ Unknown platform: ${platform}`, 'red');
        allSuccess = false;
    }
  }
  
  if (allSuccess) {
    log('\n🎉 All deployments completed successfully!', 'green');
    log('\n📋 Post-deployment checklist:', 'cyan');
    log('1. Test all deployed URLs', 'yellow');
    log('2. Verify environment variables are set correctly', 'yellow');
    log('3. Check API endpoints are working', 'yellow');
    log('4. Monitor application logs for any issues', 'yellow');
  } else {
    log('\n❌ Some deployments failed. Please check the logs and try again.', 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    log(`❌ Deployment script failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { deployToVercel, deployToRender, deployToFirebase }; 