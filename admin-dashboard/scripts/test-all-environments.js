#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

function killPort3001() {
  return new Promise((resolve) => {
    const child = spawn('lsof -ti:3001 | xargs kill -9', { shell: true });
    child.on('close', () => resolve());
  });
}

const environments = {
  development: {
    name: 'Development',
    env: {
    NODE_ENV: 'development',
      NEXTAUTH_URL: 'http://localhost:3001',
      NEXTAUTH_SECRET: 'dev-secret'
  }
  },
  production: {
    name: 'Production (Vercel)',
    env: {
    NODE_ENV: 'production',
      NEXTAUTH_URL: 'https://kent-traders.vercel.app',
      NEXTAUTH_SECRET: 'prod-secret'
  }
  },
  render: {
    name: 'Render',
    env: {
    NODE_ENV: 'production',
      PORT: '3001',
      RENDER: 'true',
      RENDER_EXTERNAL_URL: 'https://kent-traders.onrender.com'
  }
  },
  firebase: {
    name: 'Firebase',
    env: {
    NODE_ENV: 'production',
      FIREBASE_PROJECT_ID: 'test-project',
      FIREBASE_PRIVATE_KEY: 'test-key',
      FIREBASE_CLIENT_EMAIL: 'test@test.com'
  }
  }
};

// Test suites
const testSuites = [
  {
    name: 'Build Test',
    command: 'npm run build',
    description: 'Test application build process'
  },
  {
    name: 'Start Test',
    command: 'timeout 15s npm start',
    description: 'Test application startup',
    timeout: 15000
  },
  {
    name: 'API Test',
    command: 'curl -s http://localhost:3001/api/test',
    description: 'Test API endpoints'
  },
  {
    name: 'Auth Test',
    command: 'curl -s http://localhost:3001/api/auth/session',
    description: 'Test authentication endpoints'
  },
  {
    name: 'Page Test',
    command: 'curl -s -I http://localhost:3001',
    description: 'Test main page loading'
  },
  {
    name: 'Static Files Test',
    command: 'curl -s -I http://localhost:3001/favicon.ico',
    description: 'Test static file serving'
  }
];

async function runTestSuite(environment, testSuite) {
  return new Promise((resolve) => {
    console.log(`\n🔄 Running ${testSuite.name} on ${environment.name}...`);
    
    const child = spawn(testSuite.command, {
      shell: true,
      cwd: './admin-dashboard',
      env: { ...process.env, ...environment.env }
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
      const passed = code === 0;
      const status = passed ? '✅ PASS' : '❌ FAIL';
      
      console.log(`${status} ${testSuite.name} on ${environment.name}`);
      
      if (!passed && error.trim()) {
        console.error(`Error: ${error}`);
      }
      
      resolve({
        environment: environment.name,
        test: testSuite.name,
        passed,
        output,
        error
      });
    });
  });
}

async function runEnvironmentTests(environment) {
  console.log(`\n🚀 Testing ${environment.name} environment...`);
  
  const results = [];
  for (const testSuite of testSuites) {
    const result = await runTestSuite(environment, testSuite);
    results.push(result);
  }
  
  return results;
}

async function runAllEnvironmentTests() {
  console.log('🧪 Starting comprehensive environment tests...\n');
  
  const allResults = [];
  
  for (const [envName, environment] of Object.entries(environments)) {
    const results = await runEnvironmentTests(environment);
    allResults.push(...results);
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  const passed = allResults.filter(r => r.passed).length;
  const total = allResults.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed!');
    process.exit(1);
  }
}

// Clean up and run tests
killPort3001().then(() => {
  runAllEnvironmentTests();
}); 