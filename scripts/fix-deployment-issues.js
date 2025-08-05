const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Fixing deployment issues...');

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

async function main() {
  await fixNodeVersion();
  await fixPackageLock();
  
  console.log('🎉 All deployment issues fixed!');
  console.log('📋 Next steps:');
  console.log('1. Commit the changes');
  console.log('2. Push to GitHub');
  console.log('3. Deploy to Firebase');
}

main().catch(console.error); 