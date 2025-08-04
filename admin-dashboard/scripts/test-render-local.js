#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');



// Render environment simulation
const renderEnv = {
  NODE_ENV: 'production',
  PORT: '3001',
  RENDER: 'true',
  RENDER_EXTERNAL_URL: 'https://test-app.onrender.com',
  RENDER_SERVICE_ID: 'test-service-id',
  RENDER_SERVICE_NAME: 'test-service',
  RENDER_SERVICE_TYPE: 'web',
  RENDER_INSTANCE_ID: 'test-instance-id',
  RENDER_INSTANCE_TYPE: 'free',
  RENDER_INSTANCE_IP: '127.0.0.1',
  RENDER_INSTANCE_PORT: '3001',
  RENDER_INSTANCE_REGION: 'us-east-1',
  RENDER_INSTANCE_CPU: '0.1',
  RENDER_INSTANCE_MEMORY: '512MB',
  RENDER_INSTANCE_DISK: '1GB',
  RENDER_INSTANCE_NETWORK: 'public',
  RENDER_INSTANCE_HTTPS: 'true',
  RENDER_INSTANCE_HTTP2: 'true',
  RENDER_INSTANCE_WEBSOCKET: 'true',
  RENDER_INSTANCE_GRACEFUL_SHUTDOWN: 'true',
  RENDER_INSTANCE_HEALTH_CHECK_PATH: '/health',
  RENDER_INSTANCE_HEALTH_CHECK_TIMEOUT: '30',
  RENDER_INSTANCE_HEALTH_CHECK_INTERVAL: '10',
  RENDER_INSTANCE_HEALTH_CHECK_THRESHOLD: '3',
  RENDER_INSTANCE_HEALTH_CHECK_UNHEALTHY_THRESHOLD: '2',
  RENDER_INSTANCE_HEALTH_CHECK_SUCCESS_CODES: '200,302',
  RENDER_INSTANCE_HEALTH_CHECK_FAILURE_CODES: '500,502,503,504',
  RENDER_INSTANCE_HEALTH_CHECK_METHOD: 'GET',
  RENDER_INSTANCE_HEALTH_CHECK_HEADERS: 'User-Agent: Render/1.0',
  RENDER_INSTANCE_HEALTH_CHECK_BODY: '',
  RENDER_INSTANCE_HEALTH_CHECK_FOLLOW_REDIRECTS: 'true',
  RENDER_INSTANCE_HEALTH_CHECK_TIMEOUT_SECONDS: '5',
  RENDER_INSTANCE_HEALTH_CHECK_INTERVAL_SECONDS: '10',
  RENDER_INSTANCE_HEALTH_CHECK_THRESHOLD_COUNT: '3',
  RENDER_INSTANCE_HEALTH_CHECK_UNHEALTHY_THRESHOLD_COUNT: '2',
  RENDER_INSTANCE_HEALTH_CHECK_SUCCESS_CODE_RANGE: '200-299',
  RENDER_INSTANCE_HEALTH_CHECK_FAILURE_CODE_RANGE: '500-599',
  RENDER_INSTANCE_HEALTH_CHECK_METHOD_OVERRIDE: 'GET',
  RENDER_INSTANCE_HEALTH_CHECK_HEADERS_OVERRIDE: 'User-Agent: Render/1.0',
  RENDER_INSTANCE_HEALTH_CHECK_BODY_OVERRIDE: '',
  RENDER_INSTANCE_HEALTH_CHECK_FOLLOW_REDIRECTS_OVERRIDE: 'true',
  RENDER_INSTANCE_HEALTH_CHECK_TIMEOUT_SECONDS_OVERRIDE: '5',
  RENDER_INSTANCE_HEALTH_CHECK_INTERVAL_SECONDS_OVERRIDE: '10',
  RENDER_INSTANCE_HEALTH_CHECK_THRESHOLD_COUNT_OVERRIDE: '3',
  RENDER_INSTANCE_HEALTH_CHECK_UNHEALTHY_THRESHOLD_COUNT_OVERRIDE: '2',
  RENDER_INSTANCE_HEALTH_CHECK_SUCCESS_CODE_RANGE_OVERRIDE: '200-299',
  RENDER_INSTANCE_HEALTH_CHECK_FAILURE_CODE_RANGE_OVERRIDE: '500-599'};

// Create Render environment file
const renderEnvContent = Object.entries(renderEnv)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync('admin-dashboard/.env.render', renderEnvContent);


// Render-specific tests
const renderTests = [
  {
    name: 'Build Script Test',
    command: 'cd admin-dashboard && npm ci --legacy-peer-deps',
    description: 'Test Render build process'},
  {
    name: 'Production Build Test',
    command: 'cd admin-dashboard && npm run build',
    description: 'Test production build'},
  {
    name: 'Start Script Test',
    command: 'cd admin-dashboard && npm start',
    description: 'Test Render start process',
    timeout: 15000},
  {
    name: 'Health Check Test',
    command: 'curl -s -I, http://localhost:3001',
    description: 'Test health check endpoint'},
  {
    name: 'API Response Test',
    command: 'curl -s, http://localhost:3001/api/test',
    description: 'Test API endpoints'},
  {
    name: 'Static Files Test',
    command: 'curl -s -I, http://localhost:3001/favicon.ico',
    description: 'Test static file serving'}];

async function runRenderTest(test) {
  return new Promise((resolve) => {
    
    
    
    const child = spawn(test.command, {
      shell: true,
      env: { ...process.env, ...renderEnv }
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

async function runRenderTests() {
  
  
  const results = [];
  
  for (const test of renderTests) {
    const result = await runRenderTest(test);
    results.push(result);
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 3000));
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
    fs.unlinkSync('admin-dashboard/.env.render');
    
  } catch (e) {
    // File might not exist, that's okay
  }
  
  return passed === total;
}

// Run Render tests
runRenderTests().catch(console.error); 