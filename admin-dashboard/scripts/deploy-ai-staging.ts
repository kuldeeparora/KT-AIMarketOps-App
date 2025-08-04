import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function deployAIStaging() {
  console.log('🚀 Deploying AI Infrastructure to Staging...\n');

  try {
    // 1. Setup AI Infrastructure
    console.log('📊 Setting up AI Infrastructure...');
    await execAsync('npm run ai:setup');
    console.log('✅ AI Infrastructure setup completed');

    // 2. Test AI Components
    console.log('\n🧪 Testing AI Components...');
    await execAsync('npm run test:ai-complete');
    console.log('✅ AI Components tested');

    // 3. Start AI Services
    console.log('\n🤖 Starting AI Services...');
    await execAsync('npm run ai:mcp');
    await execAsync('npm run ai:agent');
    console.log('✅ AI Services started');

    // 4. Build Application
    console.log('\n🏗️  Building Application...');
    await execAsync('npm run build');
    console.log('✅ Application built');

    // 5. Deploy to Staging
    console.log('\n🚀 Deploying to Staging...');
    await execAsync('npm run deploy:render');
    console.log('✅ Deployed to Render (Staging)');

    // 6. Run Post-Deployment Tests
    console.log('\n🔍 Running Post-Deployment Tests...');
    await execAsync('npm run test:ai-rag');
    await execAsync('npm run test:ai-agents');
    console.log('✅ Post-deployment tests completed');

    console.log('\n🎉 AI Deployment to Staging Completed Successfully!');
    console.log('\n📋 Deployment Summary:');
    console.log('✅ AI Infrastructure: Setup Complete');
    console.log('✅ AI Components: Tested');
    console.log('✅ AI Services: Running');
    console.log('✅ Application: Built & Deployed');
    console.log('✅ Post-Deployment: Verified');

  } catch (error) {
    console.error('❌ AI Deployment failed:', error);
    process.exit(1);
  }
}

deployAIStaging().catch(console.error); 