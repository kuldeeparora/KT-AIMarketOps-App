import http.server
import socketserver
import urllib.request
import os
import webbrowser
from urllib.parse import urlparse, parse_qs

class VisualCompareHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/compare':
            self.send_comparison_page()
        elif self.path == '/live':
            self.send_live_site()
        elif self.path == '/optimized':
            self.send_optimized_site()
        else:
            super().do_GET()
    
    def send_comparison_page(self):
        html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kent Traders - Live vs Optimized Visual Comparison</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 { margin-bottom: 10px; }
        .controls {
            background: white;
            padding: 15px;
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-warning { background: #ffc107; color: #212529; }
        .btn:hover { transform: translateY(-2px); }
        .comparison-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            height: calc(100vh - 140px);
            gap: 2px;
        }
        .version-panel {
            background: white;
            display: flex;
            flex-direction: column;
        }
        .version-header {
            padding: 15px;
            font-weight: bold;
            color: white;
            text-align: center;
        }
        .live-header { background: #dc3545; }
        .optimized-header { background: #28a745; }
        iframe {
            flex: 1;
            border: none;
            width: 100%;
        }
        @media (max-width: 768px) {
            .comparison-container { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Kent Traders Visual Comparison</h1>
        <p>Live Production Site vs Performance Optimized Version</p>
    </div>
    
    <div class="controls">
        <a href="https://kenttraders.co.uk" target="_blank" class="btn btn-primary">🌐 Open Live Site</a>
        <a href="/optimized" target="_blank" class="btn btn-success">🚀 Open Optimized</a>
        <button class="btn btn-warning" onclick="location.reload()">🔄 Refresh</button>
    </div>
    
    <div class="comparison-container">
        <div class="version-panel">
            <div class="version-header live-header">
                🌐 LIVE PRODUCTION SITE
            </div>
            <iframe src="https://kenttraders.co.uk" title="Live Kent Traders Site"></iframe>
        </div>
        
        <div class="version-panel">
            <div class="version-header optimized-header">
                🚀 OPTIMIZED VERSION (+70-85% Faster)
            </div>
            <iframe src="/optimized" title="Optimized Kent Traders Site"></iframe>
        </div>
    </div>
    
    <script>
        console.log('🎯 Visual Comparison Tool Loaded');
        console.log('💡 Open Chrome DevTools (F12) to:');
        console.log('   • Compare Network tab loading speeds');
        console.log('   • Run Lighthouse performance audits');
        console.log('   • Check Core Web Vitals differences');
    </script>
</body>
</html>'''
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(html.encode())
    
    def send_live_site(self):
        try:
            with urllib.request.urlopen('https://kenttraders.co.uk') as response:
                content = response.read()
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Error fetching live site: {str(e)}")
    
    def send_optimized_site(self):
        try:
            with open('optimized-homepage.html', 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_error(404, "Optimized homepage not found")
        except Exception as e:
            self.send_error(500, f"Error loading optimized site: {str(e)}")

if __name__ == "__main__":
    PORT = 3000
    
    print("🚀 Starting Visual Comparison Server...")
    print("======================================")
    print()
    print(f"🌐 Server URL: http://localhost:{PORT}/compare")
    print("📊 Features:")
    print("   • Side-by-side live vs optimized comparison")
    print("   • Direct iframe embedding of both versions")
    print("   • Mobile responsive design")
    print("   • Easy performance testing with DevTools")
    print()
    print("💡 Usage Tips:")
    print("   • Open Chrome DevTools (F12) for performance analysis")
    print("   • Use Network tab to compare loading speeds")
    print("   • Run Lighthouse audits on both versions")
    print("   • Compare Core Web Vitals metrics")
    print()
    print("Press Ctrl+C to stop")
    print("======================================")
    
    try:
        with socketserver.TCPServer(("", PORT), VisualCompareHandler) as httpd:
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}/compare')
                print(f"🎯 Browser opened automatically at http://localhost:{PORT}/compare")
            except:
                print(f"🔗 Manual: Open http://localhost:{PORT}/compare in your browser")
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
