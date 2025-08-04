const fs = require('fs');

console.log('🔧 CRITICAL FIX: Removing lazy loading from critical above-the-fold images...');

// Read the optimized file
let optimizedContent = fs.readFileSync('./optimized-homepage.html', 'utf8');

// CRITICAL FIXES for images loading and disappearing

// 1. Remove loading="lazy" from LOGO images (most critical)
console.log('📋 Fix 1: Removing lazy loading from logo images...');
optimizedContent = optimizedContent.replace(
    /(<img[^>]*class="header__normal-logo[^>]*)\s*loading="lazy"/gi,
    '$1'
);
optimizedContent = optimizedContent.replace(
    /(<img[^>]*class="header__sticky-logo[^>]*)\s*loading="lazy"/gi,
    '$1'
);
optimizedContent = optimizedContent.replace(
    /(<img[^>]*alt="[^"]*[Ll]ogo[^"]*"[^>]*)\s*loading="lazy"/gi,
    '$1'
);

// 2. Remove loading="lazy" from any image in header section
console.log('📋 Fix 2: Removing lazy loading from header images...');
optimizedContent = optimizedContent.replace(
    /(class="[^"]*header[^"]*"[^>]*>[\s\S]*?<img[^>]*)\s*loading="lazy"([^>]*>[\s\S]*?<\/[^>]*>)/gi,
    '$1$2'
);

// 3. Add critical image stabilization CSS
console.log('📋 Fix 3: Adding image stabilization CSS...');
const criticalImageCSS = `
    <style id="critical-image-fix">
      /* CRITICAL: Prevent image loading/disappearing issues */
      .header__normal-logo,
      .header__sticky-logo,
      img[alt*="logo" i],
      img[alt*="Logo" i] {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
        transition: none !important;
      }
      
      /* Prevent layout shifts from images */
      img {
        max-width: 100%;
        height: auto;
        display: block;
      }
      
      /* Stabilize above-the-fold images */
      .t4s-header img,
      .hero img,
      .banner img {
        loading: eager !important;
      }
      
      /* Fix for lazy loading conflicts */
      img[loading="lazy"] {
        opacity: 1;
        visibility: visible;
      }
      
      /* Prevent image flashing */
      img {
        image-rendering: auto;
        image-rendering: crisp-edges;
        image-rendering: -webkit-optimize-contrast;
      }
    </style>`;

// Insert critical CSS after the existing critical CSS
optimizedContent = optimizedContent.replace(
    /(<style[^>]*>\s*\/\*\s*Above-the-fold styles[\s\S]*?<\/style>)/i,
    '$1\n' + criticalImageCSS
);

// 4. Add JavaScript fix for immediate image loading
console.log('📋 Fix 4: Adding JavaScript image loading fix...');
const imageLoadingFix = `
<script>
  // CRITICAL: Fix image loading issues immediately
  (function() {
    // Remove lazy loading from critical images
    function fixCriticalImages() {
      const criticalImages = document.querySelectorAll('img[loading="lazy"]');
      criticalImages.forEach(img => {
        // Remove lazy loading from logos and header images
        if (img.alt && (img.alt.toLowerCase().includes('logo') || 
            img.classList.contains('header__normal-logo') ||
            img.classList.contains('header__sticky-logo') ||
            img.closest('.t4s-header'))) {
          img.removeAttribute('loading');
          img.style.opacity = '1';
          img.style.visibility = 'visible';
          img.style.display = 'block';
        }
      });
    }
    
    // Run immediately
    fixCriticalImages();
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixCriticalImages);
    }
    
    // Run when everything is loaded
    window.addEventListener('load', fixCriticalImages);
    
    console.log('✅ Critical image loading fix applied');
  })();
</script>`;

// Insert before closing head tag
optimizedContent = optimizedContent.replace(
    /(<\/head>)/i,
    imageLoadingFix + '\n$1'
);

// 5. Fix any remaining above-the-fold lazy loading
console.log('📋 Fix 5: Removing lazy loading from first 10 images...');
let imageCount = 0;
optimizedContent = optimizedContent.replace(
    /<img([^>]*)\s*loading="lazy"([^>]*>)/gi,
    function(match, before, after) {
        imageCount++;
        if (imageCount <= 10) {
            // Remove lazy loading from first 10 images (above-the-fold)
            return `<img${before}${after}`;
        }
        return match; // Keep lazy loading for below-the-fold images
    }
);

// Write the fixed file
fs.writeFileSync('./optimized-homepage-FIXED.html', optimizedContent);

console.log('');
console.log('✅ CRITICAL FIXES APPLIED:');
console.log('   🔧 Removed lazy loading from logo images');
console.log('   🔧 Removed lazy loading from header images');
console.log('   🔧 Removed lazy loading from first 10 images');
console.log('   🔧 Added critical image stabilization CSS');
console.log('   🔧 Added JavaScript image loading fix');
console.log('');
console.log('📁 Fixed file created: optimized-homepage-FIXED.html');
console.log('');
console.log('🚀 DEPLOY THIS FIXED VERSION TO PRODUCTION');
console.log('   This should resolve the images loading/disappearing issue');
