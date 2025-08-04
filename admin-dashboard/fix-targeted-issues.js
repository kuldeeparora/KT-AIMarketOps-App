const fs = require('fs');
const path = require('path');

// Function to fix specific known issues without being too aggressive
function fixTargetedIssues(content, filePath) {
  let fixed = content;
  
  // Fix 1: Remove trailing commas before closing braces/brackets
  fixed = fixed.replace(/,\s*}/g, '}');
  fixed = fixed.replace(/,\s*]/g, ']');
  
  // Fix 2: Fix specific reports/generate.js issue
  if (filePath.includes('reports/generate.js')) {
    fixed = fixed.replace(/},\s*};/g, '}\n  };');
  }
  
  // Fix 3: Fix missing commas in object literals (only when clearly missing)
  fixed = fixed.replace(/(\w+):\s*([^,\n]+)\s*\n\s*(\w+):/g, '$1: $2,\n    $3:');
  
  // Fix 4: Fix malformed object declarations
  fixed = fixed.replace(/{\s*,/g, '{');
  fixed = fixed.replace(/\[\s*,/g, '[');
  
  return fixed;
}

// Function to process specific files with known issues
function fixSpecificFiles() {
  console.log('🔧 Fixing specific known issues...\n');
  
  const filesToFix = [
    'pages/api/reports/generate.js',
    'pages/api/sellerdynamics/comprehensive.js',
    'pages/api/suppliers/integration.js',
    'pages/api/warehouses/locations.js'
  ];
  
  let fixedCount = 0;
  
  for (const filePath of filesToFix) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        const fixedContent = fixTargetedIssues(content, filePath);
        
        if (originalContent !== fixedContent) {
          fs.writeFileSync(fullPath, fixedContent);
          console.log(`✅ Fixed: ${filePath}`);
          fixedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
      }
    }
  }
  
  console.log(`\n🎉 Fixed ${fixedCount} files`);
  return fixedCount;
}

// Function to manually fix the reports/generate.js issue
function fixReportsGenerate() {
  console.log('\n🔧 Manually fixing reports/generate.js...');
  
  const reportsPath = path.join(__dirname, 'pages', 'api', 'reports', 'generate.js');
  if (fs.existsSync(reportsPath)) {
    let content = fs.readFileSync(reportsPath, 'utf8');
    
    // Find and fix the specific issue around line 194
    const lines = content.split('\n');
    let fixed = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Fix the specific semicolon issue
      if (line.includes('},') && lines[i + 1] && lines[i + 1].includes('};')) {
        lines[i] = line.replace(/},$/, '}');
        lines[i + 1] = lines[i + 1].replace(/^/, '  ');
        fixed = true;
        console.log(`✅ Fixed line ${i + 1}: ${line.trim()} -> ${lines[i].trim()}`);
      }
    }
    
    if (fixed) {
      const newContent = lines.join('\n');
      fs.writeFileSync(reportsPath, newContent);
      console.log('✅ Fixed reports/generate.js');
    }
  }
}

// Main execution
console.log('🚀 Starting targeted syntax fix...\n');

fixSpecificFiles();
fixReportsGenerate();

console.log('\n✨ Targeted fixes applied!');
console.log('📝 Run "npx eslint pages/api/ --fix --quiet" to verify fixes');
console.log('🏗️  Run "npm run build" to test the build'); 