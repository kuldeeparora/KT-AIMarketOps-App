#!/usr/bin/env node

/**
 * Security Check Script
 * Comprehensive security audit for the platform
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log('🔒 Running Security Audit...');
console.log('=============================');

let totalIssues = 0;
const issues = {
  sensitive: [],
  secrets: [],
  permissions: [],
  environment: [],
  https: [],
  headers: []
};

// Check for sensitive files
function checkSensitiveFiles() {
  console.log('🔍 Checking for sensitive files...');
  
  if (fs.existsSync('.env')) {
    try {
      const envContent = fs.readFileSync('.env', 'utf8');
      if (envContent.includes('sk-') || envContent.includes('pk_')) {
        issues.sensitive.push('.env contains API keys');
      }
    } catch (error) {
      console.warn('Could not read .env file');
    }
  }
  
  // Check for other sensitive files
  const sensitivePatterns = ['.key', '.pem', '.p12', '.pfx'];
  sensitivePatterns.forEach(pattern => {
    try {
      const files = execSync(`find . -name "*${pattern}" -not -path "./node_modules/*" 2>/dev/null || true`, { encoding: 'utf8' });
      if (files.trim()) {
        issues.sensitive.push(`Sensitive files found: ${pattern}`);
      }
    } catch (error) {
      // Ignore errors
    }
  });
}

// Check for hardcoded secrets
function checkHardcodedSecrets() {
  console.log('🔍 Scanning for hardcoded secrets...');
  
  const secretPatterns = [
    { pattern: 'sk-[a-zA-Z0-9]{32,}', name: 'API keys' },
    { pattern: 'pk_[a-zA-Z0-9]{32,}', name: 'Public keys' },
    { pattern: 'password\\s*[=:]\\s*["\'][^"\']{8,}', name: 'Passwords' },
    { pattern: 'secret\\s*[=:]\\s*["\'][^"\']{8,}', name: 'Secrets' }
  ];
  
  secretPatterns.forEach(({ pattern, name }) => {
    try {
      const result = execSync(`grep -r "${pattern}" --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" . 2>/dev/null | grep -v node_modules | grep -v .git || true`, { encoding: 'utf8' });
      if (result.trim()) {
        issues.secrets.push(`Potential ${name} found in code`);
      }
    } catch (error) {
      // Ignore errors
    }
  });
}

// Check npm dependencies
function checkDependencies() {
  console.log('🔍 Checking npm dependencies...');
  
  try {
    execSync('npm audit --audit-level moderate', { stdio: 'pipe' });
    console.log(`${colors.green}✅ No npm vulnerabilities found${colors.reset}`);
  } catch (error) {
    issues.secrets.push('npm audit found vulnerabilities');
    console.log(`${colors.red}❌ npm audit found vulnerabilities${colors.reset}`);
  }
}

// Check environment configuration
function checkEnvironment() {
  console.log('🔍 Checking environment configuration...');
  
  if (!fs.existsSync('.env.example')) {
    issues.environment.push('Missing .env.example file');
  }
  
  if (fs.existsSync('.env') && fs.existsSync('.env.example')) {
    try {
      const envExample = fs.readFileSync('.env.example', 'utf8');
      const env = fs.readFileSync('.env', 'utf8');
      
      const exampleVars = envExample
        .split('\n')
        .filter(line => line.includes('=') && !line.startsWith('#'))
        .map(line => line.split('=')[0]);
      
      exampleVars.forEach(varName => {
        if (!env.includes(`${varName}=`)) {
          issues.environment.push(`Missing environment variable: ${varName}`);
        }
      });
    } catch (error) {
      issues.environment.push('Could not validate environment variables');
    }
  }
}

// Check HTTPS configuration
function checkHTTPS() {
  console.log('🔍 Checking HTTPS configuration...');
  
  try {
    const result = execSync(`grep -r "http://" --include="*.js" --include="*.ts" . 2>/dev/null | grep -v localhost | grep -v 127.0.0.1 | grep -v node_modules || true`, { encoding: 'utf8' });
    if (result.trim()) {
      issues.https.push('HTTP URLs found in production code');
    }
  } catch (error) {
    // Ignore errors
  }
}

// Check security headers
function checkSecurityHeaders() {
  console.log('🔍 Checking security headers...');
  
  if (fs.existsSync('app.js')) {
    try {
      const appContent = fs.readFileSync('app.js', 'utf8');
      if (!appContent.includes('helmet')) {
        issues.headers.push('Missing Helmet.js security middleware');
      }
      if (!appContent.includes('cors')) {
        issues.headers.push('Missing CORS configuration');
      }
    } catch (error) {
      issues.headers.push('Could not analyze app.js');
    }
  }
}

// Run all checks
function runSecurityAudit() {
  checkSensitiveFiles();
  checkHardcodedSecrets();
  checkDependencies();
  checkEnvironment();
  checkHTTPS();
  checkSecurityHeaders();
  
  // Calculate total issues
  Object.values(issues).forEach(issueArray => {
    totalIssues += issueArray.length;
  });
  
  // Display summary
  console.log('\n📊 SECURITY AUDIT SUMMARY');
  console.log('=========================');
  
  Object.entries(issues).forEach(([category, issueList]) => {
    if (issueList.length > 0) {
      const categoryNames = {
        sensitive: 'Sensitive Files',
        secrets: 'Hardcoded Secrets',
        permissions: 'File Permissions',
        environment: 'Environment Configuration',
        https: 'HTTPS Configuration',
        headers: 'Security Headers'
      };
      
      console.log(`${colors.red}❌ ${categoryNames[category]} Issues:${colors.reset}`);
      issueList.forEach(issue => console.log(`  - ${issue}`));
    }
  });
  
  console.log('');
  if (totalIssues === 0) {
    console.log(`${colors.green}🎉 SECURITY AUDIT PASSED - No issues found!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}🚨 SECURITY AUDIT FAILED - ${totalIssues} issues found${colors.reset}`);
    console.log('\n🔧 Recommended Actions:');
    console.log('1. Review and fix all security issues above');
    console.log('2. Use environment variables for all secrets');
    console.log('3. Implement proper security headers');
    console.log('4. Regular dependency updates');
    console.log('5. Enable automatic security scanning');
    process.exit(1);
  }
}

// Run the audit
runSecurityAudit();
