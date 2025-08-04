import { buildSOAPRequest, buildSOAPParameters, escapeXml, soapRequest, parseSoapXml } from './sellerDynamicsUtils.js';

/**
 * SellerDynamics API Integration Service
 * Based on official SellerDynamics API: https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx
 * 
 * Available Operations:
 * - BulkUploadCheck
 * - BulkUploadStock
 * - BulkUploadStockUsingId
 * - GetCustomerOrders
 * - GetCustomerOrdersExtended
 * - GetRetailerMarketplaces
 * - GetRetailerPricingProfiles
 * - GetSalesReport
 * - GetSettlementData
 * - GetStockLevels
 * - GetStockLevelsExtended
 * - PlaceOrdersOnHold
 * - UpdateOrders
 * - UpdateOrdersWithTracking
 * - UploadOrders
 * - UploadStock
 * - UploadStockToMarketplaces
 * - UploadSupplierStock
 * - UploadSupplierStockToMarketplaces
 */

class SellerDynamicsService {
  constructor(config = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.SELLER_DYNAMICS_API_KEY,
      apiUrl: config.apiUrl || process.env.SELLER_DYNAMICS_API_URL || 'https://login.sellerdynamics.com/api/SellerDynamicsAPI.asmx',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retailerId: config.retailerId || process.env.SELLERDYNAMICS_RETAILER_ID,
      encryptedLogin: config.encryptedLogin || process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN,
      ...config
    };
  }

  async soapRequest(operation, bodyXml, soapAction) {
    return soapRequest({
      operation,
      bodyXml,
      soapAction,
      config: this.config,
      retryAttempts: this.config.retryAttempts,
      timeout: this.config.timeout
    });
  }

  async fetchInventory() {
    try {
      const { retailerId, encryptedLogin } = this.config;
      console.log('[DEBUG] fetchInventory called with:', {
        retailerId,
        encryptedLogin: encryptedLogin ? '***' + encryptedLogin.slice(-4) : undefined
      });
      if (!retailerId || !encryptedLogin) {
        throw new Error('Missing SellerDynamics credentials: retailerId or encryptedLogin');
      }
      const soapAction = '"https://my.sellerdynamics.com/GetStockLevels"';
      const bodyXml = buildSOAPRequest('GetStockLevels', { pageNumber: 1, pageSize: 5000 }, this.config);
      console.log('[SOAP REQUEST - INVENTORY]\n' + bodyXml);
      const responseXml = await this.soapRequest('GetStockLevels', bodyXml, soapAction);
      console.log('[SOAP RESPONSE - INVENTORY]\n' + responseXml);
      const parsedData = await this.parseSOAPResponse(responseXml);
      if (parsedData.products && parsedData.products.length > 0) {
        console.log('✅ [SellerDynamics] Stock levels fetched successfully:', {
          productCount: parsedData.products.length,
          totalValue: parsedData.totalValue,
          lastUpdated: parsedData.lastUpdated
        });
        return this.processInventoryData(parsedData);
      } else {
        let errorMsg = '';
        if (parsedData && parsedData.rawData && parsedData.rawData.GetStockLevelsResponse && parsedData.rawData.GetStockLevelsResponse.GetStockLevelsResult) {
          const result = parsedData.rawData.GetStockLevelsResponse.GetStockLevelsResult;
          if (result.ErrorMessage) errorMsg = result.ErrorMessage;
        }
        console.error('[DEBUG] No products returned. Raw SOAP response:', responseXml);
        if (errorMsg && errorMsg.includes('Page number must be 1 or more')) {
          console.error('⚠️ [SellerDynamics] API Error: Page number must be 1 or more');
          console.error('This suggests the API may have changed its parameter requirements.');
          console.error('Please contact SellerDynamics support to verify the correct API parameters.');
          throw new Error('SellerDynamics API Error: Page number must be 1 or more. Please contact SellerDynamics support to verify API parameters.');
        }
        throw new Error('No products returned' + (errorMsg ? (': ' + errorMsg) : ''));
      }
    } catch (error) {
      console.error('❌ [SellerDynamics] Stock levels fetch failed:', error.message);
      throw error;
    }
  }

  async fetchExtendedInventory(shop) {
    try {
      console.log('🔍 [SellerDynamics] Fetching extended stock levels for shop:', shop);
      const soapAction = 'https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetStockLevelsExtended';
      const bodyXml = buildSOAPRequest('GetStockLevelsExtended', { shop }, this.config);
      const responseXml = await this.soapRequest('GetStockLevelsExtended', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Extended stock levels fetched successfully:', {
        shop,
        resultCount: result ? Object.keys(result).length : 0
      });
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Extended stock levels fetch failed:', error.message);
      throw error;
    }
  }

  async uploadInventory(shop, inventoryData) {
    try {
      console.log('📤 [SellerDynamics] Uploading stock for shop:', shop);
      const soapAction = 'https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/UploadStock';
      const bodyXml = buildSOAPRequest('UploadStock', { shop, inventoryData }, this.config);
      const responseXml = await this.soapRequest('UploadStock', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Stock uploaded successfully:', {
        shop,
        itemsUploaded: inventoryData.length,
        result
      });
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Stock upload failed:', error.message);
      throw error;
    }
  }

  async bulkUploadStock(shop, stockData) {
    try {
      console.log('📤 [SellerDynamics] Bulk uploading stock for shop:', shop);
      const soapAction = 'https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/BulkUploadStock';
      const bodyXml = buildSOAPRequest('BulkUploadStock', { shop, stockData }, this.config);
      const responseXml = await this.soapRequest('BulkUploadStock', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Bulk stock upload completed:', {
        shop,
        itemsUploaded: stockData.length,
        result
      });
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Bulk stock upload failed:', error.message);
      throw error;
    }
  }

  async getMarketplaces(shop) {
    try {
      console.log('🔍 [SellerDynamics] Fetching marketplaces for shop:', shop);
      const soapAction = '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetRetailerMarketplaces"';
      const bodyXml = buildSOAPRequest('GetRetailerMarketplaces', { shop }, this.config);
      const responseXml = await this.soapRequest('GetRetailerMarketplaces', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Marketplaces fetched:', {
        shop,
        marketplaceCount: result.marketplaces ? result.marketplaces.length : 0
      });
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Marketplaces fetch failed:', error.message);
      throw error;
    }
  }

  async getSettlementData(shop, dateRange = {}) {
    try {
      console.log('🔍 [SellerDynamics] Fetching settlement data for shop:', shop);
      const soapAction = '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetSettlementData"';
      const bodyXml = buildSOAPRequest('GetSettlementData', { shop, ...dateRange }, this.config);
      const responseXml = await this.soapRequest('GetSettlementData', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Settlement data fetched:', {
        shop,
        dateRange,
        resultCount: result ? Object.keys(result).length : 0
      });
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Settlement data fetch failed:', error.message);
      throw error;
    }
  }

  async getPricingProfiles(shop) {
    try {
      console.log('🔍 [SellerDynamics] Fetching pricing profiles for shop:', shop);
      const soapAction = '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetRetailerPricingProfiles"';
      const bodyXml = buildSOAPRequest('GetRetailerPricingProfiles', { shop }, this.config);
      const responseXml = await this.soapRequest('GetRetailerPricingProfiles', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Pricing profiles fetched:', {
        shop,
        profileCount: result.profiles ? result.profiles.length : 0
      });
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Pricing profiles fetch failed:', error.message);
      throw error;
    }
  }

  async uploadOrders(shop, orders) {
    try {
      console.log('📤 [SellerDynamics] Uploading orders for shop:', shop);
      const soapAction = '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/UploadOrders"';
      const bodyXml = buildSOAPRequest('UploadOrders', { shop, orders }, this.config);
      const responseXml = await this.soapRequest('UploadOrders', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Orders uploaded successfully:', {
        shop,
        ordersUploaded: orders.length,
        result
      });
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Order upload failed:', error.message);
      throw error;
    }
  }

  async getCustomerOrders(retailerId, pageNumber = 1, pageSize = 100, orderType = 'PENDING', fromDate, toDate) {
    try {
      console.log('🔍 [SellerDynamics] Fetching customer orders for retailerId:', retailerId);
      const soapAction = '"https://my.sellerdynamics.com/GetCustomerOrders"';
      const bodyXml = buildSOAPRequest('GetCustomerOrders', {
        retailerId,
        encryptedLogin: this.config.encryptedLogin,
        pageNumber,
        pageSize
      }, this.config);
      console.log('[SOAP REQUEST - ORDERS]\n' + bodyXml);
      const responseXml = await this.soapRequest('GetCustomerOrders', bodyXml, soapAction);
      console.log('[SOAP RESPONSE - ORDERS]\n' + responseXml);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Customer orders fetched:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Customer orders fetch failed:', error.message);
      throw error;
    }
  }

  async getSalesReport(retailerId, dateRange = {}) {
    try {
      console.log('🔍 [SellerDynamics] Fetching sales report for retailerId:', retailerId);
      const soapAction = '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetSalesReport"';
      const startDate = dateRange.fromDate || dateRange.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = dateRange.toDate || dateRange.endDate || new Date().toISOString();
      const bodyXml = buildSOAPRequest('GetSalesReport', {
        encryptedLogin: this.config.encryptedLogin,
        retailerId,
        startDate,
        endDate
      }, this.config);
      const responseXml = await this.soapRequest('GetSalesReport', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Sales report fetched:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Sales report fetch failed:', error.message);
      throw error;
    }
  }

  async getCustomerOrdersExtended(retailerId, pageNumber = 1, pageSize = 100) {
    try {
      console.log('🔍 [SellerDynamics] Fetching customer orders EXTENDED for retailerId:', retailerId);
      const soapAction = '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetCustomerOrdersExtended"';
      const bodyXml = buildSOAPRequest('GetCustomerOrdersExtended', {
        encryptedLogin: this.config.encryptedLogin,
        retailerId,
        pageNumber,
        pageSize
      }, this.config);
      const responseXml = await this.soapRequest('GetCustomerOrdersExtended', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Customer orders EXTENDED fetched:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ [SellerDynamics] Customer orders EXTENDED fetch failed:', error.message);
      throw error;
    }
  }

  async getOrdersWithFallback(retailerId, range = 1) {
    // Try GetCustomerOrders first
    let result = await this.getCustomerOrders(retailerId);
    console.log('[SellerDynamics] GetCustomerOrders response:', JSON.stringify(result, null, 2));
    if (!result.orders || result.orders.length === 0) {
      // Try GetCustomerOrdersExtended
      let extResult = await this.getCustomerOrdersExtended(retailerId);
      console.log('[SellerDynamics] GetCustomerOrdersExtended response:', JSON.stringify(extResult, null, 2));
      if (extResult.orders && extResult.orders.length > 0) {
        return extResult;
      }
      // Fallback: Try GetSalesReport for the last 'range' days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - range);
      const salesReport = await this.getSalesReport(retailerId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      console.log('[SellerDynamics] GetSalesReport fallback response:', JSON.stringify(salesReport, null, 2));
      return salesReport;
    }
    return result;
  }

  async testAllOrderOperations(retailerId) {
    const operations = [
      { name: 'GetOrders', soapAction: '"https://my.sellerdynamics.com/GetOrders"' },
      { name: 'GetCustomerOrders', soapAction: '"https://my.sellerdynamics.com/GetCustomerOrders"' },
      { name: 'GetOrderHistory', soapAction: '"https://my.sellerdynamics.com/GetOrderHistory"' },
      { name: 'GetSalesOrders', soapAction: '"https://my.sellerdynamics.com/GetSalesOrders"' },
      { name: 'GetInvoices', soapAction: '"https://my.sellerdynamics.com/GetInvoices"' },
      { name: 'GetOrders', soapAction: '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetOrders"' },
      { name: 'GetCustomerOrders', soapAction: '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetCustomerOrders"' },
      { name: 'GetOrderHistory', soapAction: '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetOrderHistory"' },
      { name: 'GetSalesOrders', soapAction: '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetSalesOrders"' },
      { name: 'GetInvoices', soapAction: '"https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx/GetInvoices"' }
    ];

    console.log('🔍 [SellerDynamics] Testing all order operations...');
    
    for (const op of operations) {
      try {
        console.log(`\n🧪 Testing: ${op.name} with SOAPAction: ${op.soapAction}`);
        const bodyXml = buildSOAPRequest(op.name, {
          retailerId,
          encryptedLogin: this.config.encryptedLogin,
          pageNumber: 1,
          pageSize: 10
        }, this.config);
        
        console.log(`[SOAP REQUEST - ${op.name}]\n${bodyXml}`);
        const responseXml = await this.soapRequest(op.name, bodyXml, op.soapAction);
        console.log(`[SOAP RESPONSE - ${op.name}]\n${responseXml}`);
        
        // If we get here without an error, this operation works!
        console.log(`✅ SUCCESS! Operation ${op.name} with SOAPAction ${op.soapAction} works!`);
        return { operation: op.name, soapAction: op.soapAction, response: responseXml };
        
      } catch (error) {
        console.log(`❌ ${op.name} failed: ${error.message}`);
        // Continue to next operation
      }
    }
    
    throw new Error('All order operations failed. No working operation found.');
  }

  parseSOAPResponse(xmlString) {
    return parseSoapXml(xmlString);
  }

  extractProductsFromXMLResult(response) {
    if (!response || !response.rawData) {
      return { products: [], totalValue: 0, lastUpdated: new Date().toISOString() };
    }

    const result = response.rawData.GetStockLevelsResponse?.GetStockLevelsResult;
    if (!result) {
      return { products: [], totalValue: 0, lastUpdated: new Date().toISOString() };
    }

    const products = [];
    let totalValue = 0;

    if (result.Products && result.Products.Product) {
      const productArray = Array.isArray(result.Products.Product) ? result.Products.Product : [result.Products.Product];
      
      productArray.forEach(product => {
        const quantity = parseInt(product.Quantity || 0);
        const price = parseFloat(product.Price || 0);
        const value = quantity * price;
        totalValue += value;

        products.push({
          sku: product.SKU || product.sku || '',
          name: product.Name || product.name || '',
          quantity: quantity,
          price: price,
          marketplace: product.Marketplace || product.marketplace || '',
          value: value
        });
      });
    }

    return {
      products,
      totalValue,
      lastUpdated: new Date().toISOString()
    };
  }

  processInventoryData(data) {
    if (data.products && data.products.length > 0) {
      return {
        products: data.products,
        totalProducts: data.products.length,
        totalValue: data.totalValue || 0,
        lastUpdated: data.lastUpdated || new Date().toISOString()
      };
    }
    return this.extractProductsFromXMLResult(data);
  }

  async testConnection(shop) {
    try {
      console.log('🔍 [SellerDynamics] Testing connection for shop:', shop);
      const soapAction = '"https://my.sellerdynamics.com/GetStockLevels"';
      const bodyXml = buildSOAPRequest('GetStockLevels', { pageNumber: 1, pageSize: 1 }, this.config);
      const responseXml = await this.soapRequest('GetStockLevels', bodyXml, soapAction);
      const result = await this.parseSOAPResponse(responseXml);
      console.log('✅ [SellerDynamics] Connection test successful:', {
        shop,
        responseReceived: !!result,
        hasData: result && Object.keys(result).length > 0
      });
      return {
        success: true,
        message: 'Connection successful',
        hasData: result && Object.keys(result).length > 0
      };
    } catch (error) {
      console.error('❌ [SellerDynamics] Connection test failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default SellerDynamicsService; 