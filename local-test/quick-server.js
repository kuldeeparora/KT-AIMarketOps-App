const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Simple server to serve test files
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let filePath = '.' + parsedUrl.pathname;
    
    // Route handling
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/optimized') {
        filePath = './optimized-homepage.html';
    } else if (parsedUrl.pathname === '/original') {
        filePath = './original-homepage.html';
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
        '.svg': 'image/svg+xml'
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
                `);
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 Kent Traders Test Server running at http://localhost:${PORT}`);
    console.log(`📊 Optimized: http://localhost:${PORT}/optimized`);
    console.log(`📄 Original:  http://localhost:${PORT}/original`);
});

// Keep server running
process.on('SIGINT', () => {
    console.log('\n🛑 Server stopped');
    process.exit(0);
});
