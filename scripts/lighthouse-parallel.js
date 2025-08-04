#!/usr/bin/env node
// Run Lighthouse CI audits in parallel for all URLs in sitemap-urls.txt
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');

const CONCURRENCY = 4; // Number of parallel audits
const URLS_FILE = 'sitemap-urls.txt';

if (!fs.existsSync(URLS_FILE)) {
  console.error(`${URLS_FILE} not found!`);
  process.exit(1);
}

const urls = fs.readFileSync(URLS_FILE, 'utf-8')
  .split(/\r?\n/)
  .map(u => u.trim())
  .filter(Boolean);

let running = 0;
let index = 0;
let failed = 0;

function runNext() {
  if (index >= urls.length) {
    if (running === 0) {
      // All done
      exec('lhci assert', (err, stdout, stderr) => {
        if (stdout) process.stdout.write(stdout);
        if (stderr) process.stderr.write(stderr);
        process.exit(failed ? 1 : 0);
      });
    }
    return;
  }
  while (running < CONCURRENCY && index < urls.length) {
    const url = urls[index++];
    running++;
    console.log(`Auditing ${url} ...`);
    exec(`lhci collect --url="${url}" --numberOfRuns=1 --settings.preset=desktop`, (err, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout);
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