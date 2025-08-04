const fs = require('fs');
const path = require('path');

console.log('🔧 Applying performance optimizations to real homepage...');

// Read the original homepage
let html = fs.readFileSync('original-homepage.html', 'utf8');

// Read our optimized critical CSS
let criticalCSS = '';
try {
    criticalCSS = fs.readFileSync('../assets/critical.css', 'utf8');
} catch (e) {
    console.log('⚠️  Could not find critical.css, using basic styles');
    criticalCSS = `
        /* Basic Critical CSS */
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        * { box-sizing: border-box; }
        img { max-width: 100%; height: auto; }
    `;
}

// Read our performance JavaScript
let performanceJS = '';
try {
    performanceJS = fs.readFileSync('../assets/performance-optimized.js', 'utf8');
} catch (e) {
    console.log('⚠️  Could not find performance-optimized.js, using basic monitoring');
    performanceJS = `
        console.log('✅ Performance monitoring active');
        // Basic performance monitoring
        window.addEventListener('load', () => {
            console.log('✅ Page loaded in:', performance.now(), 'ms');
        });
    `;
}

// Apply optimizations to the HTML

// 1. Add preconnect hints after <head>
const preconnectHints = `
    <!-- Performance Critical Resource Hints -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.shopify.com">
    <link rel="dns-prefetch" href="//www.googletagmanager.com">
    <link rel="dns-prefetch" href="//www.google-analytics.com">
`;

// 2. Add critical CSS inline
const criticalCSSInline = `
    <!-- Critical CSS for Performance -->
    <style>
        ${criticalCSS}
        
        /* Performance monitoring overlay */
        .performance-monitor {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
        }
        .performance-monitor div {
            margin: 2px 0;
        }
        .performance-monitor .good {
            color: #4CAF50;
        }
        .performance-monitor .warning {
            color: #FF9800;
        }
        .performance-monitor .error {
            color: #F44336;
        }
    </style>
`;

// 3. Add performance monitoring overlay
const performanceOverlay = `
    <!-- Performance Monitoring Overlay -->
    <div id="performance-monitor" class="performance-monitor">
        <div><strong>🚀 Performance Monitor</strong></div>
        <div>FCP: <span id="fcp-time">Loading...</span></div>
        <div>LCP: <span id="lcp-time">Loading...</span></div>
        <div>CLS: <span id="cls-score">0</span></div>
        <div>Load: <span id="load-time">Loading...</span></div>
        <div style="margin-top: 5px; font-size: 10px;">
            🟢 Good: &lt;1.8s FCP, &lt;2.5s LCP<br>
            🟡 Needs Work: 1.8-3s FCP, 2.5-4s LCP<br>
            🔴 Poor: &gt;3s FCP, &gt;4s LCP
        </div>
    </div>
`;

// 4. Add performance JavaScript
const performanceJSInline = `
    <!-- Performance Optimization Script -->
    <script>
        ${performanceJS}
        
        // Update performance monitor
        function updatePerformanceMonitor() {
            const fcp = document.getElementById('fcp-time');
            const lcp = document.getElementById('lcp-time');
            const cls = document.getElementById('cls-score');
            const load = document.getElementById('load-time');
            
            // Track load time
            const loadTime = performance.now();
            if (load) load.textContent = Math.round(loadTime) + 'ms';
            
            // Enhanced Core Web Vitals tracking
            if ('PerformanceObserver' in window) {
                // FCP tracking
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            const fcpTime = Math.round(entry.startTime);
                            if (fcp) {
                                fcp.textContent = fcpTime + 'ms';
                                fcp.className = fcpTime < 1800 ? 'good' : fcpTime < 3000 ? 'warning' : 'error';
                            }
                            console.log('✅ FCP:', fcpTime, 'ms');
                        }
                    }
                }).observe({entryTypes: ['paint']});
                
                // LCP tracking
                new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    const lcpTime = Math.round(lastEntry.startTime);
                    if (lcp) {
                        lcp.textContent = lcpTime + 'ms';
                        lcp.className = lcpTime < 2500 ? 'good' : lcpTime < 4000 ? 'warning' : 'error';
                    }
                    console.log('✅ LCP:', lcpTime, 'ms');
                }).observe({entryTypes: ['largest-contentful-paint']});
                
                // CLS tracking
                let clsValue = 0;
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    if (cls) {
                        cls.textContent = Math.round(clsValue * 1000) / 1000;
                        cls.className = clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'warning' : 'error';
                    }
                    console.log('✅ CLS:', Math.round(clsValue * 1000) / 1000);
                }).observe({entryTypes: ['layout-shift']});
            }
        }
        
        // Initialize monitoring
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updatePerformanceMonitor);
        } else {
            updatePerformanceMonitor();
        }
        
        console.log('🚀 Kent Traders Performance Optimizations Active');
    </script>
`;

// Apply modifications to HTML
if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>' + preconnectHints);
}

if (html.includes('</head>')) {
    html = html.replace('</head>', criticalCSSInline + '</head>');
}

if (html.includes('<body')) {
    // Find the opening body tag and add the overlay after it
    const bodyMatch = html.match(/<body[^>]*>/);
    if (bodyMatch) {
        html = html.replace(bodyMatch[0], bodyMatch[0] + performanceOverlay);
    }
}

if (html.includes('</body>')) {
    html = html.replace('</body>', performanceJSInline + '</body>');
}

// Make external resources load faster by adding async/defer where possible
html = html.replace(/<script(?![^>]*(?:async|defer))/g, '<script defer');

// Add loading="lazy" to images below the fold
const imgRegex = /<img([^>]*?)>/g;
let imgCount = 0;
html = html.replace(imgRegex, (match, attrs) => {
    imgCount++;
    // Add lazy loading to images after the first few (assuming they're above fold)
    if (imgCount > 3 && !attrs.includes('loading=')) {
        return `<img${attrs} loading="lazy">`;
    }
    return match;
});

// Write optimized HTML
fs.writeFileSync('optimized-homepage.html', html);

console.log('✅ Optimizations applied successfully!');
console.log('📁 Files created:');
console.log('   - original-homepage.html (original from kenttraders.co.uk)');
console.log('   - optimized-homepage.html (with performance optimizations)');
console.log('');
console.log('🔍 Performance optimizations applied:');
console.log('   ✅ Critical CSS inlined');
console.log('   ✅ Resource preconnect hints added');
console.log('   ✅ JavaScript loading optimized (defer)');
console.log('   ✅ Image lazy loading enabled');
console.log('   ✅ Performance monitoring overlay added');
console.log('   ✅ Core Web Vitals tracking enabled');
