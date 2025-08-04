const fs = require('fs');

console.log('🔧 Fixing Image Loading Issues in Optimized Homepage');
console.log('===================================================');

// Read the optimized homepage
if (!fs.existsSync('./optimized-homepage.html')) {
    console.error('❌ optimized-homepage.html not found!');
    process.exit(1);
}

let html = fs.readFileSync('./optimized-homepage.html', 'utf8');

// Create backup
fs.writeFileSync('./optimized-homepage-backup.html', html);
console.log('✅ Created backup: optimized-homepage-backup.html');

console.log('🔧 Applying image loading fixes...');

// Fix 1: Remove lazy loading from critical above-the-fold images
// Header logo should load immediately
html = html.replace(
    /(<img[^>]*class="[^"]*header[^"]*logo[^"]*"[^>]*) loading="lazy"/gi,
    '$1'
);

// Fix 2: Remove lazy loading from all header images
html = html.replace(
    /(<div[^>]*class="[^"]*t4s-header[^"]*"[^>]*>[\s\S]*?<\/div>)/gi,
    function(headerSection) {
        return headerSection.replace(/ loading="lazy"/g, '');
    }
);

// Fix 3: Remove lazy loading from logo images specifically
html = html.replace(
    /(<img[^>]*src="[^"]*logo[^"]*"[^>]*) loading="lazy"/gi,
    '$1'
);

// Fix 4: Add preload hints for critical images in head section
const preloadHints = `
    <!-- Critical Image Preloading -->
    <link rel="preload" as="image" href="//kenttraders.co.uk/cdn/shop/files/logo1.png?v=1664386864&width=125">
    <link rel="preload" as="image" href="//kenttraders.co.uk/cdn/shop/files/logo-kt.webp?v=1707838288">
    
    <!-- Performance Critical Resource Hints -->`;

html = html.replace(
    '    <!-- Performance Critical Resource Hints -->',
    preloadHints
);

// Fix 5: Ensure hero/banner images (above-the-fold) are not lazy loaded
html = html.replace(
    /(<img[^>]*class="[^"]*banner[^"]*"[^>]*) loading="lazy"/gi,
    '$1'
);

html = html.replace(
    /(<img[^>]*class="[^"]*hero[^"]*"[^>]*) loading="lazy"/gi,
    '$1'
);

// Fix 6: Keep lazy loading for product images (below-the-fold) - this is good for performance
// No changes needed here

// Fix 7: Add image loading optimization script
const imageLoadingScript = `
<script>
// Ensure critical images load immediately
document.addEventListener('DOMContentLoaded', function() {
    // Force load header and logo images immediately
    const criticalImages = document.querySelectorAll('img[src*="logo"], .header img, .t4s-header img');
    criticalImages.forEach(img => {
        if (img.loading === 'lazy') {
            img.loading = 'eager';
        }
    });
    
    console.log('✅ Critical images set to eager loading');
});
</script>`;

// Add the script before closing body tag
html = html.replace('</body>', imageLoadingScript + '\n</body>');

// Write the fixed version
fs.writeFileSync('./optimized-homepage-fixed.html', html);

console.log('✅ Image loading fixes applied successfully!');
console.log('');
console.log('🎯 Fixes Applied:');
console.log('• Removed lazy loading from header/logo images');
console.log('• Added preload hints for critical images');
console.log('• Added script to ensure critical images load eagerly');
console.log('• Kept lazy loading for below-the-fold product images');
console.log('');
console.log('📁 Files Created:');
console.log('• optimized-homepage-backup.html (original backup)');
console.log('• optimized-homepage-fixed.html (ready for production)');
console.log('');
console.log('🚀 Next Steps:');
console.log('1. Test optimized-homepage-fixed.html locally');
console.log('2. Deploy to production to replace current version');
console.log('3. Verify all images load correctly');

// Quick validation
const criticalImageCount = (html.match(/loading="lazy"/g) || []).length;
const totalImageCount = (html.match(/<img/g) || []).length;

console.log('');
console.log('📊 Image Loading Analysis:');
console.log(`• Total images: ${totalImageCount}`);
console.log(`• Still lazy-loaded: ${criticalImageCount} (should be product images only)`);
console.log(`• Critical images: ${totalImageCount - criticalImageCount} (headers, logos)`);
