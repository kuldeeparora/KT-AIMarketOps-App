#!/bin/bash
# Extract all URLs from the Shopify sitemap (including sub-sitemaps)
# Usage: ./scripts/extract-sitemap-urls.sh [sitemap_url]
SITEMAP_URL=${1:-"http://localhost:9292/sitemap.xml"}
TMPDIR=$(mktemp -d)
OUTFILE="sitemap-urls.txt"

# Download the main sitemap
curl -s "$SITEMAP_URL" -o "$TMPDIR/sitemap.xml"

# Extract all <loc> entries (including sub-sitemaps) using awk for portability
awk -F'[<>]' '/<loc>/{print $3}' "$TMPDIR/sitemap.xml" | grep -E '^https?://' > "$TMPDIR/all-locs.txt"

# If there are sub-sitemaps, download and extract their URLs
> "$TMPDIR/all-urls.txt"
while read -r url; do
  if [[ "$url" =~ sitemap.*\.xml$ ]]; then
    curl -s "$url" -o "$TMPDIR/sub.xml"
    awk -F'[<>]' '/<loc>/{print $3}' "$TMPDIR/sub.xml" | grep -E '^https?://' >> "$TMPDIR/all-urls.txt"
  else
    echo "$url" >> "$TMPDIR/all-urls.txt"
  fi
done < "$TMPDIR/all-locs.txt"

# Filter out any .xml URLs from the final list
awk '!/\.xml($|\?)/' "$TMPDIR/all-urls.txt" > "$OUTFILE"

count=$(wc -l < "$OUTFILE")
echo "Extracted $count URLs from sitemap."

rm -rf "$TMPDIR"

# Update and install dependencies
sudo dnf update -y
sudo dnf install -y git curl

# Install Node.js 20 (LTS)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Install LHCI and Pa11y globally
sudo npm install -g @lhci/cli pa11y

# (Optional) Install build tools if needed
sudo dnf groupinstall -y "Development Tools"

ssh -i ~/.ssh/id_ed25519 opc@143.47.243.47