#!/bin/bash

echo "Testing SellerDynamics API integration..."
echo "========================================="
echo

# Start the Next.js development server in the background
echo "Starting Next.js development server..."
cd /Users/kuldeep.arora/KT/shopify/KT/admin-dashboard
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Test the debug endpoint
echo "Testing debug endpoint..."
curl -s "http://localhost:3000/api/debug-sellerdynamics-direct" | head -c 1000
echo
echo

# Test the main inventory endpoint
echo "Testing main inventory endpoint..."
curl -s "http://localhost:3000/api/inventory?limit=3" | head -c 1000
echo
echo

# Stop the server
echo "Stopping server..."
kill $SERVER_PID

echo "Test completed."
