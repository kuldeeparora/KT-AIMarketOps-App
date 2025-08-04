const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function fixKPIVisualization(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Add the TooltipProps interface at the top of the file if it doesn't exist
    if (!content.includes('interface TooltipProps')) {
      const importIndex = content.lastIndexOf('import') + content.split('import').pop().indexOf(';') + 1;
      const beforeImports = content.substring(0, importIndex);
      const afterImports = content.substring(importIndex);
      
      const tooltipInterface = `
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: any; name: string; [key: string]: any }>;
  label?: string | number;
}
`;
      content = beforeImports + tooltipInterface + afterImports;
    }
    
    // Update the CustomTooltip component to use the TooltipProps
    content = content.replace(
      /const\s+CustomTooltip\s*=\s*\(\{\s*active\s*,\s*payload\s*,\s*label\s*}\s*:\s*unknown\s*\)/,
      'const CustomTooltip = ({ active, payload, label }: TooltipProps)'
    );
    
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`✅ Fixed TypeScript types in ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

async function updateESLintConfig() {
  const eslintPath = path.join(process.cwd(), 'admin-dashboard', '.eslintrc.js');
  try {
    let content = await fs.readFile(eslintPath, 'utf8');
    
    // Add project to parserOptions if it doesn't exist
    if (!content.includes('project:')) {
      content = content.replace(
        /parserOptions:\s*{([^}]*)}/s,
        'parserOptions: {$1    project: \'./tsconfig.json\',\n    }'
      );
      await fs.writeFile(eslintPath, content, 'utf8');
      console.log('✅ Updated ESLint configuration');
      return true;
    }
  } catch (error) {
    console.error('❌ Error updating ESLint config:', error.message);
    return false;
  }
}

async function installDependencies() {
  try {
    console.log('Installing dependencies...');
    execSync('cd admin-dashboard && npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    return false;
  }
}

async function cleanAndBuild() {
  try {
    console.log('Cleaning and rebuilding...');
    execSync('cd admin-dashboard && rm -rf .next node_modules/.cache', { stdio: 'inherit' });
    execSync('cd admin-dashboard && npm install', { stdio: 'inherit' });
    execSync('cd admin-dashboard && npm run build', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('❌ Error during clean and build:', error.message);
    return false;
  }
}

async function main() {
  const fs = require('fs');
  const kpiVisualizationPath = path.join(process.cwd(), 'admin-dashboard', 'components', 'Dashboard', 'KPIVisualization.tsx');
  
  console.log('🚀 Starting to fix TypeScript and ESLint issues...');
  
  try {
    // Step 1: Install required dependencies
    console.log('Step 1/4: Installing required dependencies...');
    await installDependencies();
    
    // Step 2: Fix KPIVisualization.tsx
    console.log('\nStep 2/4: Checking KPIVisualization component...');
    if (fs.existsSync(kpiVisualizationPath)) {
      await fixKPIVisualization(kpiVisualizationPath);
    } else {
      console.log('⚠️  KPIVisualization.tsx not found, skipping...');
    }
    
    // Step 3: Update ESLint config
    console.log('\nStep 3/4: Updating ESLint configuration...');
    await updateESLintConfig();
    
    // Step 4: Clean and rebuild
    console.log('\nStep 4/4: Cleaning and rebuilding...');
    await cleanAndBuild();
    
    console.log('\n✨ All done! Try running the application now with:');
    console.log('  cd admin-dashboard && npm run dev');
  } catch (error) {
    console.error('\n❌ An error occurred:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
