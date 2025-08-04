# 🔧 **REAL DATA INTEGRATION SETUP GUIDE**

## 🚨 **CURRENT STATUS: MOCK DATA DETECTED**

Your admin dashboard is currently showing mock data instead of real Shopify/SellerDynamics data. Follow this guide to enable real data integration.

## 📋 **STEP-BY-STEP SETUP**

### **Step 1: Environment Configuration**

1. **Copy the environment template:**
   ```bash
   cp env.example .env.local
   ```

2. **Configure Shopify API:**
   - Go to your Shopify Partner Dashboard
   - Create a Private App or Custom App
   - Get your API credentials:
     - `SHOPIFY_API_KEY`
     - `SHOPIFY_API_SECRET` 
     - `SHOPIFY_TOKEN` (starts with `shpat_`)
     - `SHOPIFY_HOST` (your store domain)

3. **Configure SellerDynamics (Optional):**
   - Contact SellerDynamics for API credentials
   - Add to `.env.local`:
     - `SELLERDYNAMICS_SOAP_ENDPOINT`
     - `SELLERDYNAMICS_ENCRYPTED_LOGIN`
     - `SELLERDYNAMICS_RETAILER_ID`

### **Step 2: Install Dependencies**

```bash
# Install Shopify API package
npm install @shopify/shopify-api

# Install other required packages
npm install axios xml2js
```

### **Step 3: Test API Connections**

1. **Test Shopify Connection:**
   ```bash
   curl -H "X-Shopify-Access-Token: YOUR_TOKEN" \
        https://YOUR_STORE.myshopify.com/admin/api/2024-01/products.json
   ```

2. **Test SellerDynamics (if configured):**
   - The API will automatically fall back to mock data if credentials are missing

### **Step 4: Verify Real Data**

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Check these endpoints:**
   - `http://localhost:3001/api/shopify-inventory` - Should return real products
   - `http://localhost:3001/api/orders` - Should return real orders
   - `http://localhost:3001/api/sellerdynamics` - Should return real inventory

3. **Dashboard should now show:**
   - Real product counts
   - Real order data
   - Real revenue calculations
   - Live inventory levels

## 🔍 **TROUBLESHOOTING**

### **Common Issues:**

1. **"Failed to fetch" errors:**
   - Check your API credentials
   - Verify your Shopify store domain
   - Ensure your access token has proper permissions

2. **Empty data:**
   - Your Shopify store might not have products/orders
   - Check if your API token has the right scopes

3. **CORS errors:**
   - Make sure you're running on `localhost:3001`
   - Check your Next.js configuration

### **API Permissions Required:**

For Shopify, your app needs these scopes:
- `read_products`
- `read_orders`
- `read_customers`
- `read_inventory`

## 📊 **WHAT'S NOW WORKING**

✅ **Real Shopify Integration:**
- Live product inventory
- Real order data
- Actual customer information
- Live revenue calculations

✅ **Real SellerDynamics Integration:**
- Live inventory levels
- Stock alerts
- Real-time updates

✅ **Dashboard Features:**
- Real-time statistics
- Live activity feed
- Actual data visualization

## 🚀 **NEXT STEPS**

1. **Configure AI Features:**
   - Add OpenAI/Anthropic API keys for AI Copilot
   - Enable product description generation
   - Set up automated insights

2. **Enable Advanced Features:**
   - Amazon Seller Central integration
   - Google Analytics integration
   - Email notifications

3. **Customize Dashboard:**
   - Add more analytics charts
   - Configure custom alerts
   - Set up automated reports

## 📞 **SUPPORT**

If you encounter issues:

1. Check the browser console for errors
2. Verify your API credentials
3. Test individual API endpoints
4. Check the server logs for detailed error messages

## 🎯 **EXPECTED RESULTS**

After setup, you should see:
- Real product counts instead of "1,234"
- Actual order data instead of mock orders
- Live revenue figures instead of static numbers
- Real-time inventory alerts
- Actual customer information

**The dashboard will now provide genuine business insights based on your real Shopify data!** 