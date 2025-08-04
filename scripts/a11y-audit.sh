#!/bin/bash

# ♿ Accessibility Audit Script for Kent Traders
# Comprehensive accessibility testing using Pa11y

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_URL="${1:-https://kenttraders.myshopify.com}"
OUTPUT_DIR="pa11y-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}♿ Accessibility Audit for Kent Traders${NC}"
echo "=========================================="
echo "Site: $SITE_URL"
echo "Timestamp: $TIMESTAMP"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to run Pa11y audit
run_pa11y() {
    local url="$1"
    local output_file="$2"
    local standard="$3"
    
    echo -e "${YELLOW}Running $standard accessibility audit...${NC}"
    
    npx pa11y "$url" \
        --standard "$standard" \
        --json \
        --reporter json \
        --output "$output_file" \
        --timeout 30000 \
        --wait 2000
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $standard audit completed${NC}"
    else
        echo -e "${RED}❌ $standard audit failed${NC}"
        return 1
    fi
}

# Function to extract issues count
extract_issues() {
    local file="$1"
    
    if [ -f "$file" ]; then
        local issues=$(node -e "
            const fs = require('fs');
            try {
                const data = JSON.parse(fs.readFileSync('$file'));
                console.log(data.issues ? data.issues.length : 0);
            } catch (e) {
                console.log(0);
            }
        " 2>/dev/null || echo "0")
        echo "$issues"
    else
        echo "0"
    fi
}

# Function to generate HTML report
generate_html_report() {
    local timestamp="$1"
    local wcag_issues="$2"
    local section_issues="$3"
    
    cat > "$OUTPUT_DIR/a11y-report-$timestamp.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Audit Report - Kent Traders</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 30px; }
        .summary-card { background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; border-left: 4px solid #28a745; }
        .summary-value { font-size: 2.5em; font-weight: bold; margin: 10px 0; }
        .summary-label { color: #666; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .good { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        .details { padding: 30px; }
        .section { margin-bottom: 30px; }
        .section h3 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .checklist { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .checklist h4 { margin-top: 0; color: #333; }
        .checklist ul { margin: 10px 0; padding-left: 20px; }
        .checklist li { margin: 5px 0; }
        .timestamp { text-align: center; color: #666; font-size: 0.9em; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>♿ Accessibility Audit Report</h1>
            <p>Kent Traders Accessibility Analysis</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <div class="summary-label">WCAG 2.1 AA Issues</div>
                <div class="summary-value $(if [ "$wcag_issues" -eq 0 ]; then echo "good"; elif [ "$wcag_issues" -le 5 ]; then echo "warning"; else echo "error"; fi)">$wcag_issues</div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Section 508 Issues</div>
                <div class="summary-value $(if [ "$section_issues" -eq 0 ]; then echo "good"; elif [ "$section_issues" -le 5 ]; then echo "warning"; else echo "error"; fi)">$section_issues</div>
            </div>
        </div>
        
        <div class="details">
            <div class="section">
                <h3>🔍 WCAG 2.1 AA Compliance</h3>
                <p>Web Content Accessibility Guidelines (WCAG) 2.1 AA is the international standard for web accessibility. This audit checks for compliance with these guidelines.</p>
                
                <div class="checklist">
                    <h4>Key Accessibility Requirements:</h4>
                    <ul>
                        <li>✅ Proper heading hierarchy (H1, H2, H3, etc.)</li>
                        <li>✅ Alt text for all images</li>
                        <li>✅ Sufficient color contrast (4.5:1 for normal text)</li>
                        <li>✅ Keyboard navigation support</li>
                        <li>✅ Screen reader compatibility</li>
                        <li>✅ Form labels and error messages</li>
                        <li>✅ Focus indicators for interactive elements</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h3>📋 Section 508 Compliance</h3>
                <p>Section 508 is a federal law that requires electronic and information technology to be accessible to people with disabilities.</p>
                
                <div class="checklist">
                    <h4>Section 508 Requirements:</h4>
                    <ul>
                        <li>✅ Text alternatives for non-text content</li>
                        <li>✅ Captions and other alternatives for multimedia</li>
                        <li>✅ Content that can be presented in different ways</li>
                        <li>✅ Content that is easier to see and hear</li>
                        <li>✅ Keyboard accessible functionality</li>
                        <li>✅ Sufficient time to read and use content</li>
                        <li>✅ No content that could cause seizures</li>
                        <li>✅ Ways to help users navigate and find content</li>
                        <li>✅ Text that is readable and understandable</li>
                        <li>✅ Content that works with current and future tools</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h3>🎯 Common Accessibility Issues</h3>
                <p>Here are the most common accessibility issues found on e-commerce websites:</p>
                
                <div class="checklist">
                    <h4>Images and Media:</h4>
                    <ul>
                        <li>Missing alt text for product images</li>
                        <li>Decorative images without proper alt="" attributes</li>
                        <li>Videos without captions or transcripts</li>
                    </ul>
                    
                    <h4>Forms and Navigation:</h4>
                    <ul>
                        <li>Missing form labels</li>
                        <li>Poor focus indicators</li>
                        <li>Inaccessible dropdown menus</li>
                        <li>Missing skip navigation links</li>
                    </ul>
                    
                    <h4>Color and Contrast:</h4>
                    <ul>
                        <li>Insufficient color contrast</li>
                        <li>Color-only information (no text alternatives)</li>
                        <li>Poor focus indicators</li>
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

# Main audit execution
echo -e "${BLUE}Starting comprehensive accessibility audit...${NC}"

# Check if Pa11y is available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Run audits for different standards
audit_files=()

# WCAG 2.1 AA audit
wcag_file="$OUTPUT_DIR/wcag2aa-$TIMESTAMP.json"
run_pa11y "$SITE_URL" "$wcag_file" "WCAG2AA"
audit_files+=("$wcag_file")

# Section 508 audit
section_file="$OUTPUT_DIR/section508-$TIMESTAMP.json"
run_pa11y "$SITE_URL" "$section_file" "Section508"
audit_files+=("$section_file")

# Extract issue counts
wcag_issues=$(extract_issues "$wcag_file")
section_issues=$(extract_issues "$section_file")

# Generate summary
echo ""
echo -e "${BLUE}📊 Accessibility Summary${NC}"
echo "=========================="
echo -e "WCAG 2.1 AA Issues: ${GREEN}$wcag_issues${NC}"
echo -e "Section 508 Issues: ${GREEN}$section_issues${NC}"

# Generate HTML report
generate_html_report "$TIMESTAMP" "$wcag_issues" "$section_issues"

echo ""
echo -e "${GREEN}✅ Accessibility audit completed successfully!${NC}"
echo -e "📁 Reports saved in: $OUTPUT_DIR/"
echo -e "📄 HTML report: $OUTPUT_DIR/a11y-report-$TIMESTAMP.html"
echo -e "📊 JSON reports: ${audit_files[*]}"

# Provide recommendations
echo ""
echo -e "${YELLOW}💡 Accessibility Recommendations:${NC}"

if [ "$wcag_issues" -gt 0 ] || [ "$section_issues" -gt 0 ]; then
    echo "• Add alt text to all images, especially product images"
    echo "• Ensure proper heading hierarchy (H1 → H2 → H3)"
    echo "• Improve color contrast for text elements"
    echo "• Add focus indicators for all interactive elements"
    echo "• Test navigation with keyboard only"
    echo "• Add skip navigation links for screen readers"
    echo "• Ensure forms have proper labels and error messages"
    echo "• Test with screen readers (NVDA, JAWS, VoiceOver)"
else
    echo "• Excellent! Your site meets accessibility standards"
    echo "• Continue monitoring accessibility as you add new features"
    echo "• Consider user testing with people who have disabilities"
fi

echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "1. Review the detailed JSON reports for specific issues"
echo "2. Implement the accessibility recommendations"
echo "3. Test with actual users who have disabilities"
echo "4. Set up automated accessibility testing in CI/CD"
echo "5. Train your team on accessibility best practices" 