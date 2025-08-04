#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');



// Production environment variables
const productionEnv = {
  NODE_ENV: 'production',
  NEXTAUTH_URL: 'http://localhost:3001',
  NEXTAUTH_SECRET: 'test-production-secret',
  USE_MOCK_SELLERDYNAMICS: 'false',
  SELLERDYNAMICS_URL: 'https://test-sellerdynamics.com',
  SELLERDYNAMICS_USERNAME: 'test-user',
  SELLERDYNAMICS_PASSWORD: 'test-pass',
  SHOPIFY_SHOP_NAME: 'test-shop',
  SHOPIFY_ACCESS_TOKEN: 'test-token',
  FIREBASE_PROJECT_ID: 'test-project',
  FIREBASE_PRIVATE_KEY: 'test-key',
  FIREBASE_CLIENT_EMAIL: 'test@test.com'};

// Create .env.production.local for testing
const envContent = Object.entries(productionEnv)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync('.env.production.local', envContent);


// Test functions
const tests = [
  {
    name: 'Build Test',
    command: 'npm run build',
    cwd: './admin-dashboard'},
  {
    name: 'Start Production Server',
    command: 'timeout 15s npm start',
    cwd: './admin-dashboard',
    timeout: 15000},
  {
    name: 'API Endpoint Test',
    command: 'curl -s, http://localhost:3001/api/test',
    cwd: './admin-dashboard'},
  {
    name: 'Authentication Test',
    command: 'curl -s, http://localhost:3001/api/auth/session',
    cwd: './admin-dashboard'},
  {
    name: 'Main Page Test',
    command: 'curl -s -I, http://localhost:3001',
    cwd: './admin-dashboard'}];

async function runTest(test) {
  return new Promise((resolve) => {
    
    
    const child = spawn(test.command, {
      shell: true,
      cwd: test.cwd,
      env: { ...process.env, ...productionEnv }
    });

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        
        if (output.trim()) {
          
        }
      } else {
        
        if (error.trim()) {
          
        }
      }
      resolve({ name: test.name, passed: code === 0, output, error });
    });

    if (test.timeout) {
      setTimeout(() => {
        child.kill();
        
        resolve({ name: test.name, passed: false, output, error: 'Timeout' });}, test.timeout);
    }
  });
}

async function runAllTests() {
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  
  
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
  });
  
  
  
  if (passed === total) {
    
  } else {
    
  }
  
  // Cleanup
  try {
    fs.unlinkSync('.env.production.local');
    
  } catch (e) {
    // File might not exist, that's okay
  }
}

// Run the tests
runAllTests().catch(console.error); 