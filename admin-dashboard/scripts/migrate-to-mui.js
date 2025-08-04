#!/usr/bin/env node

/**
 * Migration Script: Polaris to MUI Component Migration,
 * This script helps migrate components from Shopify Polaris to Material-UI
 */

const fs = require('fs');
const path = require('path');

// Component mapping from Polaris to MUI
const componentMappings = {
  // Core components
  'Card': 'Card',
  'Button': 'Button',
  'Text': 'Typography',
  'DataTable': 'DataGrid',
  'Modal': 'Dialog',
  'TextField': 'TextField',
  'Select': 'Select',
  'Badge': 'Chip',
  'Banner': 'Alert',
  'Spinner': 'CircularProgress',
  'Grid': 'Grid',
  'Stack': 'Stack',
  'Page': 'Container',
  'Frame': 'Box',
  
  // Form components
  'Checkbox': 'Checkbox',
  'RadioButton': 'Radio',
  'ChoiceList': 'RadioGroup',
  'FormLayout': 'Grid',
  
  // Navigation components
  'Navigation': 'Drawer',
  'TopBar': 'AppBar',
  'ResourceList': 'List',
  
  // Layout components
  'Layout': 'Box',
  'Section': 'Paper',
  'Subsection': 'Box',
  
  // Feedback components
  'Toast': 'Snackbar',
  'Loading': 'CircularProgress',
  'SkeletonBodyText': 'Skeleton',
  'SkeletonDisplayText': 'Skeleton',
  'SkeletonThumbnail': 'Skeleton',
  
  // Data display
  'DescriptionList': 'List',
  'EmptyState': 'Box',
  'ExceptionList': 'List',
  'Filters': 'Box',
  'Pagination': 'Pagination',
  'ResourceItem': 'ListItem',
  'Tabs': 'Tabs',
  'Tag': 'Chip',
  
  // Overlays
  'Sheet': 'Drawer',
  'Popover': 'Popover',
  'Tooltip': 'Tooltip',
  
  // Media
  'Avatar': 'Avatar',
  'Thumbnail': 'Avatar',
  
  // Actions
  'ActionList': 'List',
  'ButtonGroup': 'ButtonGroup',
  'IconButton': 'IconButton',
  'Link': 'Link',
  
  // Feedback
  'InlineError': 'FormHelperText',
  'Labelled': 'FormControl',
  'ProgressBar': 'LinearProgress'
};

// Import mapping
const importMappings = {
  '@shopify/polaris': '@mui/material',
  '@shopify/polaris-icons': '@mui/icons-material'
};

// Function to transform component names
function transformComponentName(polarisComponent) {
  return componentMappings[polarisComponent] || polarisComponent;
}

// Function to transform imports
function transformImports(content) {
  let transformed = content;
  
  // Transform Polaris imports to MUI
  Object.entries(importMappings).forEach(([polarisImport, muiImport]) => {
    const importRegex = new RegExp(`import\\s+{([^}]+)}\\s+from\\s+['"]${polarisImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
    transformed = transformed.replace(importRegex, (match, components) => {
      const transformedComponents = components
        .split(',')
        .map(comp => comp.trim())
        .map(comp => {
          const [name, alias] = comp.split(' as ');
          const transformedName = transformComponentName(name);
          return alias ? `${transformedName} as ${alias}` : transformedName;
        })
        .join(', ');
      
      return `import { ${transformedComponents} } from '${muiImport}'`;
    });
  });
  
  return transformed;
}

// Function to transform component usage
function transformComponentUsage(content) {
  let transformed = content;
  
  // Transform component names in JSX
  Object.entries(componentMappings).forEach(([polarisComponent, muiComponent]) => {
    const componentRegex = new RegExp(`<${polarisComponent}\\b`, 'g');
    transformed = transformed.replace(componentRegex, `<${muiComponent}`);
  });
  
  return transformed;
}

// Function to migrate a file
function migrateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let migrated = content;
    
    // Transform imports
    migrated = transformImports(migrated);
    
    // Transform component usage
    migrated = transformComponentUsage(migrated);
    
    // Write the migrated content
    fs.writeFileSync(filePath, migrated);
    console.log(`✅ Migrated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error migrating ${filePath}:`, error.message);
  }
}

// Function to find and migrate all JSX files
function migrateAllFiles(dir = '.') {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      migrateAllFiles(filePath);
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.tsx')) {
      migrateFile(filePath);
    }
  }
}

// Run the migration
console.log('🚀 Starting MUI migration...');
migrateAllFiles();
console.log('🎉 Migration completed!');
