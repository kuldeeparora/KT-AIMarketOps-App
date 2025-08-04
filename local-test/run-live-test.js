#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🌐 Fetching live Kent Traders homepage and applying optimizations...');

// Fetch the live homepage
const url = 'https://kenttraders.co.uk/';

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Homepage fetched successfully');
    console.log(`📄 HTML size: ${Math.round(data.length / 1024)} KB`);
    
    // Save original HTML
    const originalPath = path.join(__dirname, 'original-homepage.html');
    fs.writeFileSync(originalPath, data);
    console.log('💾 Saved original to: local-test/original-homepage.html');
    
    // Apply optimizations
    console.log('🚀 Applying performance optimizations...');
    const optimized = applyOptimizations(data);
    
    // Save optimized HTML
    const optimizedPath = path.join(__dirname, 'optimized-homepage.html');
    fs.writeFileSync(optimizedPath, optimized);
    console.log('✅ Saved optimized to: local-test/optimized-homepage.html');
    
    console.log('');
    console.log('🎯 Ready for testing!');
    console.log('Next: Run "node local-test/server.js" to start the test server');
    
    // Auto-start the server
    console.log('🚀 Starting local test server...');
    require('./server.js');
  });
  
}).on('error', (err) => {
  console.error('❌ Error fetching homepage:', err.message);
  console.log('⚠️  Using existing local files if available...');
  
  // Try to use existing files
  const originalPath = path.join(__dirname, 'original-homepage.html');
  const optimizedPath = path.join(__dirname, 'optimized-homepage.html');
  
  if (fs.existsSync(originalPath)) {
    console.log('📄 Found existing original-homepage.html');
    require('./server.js');
  } else {
    console.log('❌ No local files found. Please check your internet connection.');
  }
});

function applyOptimizations(html) {
  console.log('🔧 Applying optimizations...');
  
  // Read optimization files
  let criticalCSS = '';
  let performanceJS = '';
  
  try {
    criticalCSS = fs.readFileSync(path.join(__dirname, '..', 'assets', 'critical.css'), 'utf8');
  } catch (e) {
    console.log('⚠️  Using built-in critical CSS');
    criticalCSS = getCriticalCSS();
  }
  
  try {
    performanceJS = fs.readFileSync(path.join(__dirname, '..', 'assets', 'performance-optimized.js'), 'utf8');
  } catch (e) {
    console.log('⚠️  Using built-in performance JS');
    performanceJS = getPerformanceJS();
  }
  
  let optimized = html;
  
  // 1. Add resource hints
  const resourceHints = `
  <!-- 🚀 PERFORMANCE RESOURCE HINTS -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.shopify.com">
  <link rel="dns-prefetch" href="//www.googletagmanager.com">
  <link rel="dns-prefetch" href="//www.google-analytics.com">
  `;
  
  optimized = optimized.replace('<head>', '<head>' + resourceHints);
  
  // 2. Inline critical CSS
  const criticalCSSBlock = `
  <!-- 🚀 CRITICAL CSS INLINED FOR PERFORMANCE -->
  <style id="critical-css">
  ${criticalCSS}
  </style>`;
  
  optimized = optimized.replace('</head>', criticalCSSBlock + '</head>');
  
  // 3. Add performance JavaScript
  const performanceJSBlock = `
  <!-- 🚀 PERFORMANCE OPTIMIZATIONS -->
  <script defer id="performance-optimizations">
  ${performanceJS}
  </script>`;
  
  optimized = optimized.replace('</body>', performanceJSBlock + '</body>');
  
  // 4. Add performance monitoring overlay
  const performanceMonitor = `
  <!-- 📊 PERFORMANCE MONITOR OVERLAY -->
  <div id="performance-monitor" style="
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.9);
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    z-index: 999999;
    min-width: 220px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 2px solid #27ae60;
  ">
    <div style="color: #27ae60; font-weight: bold; margin-bottom: 8px;">🚀 Performance Monitor</div>
    <div id="fcp-time" style="margin: 4px 0;">FCP: <span style="color: #f39c12;">Measuring...</span></div>
    <div id="lcp-time" style="margin: 4px 0;">LCP: <span style="color: #f39c12;">Measuring...</span></div>
    <div id="cls-score" style="margin: 4px 0;">CLS: <span style="color: #f39c12;">Measuring...</span></div>
    <div id="load-time" style="margin: 4px 0;">Load: <span style="color: #f39c12;">Loading...</span></div>
    <div id="optimization-status" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #555; color: #27ae60; font-size: 11px;">✅ Optimizations Active</div>
  </div>
  
  <script>
    console.log('🚀 Kent Traders Performance Optimizations Active');
    
    // Performance monitoring
    let performanceData = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      loadTime: 0
    };
    
    // Track page start time
    const navigationStart = performance.timing.navigationStart;
    
    // Measure FCP
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            performanceData.fcp = entry.startTime;
            const fcpElement = document.getElementById('fcp-time');
            if (fcpElement) {
              const time = Math.round(entry.startTime);
              const color = time < 1800 ? '#27ae60' : time < 3000 ? '#f39c12' : '#e74c3c';
              fcpElement.innerHTML = \`FCP: <span style="color: \${color};">\${time}ms</span>\`;
            }
            console.log('✅ FCP:', Math.round(entry.startTime), 'ms');
          }
        }
      }).observe({entryTypes: ['paint']});
    } catch (e) {
      console.warn('FCP measurement not supported');
    }
    
    // Measure LCP
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        performanceData.lcp = lastEntry.startTime;
        const lcpElement = document.getElementById('lcp-time');
        if (lcpElement) {
          const time = Math.round(lastEntry.startTime);
          const color = time < 2500 ? '#27ae60' : time < 4000 ? '#f39c12' : '#e74c3c';
          lcpElement.innerHTML = \`LCP: <span style="color: \${color};">\${time}ms</span>\`;
        }
        console.log('✅ LCP:', Math.round(lastEntry.startTime), 'ms');
      }).observe({entryTypes: ['largest-contentful-paint']});
    } catch (e) {
      console.warn('LCP measurement not supported');
    }
    
    // Track load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      performanceData.loadTime = loadTime;
      
      const loadElement = document.getElementById('load-time');
      if (loadElement) {
        const time = Math.round(loadTime);
        const color = time < 3000 ? '#27ae60' : time < 5000 ? '#f39c12' : '#e74c3c';
        loadElement.innerHTML = \`Load: <span style="color: \${color};">\${time}ms</span>\`;
      }
      
      // Update status
      const statusElement = document.getElementById('optimization-status');
      if (statusElement) {
        statusElement.innerHTML = '✅ Critical CSS Loaded<br>✅ Performance JS Active<br>✅ Monitoring Complete';
      }
      
      console.log('📊 Performance Summary:', {
        fcp: Math.round(performanceData.fcp),
        lcp: Math.round(performanceData.lcp), 
        loadTime: Math.round(loadTime)
      });
    });
    
    // Add visual feedback for optimization
    document.addEventListener('DOMContentLoaded', () => {
      const monitor = document.getElementById('performance-monitor');
      if (monitor) {
        monitor.style.animation = 'fadeIn 0.5s ease-in';
      }
    });
  </script>
  
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>`;
  
  optimized = optimized.replace('</body>', performanceMonitor + '</body>');
  
  // 5. Optimize existing CSS loading (make non-critical CSS async)
  optimized = optimized.replace(
    /<link[^>]+rel=[\"']stylesheet[\"'][^>]*>/gi,
    (match) => {
      // Skip if already has async attributes or is critical
      if (match.includes('preload') || match.includes('async') || match.includes('critical')) {
        return match;
      }
      
      // Make non-critical stylesheets load asynchronously
      const asyncVersion = match.replace(
        'rel="stylesheet"',
        'rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"'
      );
      
      // Add noscript fallback
      const noscriptFallback = `<noscript>${match}</noscript>`;
      
      return asyncVersion + noscriptFallback;
    }
  );
  
  // 6. Optimize JavaScript loading
  optimized = optimized.replace(
    /<script([^>]*src[^>]*)><\/script>/gi,
    (match, attributes) => {
      // Skip if already has defer/async or is inline
      if (attributes.includes('defer') || attributes.includes('async') || !attributes.includes('src')) {
        return match;
      }
      
      // Add defer to scripts (better than async for most cases)
      return `<script${attributes} defer></script>`;
    }
  );
  
  console.log('✅ Applied all performance optimizations');
  return optimized;
}

function getCriticalCSS() {
  return `
    /* Critical CSS for immediate rendering */
    *, *::before, *::after { box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      margin: 0; padding: 0; line-height: 1.6; 
    }
    img { max-width: 100%; height: auto; display: block; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    .btn { 
      display: inline-block; padding: 0.75rem 1.5rem; 
      background: #e74c3c; color: white; text-decoration: none; 
      border-radius: 4px; border: none; cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn:hover { background: #c0392b; transform: translateY(-1px); }
    .sr-only { 
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; 
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; 
    }
  `;
}
}

function getPerformanceJS() {
  return `
    // Basic performance optimizations
    console.log('🚀 Performance optimizations loading...');
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
    
    // Performance monitoring
    window.addEventListener('load', () => {
      console.log('✅ All optimizations loaded successfully');
    });
  `;
}
