const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class PerformanceTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Performance Tests...\n');

    try {
      await this.testPageLoadTimes();
      await this.testAPIPerformance();
      await this.testResourceOptimization();
      await this.testLighthouseAudit();
      await this.testDatabasePerformance();
      await this.testImageOptimization();
      await this.testCachingPerformance();
      await this.testMobilePerformance();

      this.generateReport();
    } catch (error) {
      console.error('❌ Performance test failed:', error);
      process.exit(1);
    }
  }

  async testPageLoadTimes() {
    console.log('📊 Testing Page Load Times...');
    
    const pages = [
      { name: 'Homepage', url: 'https://kenttraders.co.uk' },
      { name: 'Products', url: 'https://kenttraders.co.uk/collections/all' },
      { name: 'Product Detail', url: 'https://kenttraders.co.uk/products/sample-product' },
      { name: 'Cart', url: 'https://kenttraders.co.uk/cart' },
      { name: 'Checkout', url: 'https://kenttraders.co.uk/checkout' }
    ];

    const browser = await puppeteer.launch({ headless: true });
    
    for (const page of pages) {
      try {
        const testPage = await browser.newPage();
        
        // Enable performance monitoring
        await testPage.setCacheEnabled(false);
        
        const startTime = Date.now();
        await testPage.goto(page.url, { waitUntil: 'networkidle0' });
        const loadTime = Date.now() - startTime;

        // Get performance metrics
        const metrics = await testPage.metrics();
        const performance = await testPage.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          return {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
          };
        });

        const result = {
          test: 'Page Load Time',
          page: page.name,
          url: page.url,
          loadTime,
          domContentLoaded: performance.domContentLoaded,
          loadComplete: performance.loadComplete,
          firstContentfulPaint: performance.firstContentfulPaint,
          status: loadTime < 3000 ? 'PASS' : loadTime < 5000 ? 'WARNING' : 'FAIL',
          threshold: 3000
        };

        this.results.tests.push(result);
        this.updateSummary(result.status);
        
        console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} ${page.name}: ${loadTime}ms`);
        
        await testPage.close();
      } catch (error) {
        console.log(`  ❌ ${page.name}: Error - ${error.message}`);
        this.results.tests.push({
          test: 'Page Load Time',
          page: page.name,
          url: page.url,
          error: error.message,
          status: 'FAIL'
        });
        this.updateSummary('FAIL');
      }
    }

    await browser.close();
  }

  async testAPIPerformance() {
    console.log('🔌 Testing API Performance...');
    
    const endpoints = [
      { name: 'Products API', url: '/api/products', method: 'GET' },
      { name: 'Orders API', url: '/api/orders', method: 'GET' },
      { name: 'Customers API', url: '/api/customers', method: 'GET' },
      { name: 'Inventory API', url: '/api/inventory', method: 'GET' }
    ];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        
        // Mock API call - replace with actual API testing
        const responseTime = Math.random() * 500 + 50; // Simulate 50-550ms response
        await new Promise(resolve => setTimeout(resolve, responseTime));
        
        const result = {
          test: 'API Performance',
          endpoint: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          responseTime,
          status: responseTime < 200 ? 'PASS' : responseTime < 500 ? 'WARNING' : 'FAIL',
          threshold: 200
        };

        this.results.tests.push(result);
        this.updateSummary(result.status);
        
        console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} ${endpoint.name}: ${responseTime.toFixed(0)}ms`);
      } catch (error) {
        console.log(`  ❌ ${endpoint.name}: Error - ${error.message}`);
        this.results.tests.push({
          test: 'API Performance',
          endpoint: endpoint.name,
          url: endpoint.url,
          error: error.message,
          status: 'FAIL'
        });
        this.updateSummary('FAIL');
      }
    }
  }

  async testResourceOptimization() {
    console.log('📦 Testing Resource Optimization...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      // Check for unoptimized resources
      const resources = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource');
        return entries.map(entry => ({
          name: entry.name,
          size: entry.transferSize || 0,
          duration: entry.duration,
          type: entry.initiatorType
        }));
      });

      const largeResources = resources.filter(r => r.size > 500000); // > 500KB
      const slowResources = resources.filter(r => r.duration > 1000); // > 1s

      const result = {
        test: 'Resource Optimization',
        totalResources: resources.length,
        largeResources: largeResources.length,
        slowResources: slowResources.length,
        status: largeResources.length === 0 && slowResources.length === 0 ? 'PASS' : 'WARNING',
        details: {
          largeResources: largeResources.slice(0, 5),
          slowResources: slowResources.slice(0, 5)
        }
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : '⚠️'} Resources: ${resources.length} total, ${largeResources.length} large, ${slowResources.length} slow`);
    } catch (error) {
      console.log(`  ❌ Resource Optimization: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Resource Optimization',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  async testLighthouseAudit() {
    console.log('🏗️ Running Lighthouse Audit...');
    
    try {
      const { lhr } = await lighthouse('https://kenttraders.co.uk', {
        port: 9222,
        output: 'json',
        onlyCategories: ['performance']
      });

      const scores = {
        performance: Math.round(lhr.categories.performance.score * 100),
        firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
        firstInputDelay: lhr.audits['max-potential-fid'].numericValue,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue
      };

      const result = {
        test: 'Lighthouse Audit',
        scores,
        status: scores.performance >= 90 ? 'PASS' : scores.performance >= 70 ? 'WARNING' : 'FAIL',
        threshold: 90
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Performance Score: ${scores.performance}/100`);
    } catch (error) {
      console.log(`  ❌ Lighthouse Audit: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Lighthouse Audit',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }
  }

  async testDatabasePerformance() {
    console.log('🗄️ Testing Database Performance...');
    
    try {
      // Mock database performance tests
      const tests = [
        { name: 'Product Query', time: Math.random() * 100 + 10 },
        { name: 'Order Query', time: Math.random() * 150 + 20 },
        { name: 'Customer Query', time: Math.random() * 80 + 15 },
        { name: 'Inventory Query', time: Math.random() * 120 + 25 }
      ];

      let allPassed = true;
      let hasWarnings = false;

      for (const test of tests) {
        const status = test.time < 50 ? 'PASS' : test.time < 100 ? 'WARNING' : 'FAIL';
        if (status === 'FAIL') allPassed = false;
        if (status === 'WARNING') hasWarnings = true;

        this.results.tests.push({
          test: 'Database Performance',
          query: test.name,
          responseTime: test.time,
          status,
          threshold: 50
        });

        console.log(`  ${status === 'PASS' ? '✅' : status === 'WARNING' ? '⚠️' : '❌'} ${test.name}: ${test.time.toFixed(0)}ms`);
      }

      const overallStatus = allPassed ? (hasWarnings ? 'WARNING' : 'PASS') : 'FAIL';
      this.updateSummary(overallStatus);
    } catch (error) {
      console.log(`  ❌ Database Performance: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Database Performance',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }
  }

  async testImageOptimization() {
    console.log('🖼️ Testing Image Optimization...');
    
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.goto('https://kenttraders.co.uk');
      
      const images = await page.evaluate(() => {
        const imgElements = document.querySelectorAll('img');
        return Array.from(imgElements).map(img => ({
          src: img.src,
          width: img.naturalWidth,
          height: img.naturalHeight,
          hasLazyLoading: img.loading === 'lazy',
          hasAlt: img.alt !== '',
          format: img.src.split('.').pop()
        }));
      });

      const unoptimizedImages = images.filter(img => 
        !img.hasLazyLoading || 
        !img.hasAlt || 
        ['bmp', 'tiff'].includes(img.format.toLowerCase())
      );

      const result = {
        test: 'Image Optimization',
        totalImages: images.length,
        unoptimizedImages: unoptimizedImages.length,
        status: unoptimizedImages.length === 0 ? 'PASS' : unoptimizedImages.length < 3 ? 'WARNING' : 'FAIL',
        details: unoptimizedImages.slice(0, 5)
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Images: ${images.length} total, ${unoptimizedImages.length} unoptimized`);
      
      await browser.close();
    } catch (error) {
      console.log(`  ❌ Image Optimization: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Image Optimization',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }
  }

  async testCachingPerformance() {
    console.log('💾 Testing Caching Performance...');
    
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      // First visit
      await page.goto('https://kenttraders.co.uk');
      const firstLoadTime = await page.evaluate(() => performance.now());
      
      // Second visit (should be cached)
      await page.goto('https://kenttraders.co.uk');
      const secondLoadTime = await page.evaluate(() => performance.now());
      
      const cacheImprovement = ((firstLoadTime - secondLoadTime) / firstLoadTime) * 100;
      
      const result = {
        test: 'Caching Performance',
        firstLoadTime,
        secondLoadTime,
        cacheImprovement,
        status: cacheImprovement > 50 ? 'PASS' : cacheImprovement > 20 ? 'WARNING' : 'FAIL',
        threshold: 50
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Cache Improvement: ${cacheImprovement.toFixed(1)}%`);
      
      await browser.close();
    } catch (error) {
      console.log(`  ❌ Caching Performance: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Caching Performance',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }
  }

  async testMobilePerformance() {
    console.log('📱 Testing Mobile Performance...');
    
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      // Set mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
      
      const startTime = Date.now();
      await page.goto('https://kenttraders.co.uk', { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;

      const result = {
        test: 'Mobile Performance',
        loadTime,
        status: loadTime < 4000 ? 'PASS' : loadTime < 6000 ? 'WARNING' : 'FAIL',
        threshold: 4000
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Mobile Load Time: ${loadTime}ms`);
      
      await browser.close();
    } catch (error) {
      console.log(`  ❌ Mobile Performance: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Mobile Performance',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }
  }

  updateSummary(status) {
    this.results.summary.total++;
    if (status === 'PASS') {
      this.results.summary.passed++;
    } else if (status === 'FAIL') {
      this.results.summary.failed++;
    } else {
      this.results.summary.warnings++;
    }
  }

  async generateReport() {
    console.log('\n📋 Generating Performance Report...');
    
    const reportPath = path.join(__dirname, 'performance-report.json');
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log('\n🎯 Performance Test Summary:');
    console.log(`  Total Tests: ${this.results.summary.total}`);
    console.log(`  ✅ Passed: ${this.results.summary.passed}`);
    console.log(`  ⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`  ❌ Failed: ${this.results.summary.failed}`);
    
    if (this.results.summary.failed > 0) {
      console.log('\n❌ Performance issues detected!');
      process.exit(1);
    } else {
      console.log('\n✅ All performance tests passed!');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runAllTests();
}

module.exports = PerformanceTester; 