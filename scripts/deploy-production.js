const { execSync } = require('child_process');

console.log('🚀 Deploying KT-AIMarketOps to Production...');

async function deployToVercel() {
  console.log('📦 Deploying to Vercel...');
  try {
    execSync('cd admin-dashboard && npm run build:vercel', { stdio: 'inherit' });
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('✅ Vercel deployment completed!');
    return true;
  } catch (error) {
    console.error('❌ Vercel deployment failed:', error.message);
    return false;
  }
}

async function deployToFirebase() {
  console.log('🔥 Deploying to Firebase...');
  try {
    execSync('cd admin-dashboard && npm run build:firebase', { stdio: 'inherit' });
    execSync('cd admin-dashboard && firebase deploy', { stdio: 'inherit' });
    console.log('✅ Firebase deployment completed!');
    return true;
  } catch (error) {
    console.error('❌ Firebase deployment failed:', error.message);
    return false;
  }
}

async function main() {
  const platform = process.argv[2];
  
  switch (platform) {
    case 'vercel':
      await deployToVercel();
      break;
    case 'firebase':
      await deployToFirebase();
      break;
    case 'all':
      await deployToVercel();
      await deployToFirebase();
      break;
    default:
      console.log('Usage: node scripts/deploy-production.js [vercel|firebase|all]');
      process.exit(1);
  }
}

main().catch(console.error); 