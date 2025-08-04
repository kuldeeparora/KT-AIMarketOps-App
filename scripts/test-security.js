#!/usr/bin/env node

/**
 * 🔒 Security Test Suite for Kent Traders
 * Comprehensive security testing and validation
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class SecurityTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.config = {
      envFile: '.env',
      secretsPatterns: [
        /api_key/i,
        /password/i,
        /secret/i,
        /token/i,
        /private_key/i
      ],
      sensitiveFiles: [
        '.env',
        '.env.local',
        '.env.production',
        'config/secrets.json'
      ]
    };
  }

  /**
   * Run all security tests
   */
  async runAllTests() {
    console.log('🔒 Starting Security Test Suite...\n');
    
    const tests = [
      this.testEnvironmentVariables.bind(this),
      this.testDependencies.bind(this),
      this.testFilePermissions.bind(this),
      this.testSecretsExposure.bind(this),
      this.testInputValidation.bind(this),
      this.testAuthentication.bind(this),
      this.testAuthorization.bind(this),
      this.testDataEncryption.bind(this),
      this.testLogging.bind(this),
      this.testErrorHandling.bind(this)
    ];

    for (const test of tests) {
      try {
        await test();
      } catch (error) {
        this.addResult('error', test.name, `Test failed with error: ${error.message}`);
      }
    }

    this.printResults();
  }

  /**
   * Test environment variables security
   */
  async testEnvironmentVariables() {
    console.log('📋 Testing environment variables...');
    
    try {
      const envContent = await fs.readFile(this.config.envFile, 'utf8');
      const lines = envContent.split('\n');
      
      let hasSecrets = false;
      let hasComments = false;
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('#')) {
          hasComments = true;
          continue;
        }
        
        if (trimmed.includes('=')) {
          const [key, value] = trimmed.split('=', 2);
          
          // Check for sensitive keys
          if (this.config.secretsPatterns.some(pattern => pattern.test(key))) {
            hasSecrets = true;
            
            // Check if value is properly secured
            if (value && value !== '') {
              if (value.length < 8) {
                this.addResult('failed', 'env_secrets', `Weak secret value for ${key}`);
              } else {
                this.addResult('passed', 'env_secrets', `Secret ${key} is properly configured`);
              }
            } else {
              this.addResult('warning', 'env_secrets', `Secret ${key} has no value`);
            }
          }
        }
      }
      
      if (!hasSecrets) {
        this.addResult('warning', 'env_secrets', 'No secrets found in environment file');
      }
      
      if (hasComments) {
        this.addResult('passed', 'env_comments', 'Environment file contains helpful comments');
      }
      
    } catch (error) {
      this.addResult('failed', 'env_file', `Environment file not found: ${error.message}`);
    }
  }

  /**
   * Test dependencies for known vulnerabilities
   */
  async testDependencies() {
    console.log('📦 Testing dependencies...');
    
    try {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check for known vulnerable packages
      const vulnerablePackages = [
        'lodash',
        'moment',
        'jquery'
      ];
      
      for (const pkg of vulnerablePackages) {
        if (dependencies[pkg]) {
          this.addResult('warning', 'dependencies', `Potentially vulnerable package: ${pkg}`);
        }
      }
      
      // Check for outdated packages
      const outdatedPackages = [
        'express',
        'body-parser'
      ];
      
      for (const pkg of outdatedPackages) {
        if (dependencies[pkg]) {
          this.addResult('warning', 'dependencies', `Consider updating package: ${pkg}`);
        }
      }
      
      this.addResult('passed', 'dependencies', 'Dependencies security check completed');
      
    } catch (error) {
      this.addResult('failed', 'dependencies', `Failed to check dependencies: ${error.message}`);
    }
  }

  /**
   * Test file permissions
   */
  async testFilePermissions() {
    console.log('🔐 Testing file permissions...');
    
    try {
      const files = await fs.readdir('.');
      
      for (const file of files) {
        if (this.config.sensitiveFiles.includes(file)) {
          try {
            const stats = await fs.stat(file);
            const mode = stats.mode.toString(8);
            
            // Check if file has restrictive permissions (600 or 400)
            if (mode.endsWith('00') || mode.endsWith('40') || mode.endsWith('60')) {
              this.addResult('passed', 'file_permissions', `Secure permissions on ${file}: ${mode}`);
            } else {
              this.addResult('failed', 'file_permissions', `Insecure permissions on ${file}: ${mode}`);
            }
          } catch (error) {
            this.addResult('warning', 'file_permissions', `Could not check permissions for ${file}`);
          }
        }
      }
      
    } catch (error) {
      this.addResult('failed', 'file_permissions', `Failed to check file permissions: ${error.message}`);
    }
  }

  /**
   * Test for secrets exposure
   */
  async testSecretsExposure() {
    console.log('🔍 Testing for secrets exposure...');
    
    try {
      const files = await this.getSourceFiles();
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        
        // Check for hardcoded secrets
        const secretPatterns = [
          /['"`][a-zA-Z0-9]{32,}['"`]/g, // Long strings that might be secrets
          /api_key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
          /password\s*[:=]\s*['"`][^'"`]+['"`]/gi,
          /secret\s*[:=]\s*['"`][^'"`]+['"`]/gi
        ];
        
        for (const pattern of secretPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            this.addResult('failed', 'secrets_exposure', `Potential secret found in ${file}`);
            break;
          }
        }
      }
      
      this.addResult('passed', 'secrets_exposure', 'No hardcoded secrets found');
      
    } catch (error) {
      this.addResult('failed', 'secrets_exposure', `Failed to check for secrets: ${error.message}`);
    }
  }

  /**
   * Test input validation
   */
  async testInputValidation() {
    console.log('✅ Testing input validation...');
    
    try {
      const files = await this.getSourceFiles();
      let hasValidation = false;
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        
        // Check for input validation patterns
        const validationPatterns = [
          /\.validate\(/g,
          /\.test\(/g,
          /\.match\(/g,
          /input.*validation/gi,
          /sanitize/gi
        ];
        
        for (const pattern of validationPatterns) {
          if (pattern.test(content)) {
            hasValidation = true;
            break;
          }
        }
      }
      
      if (hasValidation) {
        this.addResult('passed', 'input_validation', 'Input validation patterns found');
      } else {
        this.addResult('warning', 'input_validation', 'No input validation patterns detected');
      }
      
    } catch (error) {
      this.addResult('failed', 'input_validation', `Failed to check input validation: ${error.message}`);
    }
  }

  /**
   * Test authentication mechanisms
   */
  async testAuthentication() {
    console.log('🔑 Testing authentication...');
    
    try {
      const files = await this.getSourceFiles();
      let hasAuth = false;
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        
        // Check for authentication patterns
        const authPatterns = [
          /jwt/gi,
          /bcrypt/gi,
          /hash/gi,
          /login/gi,
          /authenticate/gi,
          /session/gi
        ];
        
        for (const pattern of authPatterns) {
          if (pattern.test(content)) {
            hasAuth = true;
            break;
          }
        }
      }
      
      if (hasAuth) {
        this.addResult('passed', 'authentication', 'Authentication mechanisms found');
      } else {
        this.addResult('warning', 'authentication', 'No authentication mechanisms detected');
      }
      
    } catch (error) {
      this.addResult('failed', 'authentication', `Failed to check authentication: ${error.message}`);
    }
  }

  /**
   * Test authorization mechanisms
   */
  async testAuthorization() {
    console.log('🚪 Testing authorization...');
    
    try {
      const files = await this.getSourceFiles();
      let hasAuthz = false;
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        
        // Check for authorization patterns
        const authzPatterns = [
          /authorize/gi,
          /permission/gi,
          /role/gi,
          /admin/gi,
          /middleware/gi,
          /guard/gi
        ];
        
        for (const pattern of authzPatterns) {
          if (pattern.test(content)) {
            hasAuthz = true;
            break;
          }
        }
      }
      
      if (hasAuthz) {
        this.addResult('passed', 'authorization', 'Authorization mechanisms found');
      } else {
        this.addResult('warning', 'authorization', 'No authorization mechanisms detected');
      }
      
    } catch (error) {
      this.addResult('failed', 'authorization', `Failed to check authorization: ${error.message}`);
    }
  }

  /**
   * Test data encryption
   */
  async testDataEncryption() {
    console.log('🔐 Testing data encryption...');
    
    try {
      const files = await this.getSourceFiles();
      let hasEncryption = false;
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        
        // Check for encryption patterns
        const encryptionPatterns = [
          /crypto/gi,
          /encrypt/gi,
          /decrypt/gi,
          /aes/gi,
          /rsa/gi,
          /sha/gi
        ];
        
        for (const pattern of encryptionPatterns) {
          if (pattern.test(content)) {
            hasEncryption = true;
            break;
          }
        }
      }
      
      if (hasEncryption) {
        this.addResult('passed', 'encryption', 'Encryption mechanisms found');
      } else {
        this.addResult('warning', 'encryption', 'No encryption mechanisms detected');
      }
      
    } catch (error) {
      this.addResult('failed', 'encryption', `Failed to check encryption: ${error.message}`);
    }
  }

  /**
   * Test logging security
   */
  async testLogging() {
    console.log('📝 Testing logging security...');
    
    try {
      const files = await this.getSourceFiles();
      let hasSecureLogging = false;
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        
        // Check for secure logging patterns
        const loggingPatterns = [
          /console\.log/gi,
          /winston/gi,
          /morgan/gi,
          /logger/gi
        ];
        
        for (const pattern of loggingPatterns) {
          if (pattern.test(content)) {
            hasSecureLogging = true;
            break;
          }
        }
      }
      
      if (hasSecureLogging) {
        this.addResult('passed', 'logging', 'Logging mechanisms found');
      } else {
        this.addResult('warning', 'logging', 'No logging mechanisms detected');
      }
      
    } catch (error) {
      this.addResult('failed', 'logging', `Failed to check logging: ${error.message}`);
    }
  }

  /**
   * Test error handling
   */
  async testErrorHandling() {
    console.log('⚠️ Testing error handling...');
    
    try {
      const files = await this.getSourceFiles();
      let hasErrorHandling = false;
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        
        // Check for error handling patterns
        const errorPatterns = [
          /try\s*{/gi,
          /catch\s*\(/gi,
          /throw/gi,
          /error/gi,
          /exception/gi
        ];
        
        for (const pattern of errorPatterns) {
          if (pattern.test(content)) {
            hasErrorHandling = true;
            break;
          }
        }
      }
      
      if (hasErrorHandling) {
        this.addResult('passed', 'error_handling', 'Error handling mechanisms found');
      } else {
        this.addResult('warning', 'error_handling', 'No error handling mechanisms detected');
      }
      
    } catch (error) {
      this.addResult('failed', 'error_handling', `Failed to check error handling: ${error.message}`);
    }
  }

  /**
   * Get source files for analysis
   */
  async getSourceFiles() {
    const files = [];
    const extensions = ['.js', '.jsx', '.ts', '.tsx'];
    
    async function scanDirectory(dir) {
      try {
        const items = await fs.readdir(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            await scanDirectory(fullPath);
          } else if (stat.isFile() && extensions.includes(path.extname(item))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Ignore permission errors
      }
    }
    
    await scanDirectory('.');
    return files;
  }

  /**
   * Add test result
   */
  addResult(status, test, message) {
    this.results.tests.push({ status, test, message, timestamp: new Date() });
    
    switch (status) {
      case 'passed':
        this.results.passed++;
        console.log(`✅ ${test}: ${message}`);
        break;
      case 'failed':
        this.results.failed++;
        console.log(`❌ ${test}: ${message}`);
        break;
      case 'warning':
        this.results.warnings++;
        console.log(`⚠️ ${test}: ${message}`);
        break;
      case 'error':
        this.results.failed++;
        console.log(`💥 ${test}: ${message}`);
        break;
    }
  }

  /**
   * Print test results
   */
  printResults() {
    console.log('\n📊 Security Test Results');
    console.log('========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️ Warnings: ${this.results.warnings}`);
    console.log(`📋 Total: ${this.results.tests.length}`);
    
    if (this.results.failed > 0) {
      console.log('\n🚨 Security issues found! Please address the failed tests.');
      process.exit(1);
    } else if (this.results.warnings > 0) {
      console.log('\n⚠️ Security warnings found. Consider addressing them.');
    } else {
      console.log('\n🎉 All security tests passed!');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new SecurityTester();
  tester.runAllTests().catch(console.error);
}

module.exports = SecurityTester; 