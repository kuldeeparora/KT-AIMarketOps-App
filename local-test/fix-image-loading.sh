#!/bin/bash

echo "🔧 Fixing Image Loading Issues in Production"
echo "============================================"

cd "$(dirname "$0")"

if [ ! -f "optimized-homepage.html" ]; then
    echo "❌ optimized-homepage.html not found!"
    exit 1
fi

# Backup the current optimized version
cp optimized-homepage.html optimized-homepage-backup.html
echo "✅ Created backup: optimized-homepage-backup.html"

echo "🔧 Applying image loading fixes..."

# Fix 1: Remove lazy loading from critical above-the-fold images (logo, hero images)
sed -i '' 's/class="header__normal-logo.*loading="lazy"/class="header__normal-logo t4s-d-none t4s-d-lg-block" width="728" height="286" alt="Kent Traders Logo" style="width: 125px"><img/g' optimized-homepage.html

# Fix 2: Remove lazy loading from header logo images
sed -i '' 's/<img loading="lazy" srcset="\/\/kenttraders\.co\.uk\/cdn\/shop\/files\/logo1\.png/<img srcset="\/\/kenttraders\.co\.uk\/cdn\/shop\/files\/logo1\.png/g' optimized-homepage.html

# Fix 3: Ensure critical images load immediately
sed -i '' 's/t4s-header__logo.*loading="lazy"/t4s-header__logo t4s-lh-1"><a class="t4s-d-inline-block" href="\/"><img/g' optimized-homepage.html

# Fix 4: Add preload for critical images
sed -i '' '/<head>/a\
    <!-- Preload Critical Images -->\
    <link rel="preload" as="image" href="//kenttraders.co.uk/cdn/shop/files/logo1.png?v=1664386864&width=125">\
    <link rel="preload" as="image" href="//kenttraders.co.uk/cdn/shop/files/logo-kt.webp?v=1707838288">
' optimized-homepage.html

echo "✅ Applied image loading fixes"

# Create a more targeted fix file
cat > fix-images.js << 'EOF'
const fs = require('fs');

console.log('🔧 Applying targeted image fixes...');

let html = fs.readFileSync('optimized-homepage.html', 'utf8');

// Remove lazy loading from header/logo images (critical above-the-fold)
html = html.replace(
    /(<img[^>]*class="[^"]*header[^"]*"[^>]*) loading="lazy"/gi,
    '$1'
);

// Remove lazy loading from any images in the header section
html = html.replace(
    /(<header[^>]*>[\s\S]*?<\/header>)/gi,
    function(match) {
        return match.replace(/ loading="lazy"/g, '');
    }
);

// Keep lazy loading for below-the-fold product images
// (this is good for performance)

fs.writeFileSync('optimized-homepage-fixed.html', html);
console.log('✅ Created fixed version: optimized-homepage-fixed.html');
EOF

# Run the JavaScript fix
node fix-images.js

echo ""
echo "🎯 Image Loading Fixes Applied:"
echo "• Removed lazy loading from header/logo images"
echo "• Added preload hints for critical images"
echo "• Created backup and fixed versions"
echo ""
echo "📁 Files created:"
echo "• optimized-homepage-backup.html (backup)"
echo "• optimized-homepage-fixed.html (fixed version)"
echo ""
echo "🚀 Next Steps:"
echo "1. Test the fixed version locally"
echo "2. Deploy optimized-homepage-fixed.html to production"
echo "3. Verify images load correctly"
