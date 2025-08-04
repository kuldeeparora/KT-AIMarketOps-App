#!/bin/bash

# Navigate to the admin-dashboard directory
cd "$(dirname "$0")/../admin-dashboard" || exit 1

echo "🚀 Starting dependency resolution..."

# Clean up any existing node_modules and lock files
echo "🧹 Cleaning up existing dependencies..."
rm -rf node_modules package-lock.json

# Install dependencies with --legacy-peer-deps to resolve React version conflicts
echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

# Install required ESLint plugins
echo "🔧 Installing ESLint plugins..."
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin@^5.0.0 eslint-plugin-react@^7.28.0 eslint-plugin-react-hooks@^4.3.0 --legacy-peer-deps

# Update the ESLint configuration
echo "⚙️  Updating ESLint configuration..."
cat > .eslintrc.js << 'EOL'
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  rules: {
    // Allow unused vars that start with underscore
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_'
      }
    ],
    // Other rules
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@next/next/no-img-element': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'semi': ['warn', 'always'],
    'quotes': ['warn', 'single', { avoidEscape: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    '*.d.ts',
    '*.generated.ts',
  ],
};
EOL

echo "✅ Done! Try running the application with:"
echo "   cd admin-dashboard && npm run dev"
