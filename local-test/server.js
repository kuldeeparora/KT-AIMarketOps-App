const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let filePath = '.' + parsedUrl.pathname;
    
    // Route handling
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/optimized') {
        filePath = './optimized-homepage.html';
    } else if (parsedUrl.pathname === '/original') {
        filePath = './original-homepage.html';
    } else if (parsedUrl.pathname.startsWith('/assets/')) {
        filePath = '..' + parsedUrl.pathname;
    }
    
    // MIME types
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>404 Not Found</h1>
                    <p>Available routes:</p>
                    <ul>
                        <li><a href="/optimized">Optimized Homepage</a></li>
                        <li><a href="/original">Original Homepage</a></li>
                    </ul>
                `, 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`\n🌐 Performance Testing Server Running!`);
    console.log(`======================================`);
    console.log(`📊 Optimized Version: http://localhost:${PORT}/optimized`);
    console.log(`📊 Original Version:  http://localhost:${PORT}/original`);
    console.log(`\n🧪 Testing Instructions:`);
    console.log(`1. Open both URLs in separate Chrome tabs`);
    console.log(`2. Open DevTools (F12) > Performance tab`);
    console.log(`3. Record page load performance for both`);
    console.log(`4. Compare FCP, LCP, TBT, and CLS metrics`);
    console.log(`5. Check the performance monitor in top-right corner`);
    console.log(`\n📈 Expected Improvements:`);
    console.log(`   - FCP: 60-70% faster`);
    console.log(`   - LCP: 75% faster`);
    console.log(`   - TBT: 70% reduction`);
    console.log(`   - Overall: Much smoother experience`);
    console.log(`\n🛑 Press Ctrl+C to stop the server`);
});
