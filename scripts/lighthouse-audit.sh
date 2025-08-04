#!/bin/bash

# 🚀 Lighthouse Audit Script for Kent Traders
# Comprehensive performance and SEO testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_URL="${1:-https://kenttraders.myshopify.com}"
OUTPUT_DIR="lighthouse-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}🔍 Lighthouse Audit for Kent Traders${NC}"
echo "======================================"
echo "Site: $SITE_URL"
echo "Timestamp: $TIMESTAMP"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to run Lighthouse audit
run_lighthouse() {
    local url="$1"
    local output_file="$2"
    local category="$3"
    
    echo -e "${YELLOW}Running $category audit...${NC}"
    
    npx lighthouse "$url" \
        --only-categories="$category" \
        --output=json \
        --output-path="$output_file" \
        --chrome-flags="--headless --no-sandbox --disable-gpu" \
        --quiet
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $category audit completed${NC}"
    else
        echo -e "${RED}❌ $category audit failed${NC}"
        return 1
    fi
}

# Function to extract scores from JSON
extract_score() {
    local file="$1"
    local category="$2"
    
    if [ -f "$file" ]; then
        local score=$(node -e "
            const fs = require('fs');
            const data = JSON.parse(fs.readFileSync('$file'));
            console.log(Math.round(data.categories['$category'].score * 100));
        " 2>/dev/null || echo "N/A")
        echo "$score"
    else
        echo "N/A"
    fi
}

# Function to generate HTML report
generate_html_report() {
    local timestamp="$1"
    local perf_score="$2"
    local seo_score="$3"
    local a11y_score="$4"
    local best_practices_score="$5"
    
    cat > "$OUTPUT_DIR/report-$timestamp.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lighthouse Audit Report - Kent Traders</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .score-card { background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; border-left: 4px solid #007bff; }
        .score-value { font-size: 2.5em; font-weight: bold; margin: 10px 0; }
        .score-label { color: #666; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .excellent { color: #28a745; }
        .good { color: #ffc107; }
        .poor { color: #dc3545; }
        .details { padding: 30px; }
        .section { margin-bottom: 30px; }
        .section h3 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .timestamp { text-align: center; color: #666; font-size: 0.9em; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Lighthouse Audit Report</h1>
            <p>Kent Traders Performance & SEO Analysis</p>
        </div>
        
        <div class="scores">
            <div class="score-card">
                <div class="score-label">Performance</div>
                <div class="score-value $(if [ "$perf_score" -ge 90 ]; then echo "excellent"; elif [ "$perf_score" -ge 50 ]; then echo "good"; else echo "poor"; fi)">$perf_score</div>
            </div>
            <div class="score-card">
                <div class="score-label">SEO</div>
                <div class="score-value $(if [ "$seo_score" -ge 90 ]; then echo "excellent"; elif [ "$seo_score" -ge 50 ]; then echo "good"; else echo "poor"; fi)">$seo_score</div>
            </div>
            <div class="score-card">
                <div class="score-label">Accessibility</div>
                <div class="score-value $(if [ "$a11y_score" -ge 90 ]; then echo "excellent"; elif [ "$a11y_score" -ge 50 ]; then echo "good"; else echo "poor"; fi)">$a11y_score</div>
            </div>
            <div class="score-card">
                <div class="score-label">Best Practices</div>
                <div class="score-value $(if [ "$best_practices_score" -ge 90 ]; then echo "excellent"; elif [ "$best_practices_score" -ge 50 ]; then echo "good"; else echo "poor"; fi)">$best_practices_score</div>
            </div>
        </div>
        
        <div class="details">
            <div class="section">
                <h3>📊 Performance Insights</h3>
                <p>Performance score indicates how fast your site loads and responds to user interactions. A score of 90+ is considered excellent.</p>
            </div>
            
            <div class="section">
                <h3>🔍 SEO Analysis</h3>
                <p>SEO score measures how well your site is optimized for search engines. This includes meta tags, structured data, and technical SEO elements.</p>
            </div>
            
            <div class="section">
                <h3>♿ Accessibility Check</h3>
                <p>Accessibility score evaluates how accessible your site is to users with disabilities. This includes screen reader compatibility and keyboard navigation.</p>
            </div>
            
            <div class="section">
                <h3>✅ Best Practices</h3>
                <p>Best practices score checks for modern web development standards, security headers, and code quality.</p>
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

# Main audit execution
echo -e "${BLUE}Starting comprehensive Lighthouse audit...${NC}"

# Check if Lighthouse is installed
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Run audits for each category
audit_files=()

# Performance audit
perf_file="$OUTPUT_DIR/performance-$TIMESTAMP.json"
run_lighthouse "$SITE_URL" "$perf_file" "performance"
audit_files+=("$perf_file")

# SEO audit
seo_file="$OUTPUT_DIR/seo-$TIMESTAMP.json"
run_lighthouse "$SITE_URL" "$seo_file" "seo"
audit_files+=("$seo_file")

# Accessibility audit
a11y_file="$OUTPUT_DIR/accessibility-$TIMESTAMP.json"
run_lighthouse "$SITE_URL" "$a11y_file" "accessibility"
audit_files+=("$a11y_file")

# Best practices audit
bp_file="$OUTPUT_DIR/best-practices-$TIMESTAMP.json"
run_lighthouse "$SITE_URL" "$bp_file" "best-practices"
audit_files+=("$bp_file")

# Extract scores
perf_score=$(extract_score "$perf_file" "performance")
seo_score=$(extract_score "$seo_file" "seo")
a11y_score=$(extract_score "$a11y_file" "accessibility")
bp_score=$(extract_score "$bp_file" "best-practices")

# Generate summary
echo ""
echo -e "${BLUE}📊 Audit Summary${NC}"
echo "=================="
echo -e "Performance: ${GREEN}$perf_score/100${NC}"
echo -e "SEO: ${GREEN}$seo_score/100${NC}"
echo -e "Accessibility: ${GREEN}$a11y_score/100${NC}"
echo -e "Best Practices: ${GREEN}$bp_score/100${NC}"

# Generate HTML report
generate_html_report "$TIMESTAMP" "$perf_score" "$seo_score" "$a11y_score" "$bp_score"

echo ""
echo -e "${GREEN}✅ Lighthouse audit completed successfully!${NC}"
echo -e "📁 Reports saved in: $OUTPUT_DIR/"
echo -e "📄 HTML report: $OUTPUT_DIR/report-$TIMESTAMP.html"
echo -e "📊 JSON reports: ${audit_files[*]}"

# Provide recommendations
echo ""
echo -e "${YELLOW}💡 Recommendations:${NC}"
if [ "$perf_score" -lt 90 ]; then
    echo "• Optimize images and implement lazy loading"
    echo "• Minimize CSS and JavaScript bundles"
    echo "• Enable compression and caching"
fi

if [ "$seo_score" -lt 90 ]; then
    echo "• Add meta descriptions and title tags"
    echo "• Implement structured data (JSON-LD)"
    echo "• Ensure proper heading hierarchy"
fi

if [ "$a11y_score" -lt 90 ]; then
    echo "• Add alt text to images"
    echo "• Ensure proper color contrast"
    echo "• Test with screen readers"
fi

echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "1. Review the detailed JSON reports for specific issues"
echo "2. Implement the recommendations above"
echo "3. Run this audit regularly to track improvements"
echo "4. Set up automated monitoring in your CI/CD pipeline" 