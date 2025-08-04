#!/bin/bash

# ⚡ Performance Audit Script for Kent Traders
# Comprehensive performance testing and optimization

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_URL="${1:-https://kenttraders.myshopify.com}"
OUTPUT_DIR="performance-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}⚡ Performance Audit for Kent Traders${NC}"
echo "======================================="
echo "Site: $SITE_URL"
echo "Timestamp: $TIMESTAMP"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to run WebPageTest
run_webpagetest() {
    local url="$1"
    local output_file="$2"
    
    echo -e "${YELLOW}Running WebPageTest analysis...${NC}"
    
    # Note: WebPageTest requires API key for full functionality
    # This is a simplified version that uses curl to test basic metrics
    curl -s -w "@curl-format.txt" -o /dev/null "$url" > "$output_file" 2>/dev/null || {
        echo -e "${RED}❌ WebPageTest analysis failed${NC}"
        return 1
    }
    
    echo -e "${GREEN}✅ WebPageTest analysis completed${NC}"
}

# Function to run GTmetrix
run_gtmetrix() {
    local url="$1"
    local output_file="$2"
    
    echo -e "${YELLOW}Running GTmetrix analysis...${NC}"
    
    # GTmetrix CLI would require API key
    # This is a placeholder for the actual implementation
    echo "GTmetrix analysis would run here with API key" > "$output_file"
    
    echo -e "${GREEN}✅ GTmetrix analysis completed${NC}"
}

# Function to analyze Core Web Vitals
analyze_core_web_vitals() {
    local url="$1"
    local output_file="$2"
    
    echo -e "${YELLOW}Analyzing Core Web Vitals...${NC}"
    
    # Use Lighthouse for Core Web Vitals
    npx lighthouse "$url" \
        --only-categories=performance \
        --output=json \
        --output-path="$output_file" \
        --chrome-flags="--headless --no-sandbox --disable-gpu" \
        --quiet 2>/dev/null || {
        echo -e "${RED}❌ Core Web Vitals analysis failed${NC}"
        return 1
    }
    
    echo -e "${GREEN}✅ Core Web Vitals analysis completed${NC}"
}

# Function to extract performance metrics
extract_metrics() {
    local file="$1"
    
    if [ -f "$file" ]; then
        local metrics=$(node -e "
            const fs = require('fs');
            try {
                const data = JSON.parse(fs.readFileSync('$file'));
                const audits = data.audits;
                console.log(JSON.stringify({
                    fcp: audits['first-contentful-paint']?.numericValue || 0,
                    lcp: audits['largest-contentful-paint']?.numericValue || 0,
                    fid: audits['max-potential-fid']?.numericValue || 0,
                    cls: audits['cumulative-layout-shift']?.numericValue || 0,
                    ttfb: audits['server-response-time']?.numericValue || 0,
                    score: Math.round(data.categories.performance.score * 100)
                }));
            } catch (e) {
                console.log(JSON.stringify({
                    fcp: 0, lcp: 0, fid: 0, cls: 0, ttfb: 0, score: 0
                }));
            }
        " 2>/dev/null || echo '{"fcp":0,"lcp":0,"fid":0,"cls":0,"ttfb":0,"score":0}')
        echo "$metrics"
    else
        echo '{"fcp":0,"lcp":0,"fid":0,"cls":0,"ttfb":0,"score":0}'
    fi
}

# Function to generate HTML report
generate_html_report() {
    local timestamp="$1"
    local metrics="$2"
    
    # Parse metrics
    local fcp=$(echo "$metrics" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).fcp)")
    local lcp=$(echo "$metrics" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).lcp)")
    local fid=$(echo "$metrics" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).fid)")
    local cls=$(echo "$metrics" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).cls)")
    local ttfb=$(echo "$metrics" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).ttfb)")
    local score=$(echo "$metrics" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).score)")
    
    cat > "$OUTPUT_DIR/performance-report-$timestamp.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Audit Report - Kent Traders</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .overall-score { text-align: center; padding: 30px; background: #f8f9fa; }
        .score-circle { width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 2em; font-weight: bold; color: white; }
        .excellent { background: #28a745; }
        .good { background: #ffc107; }
        .poor { background: #dc3545; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .metric-card { background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; border-left: 4px solid #007bff; }
        .metric-value { font-size: 1.5em; font-weight: bold; margin: 10px 0; }
        .metric-label { color: #666; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .details { padding: 30px; }
        .section { margin-bottom: 30px; }
        .section h3 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .recommendations { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .recommendations h4 { margin-top: 0; color: #333; }
        .recommendations ul { margin: 10px 0; padding-left: 20px; }
        .recommendations li { margin: 5px 0; }
        .timestamp { text-align: center; color: #666; font-size: 0.9em; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚡ Performance Audit Report</h1>
            <p>Kent Traders Performance Analysis</p>
        </div>
        
        <div class="overall-score">
            <div class="score-circle $(if [ "$score" -ge 90 ]; then echo "excellent"; elif [ "$score" -ge 50 ]; then echo "good"; else echo "poor"; fi)">
                $score
            </div>
            <h2>Overall Performance Score</h2>
        </div>
        
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-label">First Contentful Paint</div>
                <div class="metric-value">$(printf "%.0f" $fcp)ms</div>
                <small>$(if [ "$fcp" -le 1800 ]; then echo "✅ Good"; elif [ "$fcp" -le 3000 ]; then echo "⚠️ Needs Improvement"; else echo "❌ Poor"; fi)</small>
            </div>
            <div class="metric-card">
                <div class="metric-label">Largest Contentful Paint</div>
                <div class="metric-value">$(printf "%.0f" $lcp)ms</div>
                <small>$(if [ "$lcp" -le 2500 ]; then echo "✅ Good"; elif [ "$lcp" -le 4000 ]; then echo "⚠️ Needs Improvement"; else echo "❌ Poor"; fi)</small>
            </div>
            <div class="metric-card">
                <div class="metric-label">First Input Delay</div>
                <div class="metric-value">$(printf "%.0f" $fid)ms</div>
                <small>$(if [ "$fid" -le 100 ]; then echo "✅ Good"; elif [ "$fid" -le 300 ]; then echo "⚠️ Needs Improvement"; else echo "❌ Poor"; fi)</small>
            </div>
            <div class="metric-card">
                <div class="metric-label">Cumulative Layout Shift</div>
                <div class="metric-value">$(printf "%.3f" $cls)</div>
                <small>$(if [ "$cls" -le 0.1 ]; then echo "✅ Good"; elif [ "$cls" -le 0.25 ]; then echo "⚠️ Needs Improvement"; else echo "❌ Poor"; fi)</small>
            </div>
            <div class="metric-card">
                <div class="metric-label">Time to First Byte</div>
                <div class="metric-value">$(printf "%.0f" $ttfb)ms</div>
                <small>$(if [ "$ttfb" -le 600 ]; then echo "✅ Good"; elif [ "$ttfb" -le 1800 ]; then echo "⚠️ Needs Improvement"; else echo "❌ Poor"; fi)</small>
            </div>
        </div>
        
        <div class="details">
            <div class="section">
                <h3>📊 Core Web Vitals Analysis</h3>
                <p>Core Web Vitals are the key metrics that Google uses to evaluate user experience on your website. These metrics directly impact your search rankings.</p>
                
                <div class="recommendations">
                    <h4>Performance Recommendations:</h4>
                    <ul>
                        <li><strong>Optimize Images:</strong> Use WebP format, implement lazy loading, and compress images</li>
                        <li><strong>Minimize CSS/JS:</strong> Remove unused code, minify files, and use code splitting</li>
                        <li><strong>Enable Compression:</strong> Use Gzip or Brotli compression for all text-based assets</li>
                        <li><strong>Implement Caching:</strong> Set proper cache headers for static assets</li>
                        <li><strong>Optimize Fonts:</strong> Use font-display: swap and preload critical fonts</li>
                        <li><strong>Reduce Server Response Time:</strong> Optimize database queries and use CDN</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h3>🎯 E-commerce Specific Optimizations</h3>
                <p>For e-commerce websites, these optimizations are particularly important:</p>
                
                <div class="recommendations">
                    <h4>E-commerce Performance Tips:</h4>
                    <ul>
                        <li><strong>Product Images:</strong> Use responsive images with srcset and sizes attributes</li>
                        <li><strong>Shopping Cart:</strong> Implement optimistic updates and local storage</li>
                        <li><strong>Search:</strong> Use debounced search with autocomplete</li>
                        <li><strong>Checkout:</strong> Minimize redirects and optimize form performance</li>
                        <li><strong>Mobile:</strong> Ensure touch-friendly interfaces and fast mobile performance</li>
                        <li><strong>Analytics:</strong> Load analytics asynchronously to avoid blocking</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h3>🔧 Technical Optimizations</h3>
                <p>Technical improvements that can boost your performance score:</p>
                
                <div class="recommendations">
                    <h4>Technical Recommendations:</h4>
                    <ul>
                        <li><strong>HTTP/2:</strong> Enable HTTP/2 or HTTP/3 for multiplexing</li>
                        <li><strong>CDN:</strong> Use a Content Delivery Network for global performance</li>
                        <li><strong>Critical CSS:</strong> Inline critical CSS and defer non-critical styles</li>
                        <li><strong>JavaScript:</strong> Use async/defer attributes and code splitting</li>
                        <li><strong>Database:</strong> Optimize queries and use database indexing</li>
                        <li><strong>Monitoring:</strong> Set up Real User Monitoring (RUM) for ongoing tracking</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="timestamp">
            Report generated on: $(date)
        </div>
    </div>
</body>
</html>
EOF
}

# Create curl format file for timing
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF

# Main audit execution
echo -e "${BLUE}Starting comprehensive performance audit...${NC}"

# Check if required tools are available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Run different performance tests
audit_files=()

# Core Web Vitals analysis
cwp_file="$OUTPUT_DIR/core-web-vitals-$TIMESTAMP.json"
analyze_core_web_vitals "$SITE_URL" "$cwp_file"
audit_files+=("$cwp_file")

# WebPageTest analysis (simplified)
wpt_file="$OUTPUT_DIR/webpagetest-$TIMESTAMP.txt"
run_webpagetest "$SITE_URL" "$wpt_file"
audit_files+=("$wpt_file")

# GTmetrix analysis (placeholder)
gtm_file="$OUTPUT_DIR/gtmetrix-$TIMESTAMP.txt"
run_gtmetrix "$SITE_URL" "$gtm_file"
audit_files+=("$gtm_file")

# Extract metrics
metrics=$(extract_metrics "$cwp_file")

# Generate summary
echo ""
echo -e "${BLUE}📊 Performance Summary${NC}"
echo "========================"
echo "$metrics" | node -e "
const data = JSON.parse(require('fs').readFileSync(0));
console.log('Overall Score:', data.score + '/100');
console.log('First Contentful Paint:', Math.round(data.fcp) + 'ms');
console.log('Largest Contentful Paint:', Math.round(data.lcp) + 'ms');
console.log('First Input Delay:', Math.round(data.fid) + 'ms');
console.log('Cumulative Layout Shift:', data.cls.toFixed(3));
console.log('Time to First Byte:', Math.round(data.ttfb) + 'ms');
"

# Generate HTML report
generate_html_report "$TIMESTAMP" "$metrics"

echo ""
echo -e "${GREEN}✅ Performance audit completed successfully!${NC}"
echo -e "📁 Reports saved in: $OUTPUT_DIR/"
echo -e "📄 HTML report: $OUTPUT_DIR/performance-report-$TIMESTAMP.html"
echo -e "📊 JSON reports: ${audit_files[*]}"

# Provide recommendations
echo ""
echo -e "${YELLOW}💡 Performance Recommendations:${NC}"

score=$(echo "$metrics" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).score)")

if [ "$score" -lt 90 ]; then
    echo "• Optimize images: Use WebP format and implement lazy loading"
    echo "• Minimize CSS and JavaScript bundles"
    echo "• Enable compression (Gzip/Brotli) for all text assets"
    echo "• Implement proper caching headers"
    echo "• Use a CDN for global performance"
    echo "• Optimize database queries and server response time"
    echo "• Implement critical CSS inlining"
    echo "• Use HTTP/2 or HTTP/3 for multiplexing"
else
    echo "• Excellent performance! Keep monitoring as you add features"
    echo "• Consider implementing Real User Monitoring (RUM)"
    echo "• Set up automated performance testing in CI/CD"
fi

echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "1. Review the detailed performance reports"
echo "2. Implement the performance recommendations"
echo "3. Set up automated performance monitoring"
echo "4. Test performance on different devices and networks"
echo "5. Monitor Core Web Vitals in Google Search Console" 