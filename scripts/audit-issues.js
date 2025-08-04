import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function getUnusedImports(filePath, content) {
  const imports = [];
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const [, importsList] = match;
    importsList.split(',').forEach(imp => {
      const varName = imp.trim().split(/\s+/)[0];
      if (varName && !content.match(new RegExp(`\\b${varName}\\b`, 'g'))?.length > 1) {
        imports.push({ varName, line: content.substr(0, match.index).split('\n').length });
      }
    });
  }
  
  return imports;
}

function getUnusedVars(filePath, content) {
  const vars = [];
  const varRegex = /^(const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=/gm;
  let match;
  
  while ((match = varRegex.exec(content)) !== null) {
    const [, , varName] = match;
    if (varName && !varName.startsWith('_') && 
        (content.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length <= 1) {
      const line = content.substr(0, match.index).split('\n').length;
      vars.push({ varName, line });
    }
  }
  
  return vars;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    
    const unusedImports = getUnusedImports(filePath, content);
    const unusedVars = getUnusedVars(filePath, content);
    
    if (unusedImports.length > 0 || unusedVars.length > 0) {
      console.log(`\n📄 ${relativePath}`);
      
      if (unusedImports.length > 0) {
        console.log('  🚫 Unused imports:');
        unusedImports.forEach(({ varName, line }) => {
          console.log(`    - Line ${line}: ${varName}`);
        });
      }
      
      if (unusedVars.length > 0) {
        console.log('  🚫 Unused variables:');
        unusedVars.forEach(({ varName, line }) => {
          console.log(`    - Line ${line}: ${varName}`);
        });
      }
    }
    
    return { unusedImports, unusedVars };
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { unusedImports: [], unusedVars: [] };
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let stats = { unusedImports: 0, unusedVars: 0, files: 0 };

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', '.git', '.cache', 'build', 'dist'].includes(entry.name)) {
        const subStats = processDirectory(fullPath);
        stats.unusedImports += subStats.unusedImports;
        stats.unusedVars += subStats.unusedVars;
        stats.files += subStats.files;
      }
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      const { unusedImports, unusedVars } = processFile(fullPath);
      stats.unusedImports += unusedImports.length;
      stats.unusedVars += unusedVars.length;
      stats.files += 1;
    }
  }
  
  return stats;
}

console.log('🔍 Auditing codebase for issues...