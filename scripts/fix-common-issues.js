const fs = require('fs');
const path = require('path');

// Helper to process files
async function processFile(filePath) {
  try {
    let content = await fs.promises.readFile(filePath, 'utf8');
    let modified = false;
    const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');

    // 1. Fix TypeScript type issues
    if (isTypeScript) {
      // Replace any with more specific types
      content = content.replace(/: any\b/g, ': unknown');
      content = content.replace(/: any\[\]/g, ': unknown[]');
      
      // Add missing return types
      content = content.replace(
        /(const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*{/g,
        '$1 $2 = ($3): any => {'
      );
      
      // Add missing type annotations
      content = content.replace(
        /(const|let|var)\s+(\w+)\s*=\s*{/g,
        (match, decl, varName) => {
          if (!content.includes(`interface ${varName}`) && 
              !content.includes(`type ${varName} =`)) {
            return `${decl} ${varName}: any = {`;
          }
          return match;
        }
      );
    }

    // 2. Fix React issues
    if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
      // Add missing key props in map functions
      content = content.replace(
        /\.map\(\((\w+)(?:\s*,\s*(\w+))?\)\s*=>\s*<(\w+)/g,
        (match, item, index, component) => {
          const key = index ? `key={${index}}` : `key={${item}.id || index}`;
          return `.map((${item}${index ? `, ${index}` : ''}) => <${component} ${key}`;
        }
      );

      // Convert img to Next.js Image
      content = content.replace(
        /<img([^>]*)src=(["'])(.*?)\2([^>]*)>/g,
        (match, before, quote, src, after) => {
          // Skip if already has width/height
          if (before.includes('width=') || before.includes('height=') || after.includes('width=') || after.includes('height=')) {
            return match;
          }
          return `<Image${before}src=${quote}${src}${quote}${after} width={500} height={300} alt="" />`;
        }
      );

      // Fix unescaped entities in JSX
      content = content.replace(
        /(['"])([^'"]*?)(['"])/g,
        (match, open, content, close) => {
          if (content.includes('"') || content.includes("'")) {
            return `${open}${content.replace(/"/g, '&quot;')}${close}`;
          }
          return match;
        }
      );
    }

    // 3. Add missing imports
    const imports = [];
    
    if (content.includes('<Image') && !content.includes("from 'next/image'")) {
      imports.push("import Image from 'next/image';\n");
    }
    
    if (content.includes('useState') && !content.includes("from 'react'")) {
      imports.push("import { useState } from 'react';\n");
    }
    
    if (content.includes('useEffect') && !content.includes("from 'react'")) {
      imports.push("import { useEffect } from 'react';\n");
    }
    
    if (imports.length > 0) {
      content = imports.join('') + content;
      modified = true;
    }

    // 4. Fix common async/await issues
    content = content.replace(
      /(const|let|var)\s+(\w+)\s*=\s*async\s*\(([^)]*)\)\s*=>/g,
      '$1 $2 = async ($3): Promise<any> =>'
    );

    // 5. Fix missing semicolons
    content = content.replace(/([^;\s])(\s*\r?\n\s*[\])}"'])/g, '$1;$2');

    if (content !== (await fs.promises.readFile(filePath, 'utf8'))) {
      await fs.promises.writeFile(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
  return false;
}

// Process all files
async function processDirectory(directory) {
  const files = await fs.promises.readdir(directory, { withFileTypes: true });
  let fixedCount = 0;

  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      fixedCount += await processDirectory(fullPath);
    } else if (
      ['.ts', '.tsx', '.js', '.jsx'].includes(path.extname(file.name)) &&
      !file.name.endsWith('.d.ts')
    ) {
      if (await processFile(fullPath)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

// Run the script
(async () => {
  console.log('🚀 Starting advanced fix process...');
  const rootDir = path.join(process.cwd(), 'admin-dashboard');
  const fixedCount = await processDirectory(rootDir);
  console.log(`\n✨ Fixed ${fixedCount} files.`);

  console.log('\n🔍 Running ESLint with --fix...');
  try {
    const { execSync } = require('child_process');
    execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --fix', { 
      cwd: rootDir,
      stdio: 'inherit' 
    });
  } catch (error) {
    console.log('⚠️ Some issues may require manual fixing.');
  }
})();