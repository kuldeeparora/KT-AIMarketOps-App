# SellerDynamics Real Data Integration Setup

This guide explains how to configure the dashboard to use real SellerDynamics data instead of mock data.

## Overview

The dashboard now supports real-time data from SellerDynamics API. When properly configured, it will fetch:
- Stock levels
- Product information
- Order data
- Analytics and insights

## Environment Variables Setup

### 1. Create Environment File

Create a `.env.local` file in the `admin-dashboard` directory:

```bash
# SellerDynamics API Configuration
SELLERDYNAMICS_SOAP_ENDPOINT=https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx
SELLERDYNAMICS_ENCRYPTED_LOGIN=your-encrypted-login-here
SELLERDYNAMICS_RETAILER_ID=your-retailer-id-here
SELLERDYNAMICS_PAGE_SIZE=1000
SELLERDYNAMICS_MAX_PAGES=100

# Optional: Force mock data (for testing)
USE_MOCK_SELLERDYNAMICS=false
```

### 2. Get Your SellerDynamics Credentials

To obtain your SellerDynamics API credentials:

1. **Contact SellerDynamics Support**
   - Email: support@sellerdynamics.com
   - Phone: [Your SellerDynamics contact number]

2. **Request API Access**
   - Ask for SOAP API access
   - Request your encrypted login credentials
   - Get your retailer ID

3. **API Documentation**
   - SOAP Endpoint: `https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx`
   - Available Methods:
     - `GetStockLevels`
     - `GetProducts`
     - `GetOrders`

## Configuration Steps

### Step 1: Install Dependencies

```bash
cd admin-dashboard
npm install axios xml2js
```

### Step 2: Set Environment Variables

1. Copy the environment variables above to your `.env.local` file
2. Replace the placeholder values with your actual SellerDynamics credentials
3. Restart your development server

### Step 3: Test the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard
3. Check the data source indicator in the top-right corner
4. It should show "Real Data" with a green checkmark

## API Methods Supported

### Stock Levels
- **Method**: `GetStockLevels`
- **Returns**: Current stock levels for all products
- **Fields**: SKU, ProductName, Quantity, AllocatedQuantity, Price, Cost, Vendor, Category

### Products
- **Method**: `GetProducts`
- **Returns**: Product catalog information
- **Fields**: ProductId, SKU, ProductName, Description, Price, Cost, Vendor, Category

### Orders
- **Method**: `GetOrders`
- **Returns**: Order history and current orders
- **Fields**: OrderId, OrderNumber, CustomerName, OrderDate, Status, TotalAmount

## Data Flow

```
SellerDynamics API → sellerDynamicsService.js → API Endpoints → React Hooks → Dashboard Components
```

1. **Service Layer** (`lib/sellerdynamicsService.js`)
   - Handles API communication
   - Parses XML responses
   - Provides fallback to mock data

2. **API Endpoints** (`pages/api/dashboard-stats.js`)
   - Exposes data to frontend
   - Handles error responses
   - Provides metadata about data source

3. **React Hooks** (`hooks/useSellerDynamicsData.js`)
   - Manages data fetching
   - Handles loading states
   - Auto-refreshes data

4. **Dashboard Components**
   - Displays real-time data
   - Shows data source indicators
   - Provides refresh functionality

## Troubleshooting

### Common Issues

1. **"Using Mock Data" Message**
   - Check that all environment variables are set
   - Verify credentials are correct
   - Check network connectivity to SellerDynamics

2. **API Errors**
   - Verify SOAP endpoint URL
   - Check encrypted login format
   - Confirm retailer ID is correct

3. **Slow Data Loading**
   - Reduce `SELLERDYNAMICS_PAGE_SIZE`
   - Increase timeout values
   - Check network latency

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```bash
DEBUG_SELLERDYNAMICS=true
```

This will log detailed API requests and responses to the console.

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use different credentials for development and production
   - Rotate credentials regularly

2. **API Access**
   - Limit API access to necessary IP addresses
   - Monitor API usage for unusual activity
   - Set up alerts for failed authentication

3. **Data Handling**
   - All data is processed server-side
   - No sensitive credentials are exposed to the frontend
   - Implement rate limiting for API calls

## Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all SellerDynamics variables

2. Deploy with:
   ```bash
   vercel --prod
   ```

### Other Platforms

For other deployment platforms, add the environment variables to your hosting provider's configuration.

## Monitoring and Maintenance

### Health Checks

The dashboard includes built-in health checks:

1. **Data Source Indicator**: Shows whether real or mock data is being used
2. **Last Updated Timestamp**: Shows when data was last refreshed
3. **Error Alerts**: Displays API errors to users

### Regular Maintenance

1. **Monitor API Usage**: Check SellerDynamics API usage limits
2. **Update Credentials**: Rotate API credentials regularly
3. **Test Connections**: Regularly test API connectivity
4. **Review Logs**: Monitor for API errors or timeouts

## Support

If you encounter issues:

1. **Check the console logs** for detailed error messages
2. **Verify your credentials** with SellerDynamics support
3. **Test API connectivity** using curl or Postman
4. **Contact development team** for technical support

## Example Configuration

Here's a complete example `.env.local` file:

```bash
# SellerDynamics Configuration
SELLERDYNAMICS_SOAP_ENDPOINT=https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx
SELLERDYNAMICS_ENCRYPTED_LOGIN=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
SELLERDYNAMICS_RETAILER_ID=KT001
SELLERDYNAMICS_PAGE_SIZE=1000
SELLERDYNAMICS_MAX_PAGES=100

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com

# Optional Debug Mode
DEBUG_SELLERDYNAMICS=false
USE_MOCK_SELLERDYNAMICS=false
```

## Next Steps

Once configured:

1. **Test the integration** by navigating to the dashboard
2. **Verify data accuracy** by comparing with SellerDynamics portal
3. **Set up monitoring** for API health and performance
4. **Train users** on the new real-time features
5. **Plan for scaling** as your data volume grows

The dashboard will now display real-time data from your SellerDynamics account, providing accurate inventory levels, order information, and business insights. 