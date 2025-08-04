#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

async function runCommand(command, description) {
  return new Promise((resolve) => {
    console.log(`\n🔄 ${description}...`);
    
    const child = spawn(command, {
      shell: true,
      stdio: 'inherit'
  });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} completed successfully`);
        resolve(true);
      } else {
        console.log(`❌ ${description} failed with code ${code}`);
        resolve(false);
      }
    });
  });
}

async function deployWithTests() {
  const steps = [
    {
      command: 'npm run test:all',
      description: 'Running comprehensive environment tests'
  },
    {
      command: 'git add .',
      description: 'Staging changes'
  },
    {
      command: 'git status, --porcelain',
      description: 'Checking for changes'
  },
    {
      command: 'git commit -m "Auto-deploy with tests passed"',
      description: 'Committing changes'
  },
    {
      command: 'git push origin main',
      description: 'Pushing to production'
  }
  ];

  console.log('🚀 Starting deployment with tests...');
  
  // Run tests first
  const testResult = await runCommand(steps[0].command, steps[0].description);
  
  if (!testResult) {
    console.error('❌ Tests failed. Deployment aborted.');
    process.exit(1);
  }
  
  console.log('✅ All tests passed!');
  
  // Check if there are changes to commit
  const hasChanges = await runCommand(steps[2].command, steps[2].description);
  
  if (!hasChanges) {
    console.log('ℹ️  No changes to deploy');
    return;
  }
  
  // Run deployment steps
  for (let i = 1; i < steps.length; i++) {
    const step = steps[i];
    const success = await runCommand(step.command, step.description);
    
    if (!success) {
      console.error('❌ Deployment failed');
      process.exit(1);
    }
  }
  
  console.log('🎉 Deployment completed successfully!');
}

// Run the deployment
deployWithTests().catch(console.error); 