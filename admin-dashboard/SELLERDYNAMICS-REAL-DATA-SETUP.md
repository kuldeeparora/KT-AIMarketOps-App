# SellerDynamics Real Data Setup Guide

## Current Status
The system is currently using mock data because the SellerDynamics API is returning errors. Here's how to fix this:

## 🔍 **Diagnosis**

The SellerDynamics API is returning a 500 error with the message:
```
Server did not recognize the value of HTTP Header SOAPAction
```

This indicates one of these issues:
1. **Incorrect API endpoint**
2. **Wrong SOAP method names**
3. **Invalid credentials**
4. **API service is down**

## 🛠️ **Step-by-Step Fix**

### 1. Verify Your SellerDynamics Credentials

Check your `.env.local` file has these variables:
```bash
SELLERDYNAMICS_SOAP_ENDPOINT=https://your-sellerdynamics-endpoint.com/Service.asmx
SELLERDYNAMICS_ENCRYPTED_LOGIN=your-encrypted-login-string
SELLERDYNAMICS_RETAILER_ID=your-retailer-id
USE_MOCK_SELLERDYNAMICS=false
```

### 2. Test Your Credentials

Run this command to test your current setup:
```bash
curl -s "http://localhost:3001/api/debug-env" | jq '.'
```

### 3. Common Issues and Solutions

#### Issue A: Wrong API Endpoint
- **Symptom**: 500 errors or connection timeouts
- **Solution**: Contact SellerDynamics support for the correct endpoint URL
- **Format**: Should be something like `https://api.sellerdynamics.com/Service.asmx`

#### Issue B: Wrong SOAP Method Names
- **Symptom**: "Server did not recognize SOAPAction" errors
- **Solution**: Check SellerDynamics API documentation for correct method names
- **Current methods being tested**:
  - `GetProducts`
  - `GetOrders`
  - `GetRelationships`
  - `GetCustomers`

#### Issue C: Invalid Credentials
- **Symptom**: Authentication errors or "Forbidden" responses
- **Solution**: Verify your encrypted login and retailer ID with SellerDynamics

#### Issue D: API Service Issues
- **Symptom**: Timeouts or service unavailable errors
- **Solution**: Contact SellerDynamics support

### 4. Alternative: Use Mock Data with Real Structure

If you can't get the real API working, you can enhance the mock data to look more realistic:

```javascript
// In lib/sellerdynamicsService.js
getMockProducts() {
  return [
    {
      id: 'PROD-001',
      name: 'Premium Wireless Headphones',
      sku: 'WH-001',
      stockLevel: 25,
      price: 89.99,
      category: 'Electronics',
      marketplace: 'Amazon',
      lastUpdated: new Date().toISOString()
    },
    // Add more realistic products...
  ];
}
```

### 5. Testing Steps

1. **Check Environment Variables**:
   ```bash
   curl -s "http://localhost:3001/api/debug-env"
   ```

2. **Test Direct API Call**:
   ```bash
   curl -s "http://localhost:3001/api/test-sellerdynamics-direct"
   ```

3. **Check Comprehensive API**:
   ```bash
   curl -s "http://localhost:3001/api/sellerdynamics/comprehensive" | jq '.meta.dataSource'
   ```

4. **Check Dashboard Data**:
   ```bash
   curl -s "http://localhost:3001/api/dashboard-stats" | jq '.meta.dataSource'
   ```

### 6. Expected Results

- **Success**: `"real"` in dataSource
- **Failure**: `"mock"` in dataSource

### 7. Contact SellerDynamics Support

If you're still having issues, contact SellerDynamics support with:

1. **Your API endpoint URL**
2. **Error messages you're seeing**
3. **Request for correct SOAP method names**
4. **Request for API documentation**

### 8. Temporary Workaround

Until you get the real API working, the system will:
- ✅ Show realistic mock data
- ✅ Function normally for demo purposes
- ✅ Allow you to test all features
- ✅ Work in both development and production

### 9. Monitoring

Check the server console for these log messages:
- `[SellerDynamics Comprehensive] Fetching real data from API...`
- `[SellerDynamics Comprehensive] Products API returned error`
- `[SellerDynamics Comprehensive] No real data received, falling back to mock data`

## 🎯 **Next Steps**

1. **Verify your SellerDynamics credentials**
2. **Test the API endpoints**
3. **Contact SellerDynamics support if needed**
4. **Use enhanced mock data as temporary solution**

The system is fully functional with mock data, so you can continue development while resolving the API issues. 