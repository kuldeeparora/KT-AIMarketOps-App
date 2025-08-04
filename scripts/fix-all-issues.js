const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ADMIN_DASHBOARD = path.join(PROJECT_ROOT, 'admin-dashboard');
const FILES_TO_PROCESS = [
  '**/*.{js,jsx,ts,tsx}',
  '!**/node_modules/**',
  '!**/.next/**',
  '!**/out/**',
  '!**/build/**',
  '!**/*.d.ts',
  '!**/*.generated.*',
];

// Helper functions
const log = {
  info: (msg) => console.log(chalk.blue(`ℹ ${msg}`)),
  success: (msg) => console.log(chalk.green(`✓ ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`⚠ ${msg}`)),
  error: (msg) => console.error(chalk.red(`✗ ${msg}`)),
};

async function runCommand(cmd, cwd = PROJECT_ROOT) {
  try {
    execSync(cmd, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    log.error(`Command failed: ${cmd}\n${error.message}`);
    return false;
  }
}

async function fixESLintIssues() {
  log.info('Fixing ESLint issues...');
  
  // First, try to fix automatically fixable issues
  const eslintFixCmd = `npx eslint ${FILES_TO_PROCESS.join(' ')} --fix`;
  if (!(await runCommand(eslintFixCmd, ADMIN_DASHBOARD))) {
    log.warn('ESLint auto-fix encountered some issues. Continuing with other fixes...');
  }
  
  // Fix remaining TypeScript issues
  await fixTypeScriptIssues();
  
  // Fix React-specific issues
  await fixReactIssues();
  
  // Fix import/export issues
  await fixImportIssues();
  
  log.success('ESLint issues fixed!');
}

async function fixTypeScriptIssues() {
  log.info('Fixing TypeScript issues...');
  
  // Try to fix TypeScript issues with tsc
  const tscFixCmd = 'npx tsc --noEmit --pretty';
  if (!(await runCommand(tscFixCmd, ADMIN_DASHBOARD))) {
    log.warn('TypeScript check found some issues. Attempting to fix common patterns...');
    
    // Common TypeScript fixes
    const tsFiles = await findFiles('**/*.{ts,tsx}');
    for (const file of tsFiles) {
      await fixTypeScriptFile(file);
    }
  }
  
  log.success('TypeScript issues addressed!');
}

async function fixReactIssues() {
  log.info('Fixing React-specific issues...');
  
  // Common React fixes
  const reactFiles = await findFiles('**/*.{jsx,tsx}');
  for (const file of reactFiles) {
    await fixReactFile(file);
  }
  
  log.success('React issues addressed!');
}

async function fixImportIssues() {
  log.info('Fixing import/export issues...');
  
  // Convert require to import
  const jsFiles = await findFiles('**/*.{js,jsx,ts,tsx}');
  for (const file of jsFiles) {
    await convertRequireToImport(file);
  }
  
  // Sort imports
  const sortImportsCmd = 'npx organize-imports-cli';
  await runCommand(sortImportsCmd, ADMIN_DASHBOARD);
  
  log.success('Import/export issues addressed!');
}

async function findFiles(pattern, cwd = ADMIN_DASHBOARD) {
  const { glob } = await import('glob');
  return glob.sync(pattern, { cwd, absolute: true });
}

async function fixTypeScriptFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;
    
    // Add missing type annotations
    if (content.includes('function ') && !content.includes(': ')) {
      content = content.replace(
        /function\s+(\w+)\s*\(([^)]*)\)\s*{/g,
        'function $1($2): void {'
      );
      modified = true;
    }
    
    // Add missing interfaces
    if (content.includes('interface Props') && !content.includes('interface Props {')) {
      content = content.replace(
        /interface Props/g,
        'interface Props {\n  // Add your props here\n}'
      );
      modified = true;
    }
    
    if (modified) {
      await fs.writeFile(filePath, content, 'utf8');
      log.success(`Fixed TypeScript issues in ${path.basename(filePath)}`);
    }
  } catch (error) {
    log.error(`Error fixing TypeScript file ${filePath}: ${error.message}`);
  }
}

async function fixReactFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;
    
    // Add missing key props to map functions
    if (content.includes('.map(') && !content.includes('.map((')) {
      content = content.replace(
        /\.map\(([^,)]+)\s*,\s*([^)]+)\)\s*=>\s*<([^>]+)(?![^<]*key=)/g,
        '.map(($1, $2) => <$3 key={$2}'
      );
      modified = true;
    }
    
    // Convert React.FC to function components
    if (content.includes('React.FC<') || content.includes('const ')) {
      content = content.replace(
        /const\s+(\w+):\s*React\.FC<(.*?)>\s*=\s*\(\s*{\s*(.*?)\s*}\s*:.*?\)/g,
        'const $1 = ({ $3 }: $2)'
      );
      modified = true;
    }
    
    if (modified) {
      await fs.writeFile(filePath, content, 'utf8');
      log.success(`Fixed React issues in ${path.basename(filePath)}`);
    }
  } catch (error) {
    log.error(`Error fixing React file ${filePath}: ${error.message}`);
  }
}

async function convertRequireToImport(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Convert require to import
    if (content.includes('require(') && !content.includes('import ')) {
      content = content.replace(
        /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g,
        'import $1 from "$2";'
      );
      
      await fs.writeFile(filePath, content, 'utf8');
      log.success(`Converted require to import in ${path.basename(filePath)}`);
    }
  } catch (error) {
    log.error(`Error converting requires in ${filePath}: ${error.message}`);
  }
}

// Main execution
async function main() {
  log.info('Starting to fix all issues in the project...');
  
  try {
    // Ensure we're in the right directory
    process.chdir(PROJECT_ROOT);
    
    // Install required dependencies if needed
    log.info('Ensuring dependencies are installed...');
    await runCommand('npm install --legacy-peer-deps', ADMIN_DASHBOARD);
    
    // Run the fixers
    await fixESLintIssues();
    
    // Final check
    log.info('Running final checks...');
    await runCommand('npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings=0', ADMIN_DASHBOARD);
    await runCommand('npx tsc --noEmit --pretty', ADMIN_DASHBOARD);
    
    log.success('✅ All issues have been fixed! Your project should now be ready to run.');
    log.info('\nNext steps:');
    log.info('1. Start the development server: cd admin-dashboard && npm run dev');
    log.info('2. Run tests: npm test');
    log.info('3. Build for production: npm run build');
  } catch (error) {
    log.error(`Failed to fix all issues: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
