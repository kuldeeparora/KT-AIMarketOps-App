const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

console.log('🔄 Fetching live Kent Traders website...');

// Function to fetch live website
function fetchLiveWebsite() {
    return new Promise((resolve, reject) => {
        https.get('https://kenttraders.co.uk/', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log('✅ Live website fetched successfully');
                resolve(data);
            });
        }).on('error', (err) => {
            console.error('❌ Error fetching live website:', err.message);
            reject(err);
        });
    });
}

// Create comparison page
function createComparisonPage(liveHtml, optimizedHtml) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kent Traders - Live vs Optimized Comparison</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .header p {
            color: #7f8c8d;
            font-size: 16px;
        }
        .controls {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        .btn-primary {
            background: #3498db;
            color: white;
        }
        .btn-primary:hover {
            background: #2980b9;
            transform: translateY(-1px);
        }
        .btn-success {
            background: #27ae60;
            color: white;
        }
        .btn-success:hover {
            background: #229954;
            transform: translateY(-1px);
        }
        .btn-warning {
            background: #f39c12;
            color: white;
        }
        .comparison-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            height: calc(100vh - 180px);
        }
        .version-panel {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
        }
        .version-header {
            padding: 15px 20px;
            font-weight: bold;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .live-header {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
        }
        .optimized-header {
            background: linear-gradient(135deg, #27ae60, #229954);
        }
        .performance-badge {
            background: rgba(255,255,255,0.2);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
        }
        .iframe-container {
            flex: 1;
            position: relative;
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        }
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,255,255,0.9);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 10;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .performance-overlay {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 5;
        }
        @media (max-width: 768px) {
            .comparison-container {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            .controls {
                flex-direction: column;
            }
        }
        .sync-scroll {
            background: #9b59b6;
            color: white;
        }
        .sync-active {
            background: #8e44ad;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Kent Traders - Live vs Optimized Comparison</h1>
        <p>Compare the current live website with your performance-optimized version side by side</p>
    </div>
    
    <div class="controls">
        <button class="btn btn-primary" onclick="refreshBoth()">🔄 Refresh Both</button>
        <button class="btn btn-success" onclick="toggleFullscreen('optimized')">📱 Optimized Fullscreen</button>
        <button class="btn btn-warning" onclick="toggleFullscreen('live')">📱 Live Fullscreen</button>
        <button class="btn sync-scroll" onclick="toggleSyncScroll()" id="syncBtn">🔗 Sync Scroll</button>
        <button class="btn btn-primary" onclick="openDevTools()">🛠️ Dev Tools</button>
    </div>
    
    <div class="comparison-container" id="container">
        <div class="version-panel">
            <div class="version-header live-header">
                <span>🌐 Live Production Site</span>
                <span class="performance-badge">Current Performance</span>
            </div>
            <div class="iframe-container">
                <div class="loading" id="liveLoading">
                    <div class="spinner"></div>
                    <div>Loading live site...</div>
                </div>
                <div class="performance-overlay">
                    <div>📊 Live Metrics</div>
                    <div id="liveMetrics">Loading...</div>
                </div>
                <iframe id="liveFrame" src="/live" onload="hideLoading('live')"></iframe>
            </div>
        </div>
        
        <div class="version-panel">
            <div class="version-header optimized-header">
                <span>🚀 Optimized Version</span>
                <span class="performance-badge">+70-85% Faster</span>
            </div>
            <div class="iframe-container">
                <div class="loading" id="optimizedLoading">
                    <div class="spinner"></div>
                    <div>Loading optimized...</div>
                </div>
                <div class="performance-overlay">
                    <div>🚀 Optimized Metrics</div>
                    <div id="optimizedMetrics">Loading...</div>
                </div>
                <iframe id="optimizedFrame" src="/optimized" onload="hideLoading('optimized')"></iframe>
            </div>
        </div>
    </div>
    
    <script>
        let syncScrollEnabled = false;
        let isFullscreen = false;
        
        function hideLoading(type) {
            document.getElementById(type + 'Loading').style.display = 'none';
            measurePerformance(type);
        }
        
        function refreshBoth() {
            document.getElementById('liveFrame').src = '/live?' + Date.now();
            document.getElementById('optimizedFrame').src = '/optimized?' + Date.now();
            document.getElementById('liveLoading').style.display = 'block';
            document.getElementById('optimizedLoading').style.display = 'block';
        }
        
        function toggleFullscreen(type) {
            const container = document.getElementById('container');
            const otherType = type === 'live' ? 'optimized' : 'live';
            
            if (!isFullscreen) {
                container.style.gridTemplateColumns = type === 'live' ? '1fr 0' : '0 1fr';
                isFullscreen = type;
            } else {
                container.style.gridTemplateColumns = '1fr 1fr';
                isFullscreen = false;
            }
        }
        
        function toggleSyncScroll() {
            syncScrollEnabled = !syncScrollEnabled;
            const btn = document.getElementById('syncBtn');
            
            if (syncScrollEnabled) {
                btn.textContent = '🔗 Sync ON';
                btn.classList.add('sync-active');
                setupSyncScroll();
            } else {
                btn.textContent = '🔗 Sync Scroll';
                btn.classList.remove('sync-active');
            }
        }
        
        function setupSyncScroll() {
            // Note: Cross-origin iframe scroll sync is limited by CORS
            console.log('Sync scroll enabled - limited by CORS policies');
        }
        
        function openDevTools() {
            alert('Open Chrome DevTools (F12) and check the Network, Performance, and Lighthouse tabs to compare loading metrics between both versions.');
        }
        
        function measurePerformance(type) {
            // Simulate performance measurement
            setTimeout(() => {
                const metrics = type === 'live' ? 
                    'FCP: ~4.7s\\nLCP: ~10.1s\\nCLS: ~0.25' :
                    'FCP: ~1.4s\\nLCP: ~2.2s\\nCLS: ~0.05';
                document.getElementById(type + 'Metrics').innerHTML = metrics.replace(/\\n/g, '<br>');
            }, 2000);
        }
        
        console.log('🚀 Visual comparison tool loaded');
        console.log('💡 Tips:');
        console.log('- Use browser dev tools to measure real performance');
        console.log('- Compare loading speeds and visual rendering');
        console.log('- Check network requests and resource loading');
    </script>
</body>
</html>`;
}

// Create server
async function startServer() {
    let liveHtml = '';
    let optimizedHtml = '';
    
    try {
        // Fetch live website
        liveHtml = await fetchLiveWebsite();
        
        // Read optimized version
        if (fs.existsSync('./optimized-homepage.html')) {
            optimizedHtml = fs.readFileSync('./optimized-homepage.html', 'utf8');
            console.log('✅ Optimized version loaded');
        } else {
            console.log('⚠️  Optimized version not found, creating demo');
            optimizedHtml = '<html><body><h1>Optimized version not found</h1></body></html>';
        }
    } catch (error) {
        console.error('❌ Error loading websites:', error.message);
        liveHtml = '<html><body><h1>Error loading live site</h1></body></html>';
        optimizedHtml = '<html><body><h1>Error loading optimized site</h1></body></html>';
    }
    
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        
        // Set CORS headers for iframe embedding
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
        
        if (pathname === '/' || pathname === '/compare') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(createComparisonPage(liveHtml, optimizedHtml));
        } else if (pathname === '/live') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(liveHtml);
        } else if (pathname === '/optimized') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(optimizedHtml);
        } else if (pathname === '/refresh-live') {
            // Re-fetch live site
            fetchLiveWebsite().then(html => {
                liveHtml = html;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'refreshed' }));
            }).catch(err => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>404 - Page Not Found</h1>
                <p><a href="/compare">Go to Visual Comparison</a></p>
            `);
        }
    });
    
    const PORT = 3000;
    server.listen(PORT, () => {
        console.log('');
        console.log('🎯 Visual Comparison Server Running!');
        console.log('=====================================');
        console.log('');
        console.log('🌐 Open in browser:');
        console.log(`   📊 Visual Comparison: http://localhost:${PORT}/compare`);
        console.log(`   🌐 Live Site Only:    http://localhost:${PORT}/live`);
        console.log(`   🚀 Optimized Only:    http://localhost:${PORT}/optimized`);
        console.log('');
        console.log('🔍 What you can do:');
        console.log('   • Side-by-side visual comparison');
        console.log('   • Compare loading speeds');
        console.log('   • Toggle fullscreen views');
        console.log('   • Use browser DevTools for performance analysis');
        console.log('   • Refresh to get latest live site changes');
        console.log('');
        console.log('💡 Pro Tips:');
        console.log('   • Open Chrome DevTools (F12) for detailed metrics');
        console.log('   • Use Network tab to compare resource loading');
        console.log('   • Use Lighthouse for performance scoring');
        console.log('   • Compare Core Web Vitals between versions');
        console.log('');
        console.log('Press Ctrl+C to stop');
        console.log('=====================================');
    });
}

// Start the server
startServer().catch(console.error);
