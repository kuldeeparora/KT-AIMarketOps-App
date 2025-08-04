# Cost Sync Dashboard

## Overview
The Cost Sync Dashboard provides automated cost price management for Shopify products with audit trail logging.

## Features

### 1. Web Dashboard (`/cost-sync-dashboard`)
- **CSV Upload**: Upload a CSV file with SKU and Cost columns
- **Preview**: Review the data before syncing
- **Manual Sync**: Trigger cost updates immediately
- **Audit Trail**: View all cost changes with filtering by SKU
- **Real-time Results**: See success/failure counts after sync

### 2. API Endpoints

#### POST `/api/shopify/cost-sync`
Accepts CSV file upload or JSON array of cost updates.

**CSV Format:**
```csv
sku,cost
ABC123,25.50
DEF456,30.00
```

**JSON Format:**
```json
[
  {"sku": "ABC123", "cost": 25.50},
  {"sku": "DEF456", "cost": 30.00}
]
```

**Response:**
```json
{
  "results": [
    {"sku": "ABC123", "success": true},
    {"sku": "DEF456", "success": false, "error": "SKU not found"}
  ]
}
```

#### GET `/api/shopify/audit-log`
Returns all cost change audit entries.

**Response:**
```json
{
  "logs": [
    {
      "timestamp": "2024-01-15T10:30:00.000Z",
      "user": "admin",
      "sku": "ABC123",
      "inventoryItemId": "123456",
      "oldCost": 20.00,
      "newCost": 25.50
    }
  ]
}
```

### 3. Standalone Script
Run cost sync from command line or cron job.

**Usage:**
```bash
# Set environment variables
export SHOPIFY_SHOP="your-shop.myshopify.com"
export SHOPIFY_ACCESS_TOKEN=your_shopify_access_token_here

# Run sync
node scripts/cost-sync-script.js path/to/cost-updates.csv
```

**Cron Example:**
```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/admin-dashboard && node scripts/cost-sync-script.js /path/to/daily-costs.csv
```

## Setup

### 1. Environment Variables
Add to your `.env` file:
```
SHOPIFY_SHOP=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token_here
```

### 2. Dependencies
```bash
npm install formidable
```

### 3. File Permissions
```bash
chmod +x scripts/cost-sync-script.js
```

## Usage Examples

### Manual Sync via Dashboard
1. Navigate to `/cost-sync-dashboard`
2. Upload a CSV file with SKU and Cost columns
3. Review the preview data
4. Click "Trigger Cost Sync"
5. View results and audit trail

### Automated Sync via Script
1. Create a CSV file with cost updates
2. Run the script: `node scripts/cost-sync-script.js updates.csv`
3. Check the audit log for results

### API Integration
```javascript
// Upload CSV file
const formData = new FormData();
formData.append('csv', csvFile);

const response = await fetch('/api/shopify/cost-sync', {
  method: 'POST',
  body: formData,
  headers: { 'x-user': 'admin' }
});

// Send JSON array
const response = await fetch('/api/shopify/cost-sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify([
    { sku: 'ABC123', cost: 25.50 },
    { sku: 'DEF456', cost: 30.00 }
  ])
});
```

## Audit Trail

All cost changes are logged to `audit-cost-changes.log` with:
- Timestamp
- User (from x-user header)
- SKU
- Inventory Item ID
- Old Cost
- New Cost

## Error Handling

- **SKU Not Found**: Product doesn't exist in Shopify
- **Invalid Cost**: Non-numeric cost value
- **API Errors**: Shopify API communication issues
- **File Errors**: Invalid CSV format or missing file

## Security Notes

- Access tokens should have appropriate Shopify permissions
- Audit logs contain sensitive cost information
- Consider implementing user authentication for production use
- Validate CSV data before processing

## Troubleshooting

### Common Issues

1. **"SKU not found" errors**
   - Verify SKUs exist in your Shopify store
   - Check for typos or extra spaces in CSV

2. **"Shopify credentials not configured"**
   - Ensure SHOPIFY_SHOP and SHOPIFY_ACCESS_TOKEN are set
   - Verify access token has inventory permissions

3. **CSV parsing errors**
   - Ensure CSV has "sku" and "cost" headers
   - Check for proper comma separation
   - Verify cost values are numeric

4. **Script fails to connect**
   - Ensure the admin dashboard is running on localhost:3000
   - Check network connectivity and firewall settings 