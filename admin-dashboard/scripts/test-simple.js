#!/usr/bin/env node

const { spawn } = require('child_process');




async function runSimpleTest() {
  return new Promise((resolve) => {
    
    
    const child = spawn('npm run build', {
      shell: true,
      cwd: './admin-dashboard',
      stdio: 'inherit'});

    child.on('close', (code) => {
      if (code === 0) {
        
        resolve(true);
      } else {
        
        resolve(false);
      }
    });
  });
}

async function runAllSimpleTests() {
  
  
  const buildResult = await runSimpleTest();
  
  
  
  
  
  if (buildResult) {
    
  } else {
    
  }
}

runAllSimpleTests().catch(console.error); 