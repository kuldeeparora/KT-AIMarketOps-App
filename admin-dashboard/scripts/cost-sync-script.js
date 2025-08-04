#!/usr/bin/env node

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const CSV_FILE_PATH = process.argv[2] || './cost-updates.csv';

if (!SHOPIFY_SHOP || !SHOPIFY_ACCESS_TOKEN) {
  console.error('Error: SHOPIFY_SHOP and SHOPIFY_ACCESS_TOKEN environment variables are required');
  process.exit(1);
}

if (!fs.existsSync(CSV_FILE_PATH)) {
  console.error(`Error: CSV file not found at ${CSV_FILE_PATH}`);
  console.log('Usage: node cost-sync-script.js [path-to-csv-file]');
  process.exit(1);
}

async function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rows = content.split(/\r?\n/).map(line => line.split(','));
  const header = rows[0].map(h => h.trim().toLowerCase());
  const skuIdx = header.indexOf('sku');
  const costIdx = header.indexOf('cost');
  
  if (skuIdx === -1 || costIdx === -1) {
    throw new Error('CSV must have "sku" and "cost" columns');
  }
  
  return rows.slice(1).filter(r => r.length >= 2).map(r => ({
    sku: r[skuIdx].trim(),
    cost: parseFloat(r[costIdx])
  }));
}

async function triggerCostSync(updates) {
  const response = await fetch('http://localhost:3000/api/inventory/bulk-update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user': 'automated-script'
    },
    body: JSON.stringify({ updates })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

async function main() {
  try {
    console.log('Starting cost sync...');
    
    const updates = await parseCSV(CSV_FILE_PATH);
    console.log(`Found ${updates.length} updates to process`);
    
    const result = await triggerCostSync(updates);
    console.log('Cost sync completed successfully:', result);
    
  } catch (error) {
    console.error('Error during cost sync:', error.message);
    process.exit(1);
  }
}

main();