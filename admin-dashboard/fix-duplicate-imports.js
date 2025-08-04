const fs = require('fs');
const path = require('path');

// Files that need duplicate import fixes
const filesToFix = [
  'pages/seo-automation.jsx',
  'pages/user-activity.jsx',
  'pages/vendor-management.jsx',
  'pages/inventory-intelligence-simple.jsx'
];

function fixDuplicateImports(filePath) {
  const fullPath = path.join(__dirname, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Find the import section
  const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]@mui\/icons-material['"];?/gs);
  
  if (importMatch) {
    const importContent = importMatch[0];
    
    // Extract all icon imports
    const iconMatches = importContent.match(/(\w+)\s+as\s+(\w+Icon)/g);
    
    if (iconMatches) {
      // Create a map to track unique imports
      const uniqueImports = new Map();
      
      iconMatches.forEach(match => {
        const [, originalName, alias] = match.match(/(\w+)\s+as\s+(\w+Icon)/);
        uniqueImports.set(alias, originalName);
      });
      
      // Rebuild the import statement
      const newImportContent = `import {\n  ${Array.from(uniqueImports.entries())
        .map(([alias, originalName]) => `  ${originalName} as ${alias}`)
        .join(',\n')}\n} from '@mui/icons-material';`;
      
      // Replace the old import with the new one
      content = content.replace(importMatch[0], newImportContent);
      
      // Write the fixed content back
      fs.writeFileSync(fullPath, content);
      console.log(`Fixed duplicate imports in ${filePath}`);
    }
  }
}

// Fix all files
filesToFix.forEach(fixDuplicateImports);
console.log('Duplicate import fixes completed!'); 