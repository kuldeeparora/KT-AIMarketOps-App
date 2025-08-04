#!/bin/bash
# fix-sellerdynamics-soap.sh - Fix SOAP headers in all SellerDynamics API files

echo "🔧 Fixing SellerDynamics SOAP Headers..."

# Find all sellerdynamics API files
SELLERDYNAMICS_FILES=$(find pages/api -name "*sellerdynamics*" -type f)

echo "Found files to fix:"
echo "$SELLERDYNAMICS_FILES"

# Create backup
echo "Creating backup..."
mkdir -p backups/sellerdynamics-$(date +%Y%m%d-%H%M%S)
for file in $SELLERDYNAMICS_FILES; do
    cp "$file" "backups/sellerdynamics-$(date +%Y%m%d-%H%M%S)/"
done

# Fix SOAP Action headers
echo "Fixing SOAP Action headers..."

# Pattern 1: Fix missing quotes around SOAPAction
sed -i.bak "s/'SOAPAction': 'http:\/\/sellerdynamics.com\/\([^']*\)'/'SOAPAction': '\"http:\/\/sellerdynamics.com\/\1\"'/g" $SELLERDYNAMICS_FILES

# Pattern 2: Ensure User-Agent is properly set
sed -i.bak "s/'User-Agent': '[^']*'/'User-Agent': 'Kent-Traders-Admin\/1.0'/g" $SELLERDYNAMICS_FILES

# Clean up .bak files
find pages/api -name "*.bak" -delete

echo "✅ SOAP headers fixed!"
echo "📋 Changes made:"
echo "   - Added quotes around SOAPAction values"
echo "   - Standardized User-Agent headers"
echo "   - Created backup in backups/ directory"

echo ""
echo "🔍 Next steps:"
echo "1. Test the SellerDynamics API endpoints"
echo "2. Deploy changes to Vercel"
echo "3. Monitor production logs for improvements"
