import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

async function installAIDependencies() {
  console.log('📦 Installing AI Dependencies...\n');

  try {
    // 1. Install dependencies in admin-dashboard
    console.log('🔧 Installing dependencies in admin-dashboard...');
    await execAsync('npm install', { cwd: process.cwd() });
    console.log('✅ admin-dashboard dependencies installed');

    // 2. Install dependencies in ai-insights package
    console.log('\n🔧 Installing dependencies in ai-insights package...');
    const aiInsightsPath = path.join(process.cwd(), '..', 'packages', 'ai-insights');
    
    if (fs.existsSync(aiInsightsPath)) {
      await execAsync('npm install', { cwd: aiInsightsPath });
      console.log('✅ ai-insights dependencies installed');
    } else {
      console.log('⚠️  ai-insights package not found');
    }

    // 3. Build ai-insights package
    console.log('\n🏗️  Building ai-insights package...');
    if (fs.existsSync(aiInsightsPath)) {
      await execAsync('npm run build', { cwd: aiInsightsPath });
      console.log('✅ ai-insights package built');
    }

    // 4. Install workspace dependencies
    console.log('\n🔧 Installing workspace dependencies...');
    await execAsync('npm install', { cwd: path.join(process.cwd(), '..') });
    console.log('✅ Workspace dependencies installed');

    console.log('\n🎉 AI Dependencies Installation Complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Test basic setup: npm run test:ai-basic');
    console.log('2. Set up environment: npm run ai:setup-env');
    console.log('3. Run full setup: npm run ai:setup');

  } catch (error) {
    console.error('❌ Failed to install AI dependencies:', error);
    process.exit(1);
  }
}

installAIDependencies().catch(console.error); 