#!/usr/bin/env node

/**
 * 📊 Monitoring Script
 * Real-time monitoring for Kent Traders platform
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class PlatformMonitor {
  constructor() {
    this.endpoints = [
      { name: 'Homepage', url: 'https://kenttraders.co.uk' },
      { name: 'API Health', url: 'https://kenttraders.co.uk/api/health' },
      { name: 'Customer Portal', url: 'https://kenttraders.co.uk/account' },
      { name: 'Admin Dashboard', url: 'https://kenttraders.co.uk/admin' }
    ];
    this.metrics = {
      uptime: {},
      responseTime: {},
      errors: []
    };
  }

  async checkEndpoint(endpoint) {
    const startTime = Date.now();
    
    try {
      const response = await axios.get(endpoint.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Kent-Traders-Monitor/1.0'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: endpoint.name,
        url: endpoint.url,
        status: 'UP',
        statusCode: response.status,
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        name: endpoint.name,
        url: endpoint.url,
        status: 'DOWN',
        statusCode: error.response?.status || 0,
        responseTime,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async runHealthChecks() {
    console.log('🔍 Running health checks...');
    
    const results = await Promise.all(
      this.endpoints.map(endpoint => this.checkEndpoint(endpoint))
    );
    
    return results;
  }

  async checkPerformanceMetrics() {
    console.log('⚡ Checking performance metrics...');
    
    try {
      // Check Core Web Vitals using a simplified approach
      const response = await axios.get('https://kenttraders.co.uk', {
        timeout: 30000
      });
      
      // Basic performance indicators
      const metrics = {
        loadTime: response.headers['x-response-time'] || 'N/A',
        cacheHit: response.headers['x-cache'] || 'N/A',
        serverTiming: response.headers['server-timing'] || 'N/A',
        contentLength: response.headers['content-length'] || 0
      };
      
      return metrics;
    } catch (error) {
      console.error('Performance check failed:', error.message);
      return null;
    }
  }

  async checkSecurityHeaders() {
    console.log('🔒 Checking security headers...');
    
    try {
      const response = await axios.head('https://kenttraders.co.uk');
      const headers = response.headers;
      
      const securityChecks = {
        'Strict-Transport-Security': !!headers['strict-transport-security'],
        'Content-Security-Policy': !!headers['content-security-policy'],
        'X-Frame-Options': !!headers['x-frame-options'],
        'X-Content-Type-Options': !!headers['x-content-type-options'],
        'Referrer-Policy': !!headers['referrer-policy'],
        'Permissions-Policy': !!headers['permissions-policy']
      };
      
      return securityChecks;
    } catch (error) {
      console.error('Security check failed:', error.message);
      return null;
    }
  }

  generateReport(healthResults, performanceMetrics, securityHeaders) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalEndpoints: this.endpoints.length,
        upEndpoints: healthResults.filter(r => r.status === 'UP').length,
        downEndpoints: healthResults.filter(r => r.status === 'DOWN').length,
        avgResponseTime: healthResults.reduce((acc, r) => acc + r.responseTime, 0) / healthResults.length
      },
      healthChecks: healthResults,
      performance: performanceMetrics,
      security: securityHeaders
    };
    
    return report;
  }

  async saveReport(report) {
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const filename = `monitoring-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(logsDir, filename);
    
    // Append to daily log file
    let existingData = [];
    if (fs.existsSync(filepath)) {
      try {
        const fileContent = fs.readFileSync(filepath, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (error) {
        console.warn('Could not parse existing log file');
      }
    }
    
    existingData.push(report);
    
    fs.writeFileSync(filepath, JSON.stringify(existingData, null, 2));
    console.log(`📝 Report saved to ${filepath}`);
  }

  displayReport(report) {
    console.log('\n📊 MONITORING REPORT');
    console.log('===================');
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Endpoints: ${report.summary.upEndpoints}/${report.summary.totalEndpoints} UP`);
    console.log(`Avg Response Time: ${Math.round(report.summary.avgResponseTime)}ms\n`);
    
    // Health checks
    console.log('🔍 Health Checks:');
    report.healthChecks.forEach(check => {
      const status = check.status === 'UP' ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${check.statusCode} (${check.responseTime}ms)`);
      if (check.error) {
        console.log(`   Error: ${check.error}`);
      }
    });
    
    // Performance
    if (report.performance) {
      console.log('\n⚡ Performance:');
      Object.entries(report.performance).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
    
    // Security
    if (report.security) {
      console.log('\n🔒 Security Headers:');
      Object.entries(report.security).forEach(([header, present]) => {
        const status = present ? '✅' : '❌';
        console.log(`${status} ${header}`);
      });
    }
    
    // Overall status
    console.log('\n🎯 Overall Status:');
    if (report.summary.downEndpoints === 0) {
      console.log('✅ All systems operational');
    } else {
      console.log(`❌ ${report.summary.downEndpoints} endpoint(s) down`);
    }
  }

  async run() {
    console.log('🚀 Starting Kent Traders Platform Monitoring...\n');
    
    try {
      const [healthResults, performanceMetrics, securityHeaders] = await Promise.all([
        this.runHealthChecks(),
        this.checkPerformanceMetrics(),
        this.checkSecurityHeaders()
      ]);
      
      const report = this.generateReport(healthResults, performanceMetrics, securityHeaders);
      
      this.displayReport(report);
      await this.saveReport(report);
      
      // Exit with error code if any endpoints are down
      process.exit(report.summary.downEndpoints > 0 ? 1 : 0);
      
    } catch (error) {
      console.error('❌ Monitoring failed:', error.message);
      process.exit(1);
    }
  }
}

// Run monitoring if called directly
if (require.main === module) {
  const monitor = new PlatformMonitor();
  monitor.run();
}

module.exports = PlatformMonitor;
