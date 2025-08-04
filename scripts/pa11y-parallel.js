#!/usr/bin/env node
// Run Pa11y accessibility audits in parallel for all URLs in sitemap-urls.txt
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONCURRENCY = 4; // Number of parallel audits
const URLS_FILE = 'sitemap-urls.txt';
const REPORTS_DIR = 'pa11y-reports';

if (!fs.existsSync(URLS_FILE)) {
  console.error(`${URLS_FILE} not found!`);
  process.exit(1);
}
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR);
}

const urls = fs.readFileSync(URLS_FILE, 'utf-8')
  .split(/\r?\n/)
  .map(u => u.trim())
  .filter(Boolean);

let running = 0;
let index = 0;
let failed = 0;

function safeName(url) {
  return url.replace(/^https?:\/\//, '').replace(/\//g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
}

function runNext() {
  if (index >= urls.length) {
    if (running === 0) {
      process.exit(failed ? 1 : 0);
    }
    return;
  }
  while (running < CONCURRENCY && index < urls.length) {
    const url = urls[index++];
    running++;
    const reportFile = path.join(REPORTS_DIR, `pa11y-${safeName(url)}.html`);
    console.log(`Auditing ${url} ...`);
    exec(`pa11y "${url}" --reporter html > "${reportFile}"`, (err, stdout, stderr) => {
      if (stderr) process.stderr.write(stderr);
      if (err) {
        console.error(`Audit failed for ${url}`);
        failed++;
      }
      running--;
      runNext();
    });
  }
}

runNext(); 