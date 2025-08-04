#!/bin/bash

echo "🚀 Starting Visual Comparison Tool..."
echo "====================================="

cd "$(dirname "$0")"

if [ ! -f "visual-compare-server.js" ]; then
    echo "❌ visual-compare-server.js not found!"
    exit 1
fi

echo "📁 Working directory: $(pwd)"
echo "🔄 Starting server..."
echo ""

node visual-compare-server.js
