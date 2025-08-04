#!/usr/bin/env node
/**
 * Secret Scanner
 * Scans the codebase for potential secrets (API keys, tokens, passwords) outside .env files
 */
const fs = require('fs');
const path = require('path');
const IGNORED = ['.env', '.env.local', '.env.example', '.env.development', '.env.production'];
const SECRET_PATTERNS = [
  /(sk-|pk-|AKIA|ghp_|gho_)[a-zA-Z0-9]{20,}/g, // API keys
  /password\s*[:=]\s*['"][^'"]{8,}['"]/gi, // Passwords
  /token\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/gi, // Tokens
  /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g, // Private keys
  /(mongodb|postgresql|mysql):\/\/[^:]+:[^@]+@/g // DB URLs
];
function scanDir(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file === 'node_modules' || file.startsWith('.')) continue;
      results = results.concat(scanDir(fullPath));
    } else {
      if (IGNORED.some(ig => file.startsWith(ig))) continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of SECRET_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          results.push({ file: fullPath, pattern: pattern.toString(), count: matches.length });
        }
      }
    }
  }
  return results;
}
const results = scanDir(process.cwd());
if (results.length === 0) {
  console.log('✅ No secrets found outside .env files.');
} else {
  console.log('❌ Potential secrets found:');
  for (const r of results) {
    console.log(`File: ${r.file} | Pattern: ${r.pattern} | Count: ${r.count}`);
  }
  process.exit(1);
} 