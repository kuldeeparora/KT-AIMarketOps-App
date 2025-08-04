import axios from 'axios';

class SellerDynamicsIntegration {
  constructor() {
    this.endpoint = process.env.SELLERDYNAMICS_SOAP_ENDPOINT;
    this.encryptedLogin = process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN;
    this.retailerId = process.env.SELLERDYNAMICS_RETAILER_ID;
    this.useMock = process.env.USE_MOCK_SELLERDYNAMICS !== 'false';
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  }

  // Fetch live inventory data from SellerDynamics
  async fetchLiveInventory() {
    try {
      console.log('[SellerDynamics Integration] Fetching live inventory data...');

      // Always fetch from the SellerDynamics API endpoint to get the full dataset
      console.log('[SellerDynamics Integration] Fetching from SellerDynamics API endpoint...');
      
      const response = await fetch(`${this.baseUrl}/api/sellerdynamics`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from SellerDynamics API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.stockLevels && Array.isArray(data.stockLevels)) {
        console.log(`[SellerDynamics Integration] Successfully fetched ${data.stockLevels.length} inventory items from API`);
        
        return {
          success: true,
          data: data.stockLevels,
          source: data.meta?.dataSource || 'api',
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('Invalid response format from SellerDynamics API');
      }
    } catch (error) {
      console.error('[SellerDynamics Integration] Error fetching live inventory:', error.message);
      
      // Fallback to mock data
      console.log('[SellerDynamics Integration] Falling back to mock inventory data');
      return {
        success: true,
        data: this.getMockInventoryData(),
        source: 'mock',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Fetch live orders data from SellerDynamics
  async fetchLiveOrders() {
    try {
      console.log('[SellerDynamics Integration] Fetching live orders data...');

      // Always fetch from the SellerDynamics orders API endpoint
      console.log('[SellerDynamics Integration] Fetching from SellerDynamics orders API endpoint...');
      
      const response = await fetch(`${this.baseUrl}/api/sellerdynamics/orders`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from SellerDynamics orders API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.orders && Array.isArray(data.data.orders)) {
        console.log(`[SellerDynamics Integration] Successfully fetched ${data.data.orders.length} orders from API`);
        
        return {
          success: true,
          data: data.data.orders,
          source: data.data.meta?.dataSource || 'api',
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('Invalid response format from SellerDynamics orders API');
      }
    } catch (error) {
      console.error('[SellerDynamics Integration] Error fetching live orders:', error.message);
      
      // Fallback to mock data
      console.log('[SellerDynamics Integration] Falling back to mock orders data');
      return {
        success: true,
        data: this.getMockOrdersData(),
        source: 'mock',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Parse inventory response from SellerDynamics
  async parseInventoryResponse(xmlString) {
    try {
      const xml2js = require('xml2js');
      const parser = new xml2js.Parser({ explicitArray: false });

      const result = await parser.parseStringPromise(xmlString);
      const body = result['soap:Envelope']['soap:Body']['GetStockLevelsResponse']['GetStockLevelsResult'];

      if (body.IsError === 'true') {
        console.log('SellerDynamics API returned error:', body.ErrorMessage || 'Unknown error');
        return [];
      }

      let stockLevels = [];
      if (body.StockLevels && (body.StockLevels.StockLevel || body.StockLevels.StockLevelItem)) {
        const stockLevelData = body.StockLevels.StockLevelItem || body.StockLevels.StockLevel;
        const stockLevelArray = Array.isArray(stockLevelData) ? stockLevelData : [stockLevelData];

        stockLevels = stockLevelArray.map((item, index) => {
          const productName = (item.ProductName || item.ProductTitle || item.Title || item.SKU).trim();
          const sku = item.SKU;
          const isMasterProduct = this.identifyMasterProduct(productName, sku);

          return {
            id: `SD-${sku}-${index}`,
            sku: sku,
            productName: productName,
            currentStock: Number(item.Quantity) || 0,
            allocatedStock: Number(item.QuantityAllocated) || Number(item.AllocatedQuantity) || 0,
            availableStock: (Number(item.Quantity) || 0) - (Number(item.QuantityAllocated) || Number(item.AllocatedQuantity) || 0),
            price: Number(item.Price) || Number(item.UnitPrice) || 0,
            cost: Number(item.Cost) || Number(item.UnitCost) || 0,
            vendor: item.Vendor || item.Supplier || item.Brand || 'Unknown Vendor',
            category: item.ProductType || item.Category || item.Type || 'General',
            reorderPoint: 10,
            lastUpdated: item.CreatedAt || item.DateCreated || new Date().toISOString(),
            isMasterProduct: isMasterProduct,
            productType: isMasterProduct ? 'Master Product' : 'Kit Product',
            source: 'SellerDynamics'
          };
        });
      }

      return stockLevels;
    } catch (error) {
      console.error('Error parsing SellerDynamics inventory response:', error);
      return [];
    }
  }

  // Parse orders response from SellerDynamics
  async parseOrdersResponse(xmlString) {
    try {
      const xml2js = require('xml2js');
      const parser = new xml2js.Parser({ explicitArray: false });

      const result = await parser.parseStringPromise(xmlString);
      const body = result['soap:Envelope']['soap:Body']['GetOrdersResponse']['GetOrdersResult'];

      if (body.IsError === 'true') {
        console.log('SellerDynamics Orders API returned error:', body.ErrorMessage || 'Unknown error');
        return [];
      }

      let orders = [];
      if (body.Orders && (body.Orders.Order || body.Orders.OrderItem)) {
        const orderData = body.Orders.OrderItem || body.Orders.Order;
        const orderArray = Array.isArray(orderData) ? orderData : [orderData];

        orders = orderArray.map((order, index) => {
          return {
            id: order.OrderId || order.Id || `SD-${index}`,
            orderNumber: order.OrderNumber || order.Reference || `#${order.OrderId || index}`,
            createdAt: order.OrderDate || order.CreatedAt || new Date().toISOString(),
            totalPrice: order.TotalAmount || order.TotalPrice || '0.00',
            financialStatus: order.PaymentStatus || 'pending',
            fulfillmentStatus: order.FulfillmentStatus || 'unfulfilled',
            customer: {
              id: order.CustomerId || order.Customer?.Id || `customer-${index}`,
              firstName: order.CustomerFirstName || order.Customer?.FirstName || 'Unknown',
              lastName: order.CustomerLastName || order.Customer?.LastName || 'Customer',
              email: order.CustomerEmail || order.Customer?.Email || 'unknown@example.com'
            },
            lineItems: order.Items
              ? order.Items.map(item => ({
                  id: item.ItemId || item.Id || `item-${index}`,
                  title: item.ProductName || item.Title || 'Unknown Product',
                  quantity: item.Quantity || 1,
                  price: item.UnitPrice || item.Price || '0.00',
                  sku: item.SKU || item.ProductCode || 'N/A'
                }))
              : [],
            source: 'SellerDynamics'
          };
        });
      }

      return orders;
    } catch (error) {
      console.error('Error parsing SellerDynamics orders response:', error);
      return [];
    }
  }

  // Identify master products based on patterns
  identifyMasterProduct(productName, sku) {
    if (!productName || !sku) return false;

    const name = productName.toLowerCase();
    const skuLower = sku.toLowerCase();

    // Master product indicators
    const masterProductPatterns = [
      /bg-evolve/i,
      /bg-nexus/i,
      /custom-appliance/i,
      /wago.*connector/i,
      /grid-switch/i,
      /^[a-z]+-[a-z]+-[a-z]+$/i,
      /^(?!.*\dx).*$/i
    ];

    // Kit product indicators
    const kitProductPatterns = [
      /\d+x/i,
      /^\d+x.*$/i,
      /^(?!.*wago).*-\d+$/i,
      /kit/i,
      /bundle/i,
      /pack/i
    ];

    // Check kit patterns first
    for (const pattern of kitProductPatterns) {
      if (pattern.test(name) || pattern.test(skuLower)) {
        return false;
      }
    }

    // Check master product patterns
    for (const pattern of masterProductPatterns) {
      if (pattern.test(name) || pattern.test(skuLower)) {
        return true;
      }
    }

    // Default logic
    const hasQuantityIndicator = /\d+x/i.test(name) || /\d+x/i.test(skuLower);
    return !hasQuantityIndicator;
  }

  // Get mock inventory data
  getMockInventoryData() {
    return [
      {
        id: 'SD-BG-NAB12-001',
        sku: 'BG-NAB12',
        productName: 'BG Electrical 1-Gang 2-Way Metal Antique Brass Light Switch',
        currentStock: 96,
        allocatedStock: 5,
        availableStock: 91,
        price: 3.1,
        cost: 1.55,
        vendor: 'BG Electrical',
        category: 'Lighting Controls',
        reorderPoint: 10,
        lastUpdated: new Date().toISOString(),
        isMasterProduct: true,
        productType: 'Master Product',
        source: 'SellerDynamics'
      },
      {
        id: 'SD-WAGO-51253135-002',
        sku: 'WAGO-51253135',
        productName: 'WAGO 512-53135 3-Way Terminal Block',
        currentStock: 150,
        allocatedStock: 10,
        availableStock: 140,
        price: 2.5,
        cost: 1.25,
        vendor: 'WAGO',
        category: 'Terminal Blocks',
        reorderPoint: 25,
        lastUpdated: new Date().toISOString(),
        isMasterProduct: true,
        productType: 'Master Product',
        source: 'SellerDynamics'
      },
      {
        id: 'SD-GRID-SWITCH-1G-003',
        sku: 'GRID-SWITCH-1G',
        productName: 'Grid Switch 1-Gang 2-Way White',
        currentStock: 85,
        allocatedStock: 8,
        availableStock: 77,
        price: 4.5,
        cost: 2.25,
        vendor: 'Grid Systems',
        category: 'Grid Switches',
        reorderPoint: 15,
        lastUpdated: new Date().toISOString(),
        isMasterProduct: true,
        productType: 'Master Product',
        source: 'SellerDynamics'
      }
    ];
  }

  // Get mock orders data
  getMockOrdersData() {
    return [
      {
        id: 'SD-001',
        orderNumber: '#SD1001',
        createdAt: '2024-01-15T10:30:00Z',
        totalPrice: '159.99',
        financialStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
        customer: {
          id: 'CUST-001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        lineItems: [
          {
            id: 'ITEM-001',
            title: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE',
            quantity: 2,
            price: '79.99',
            sku: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE'
          }
        ],
        source: 'SellerDynamics'
      },
      {
        id: 'SD-002',
        orderNumber: '#SD1002',
        createdAt: '2024-01-15T09:15:00Z',
        totalPrice: '179.98',
        financialStatus: 'paid',
        fulfillmentStatus: 'partial',
        customer: {
          id: 'CUST-002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com'
        },
        lineItems: [
          {
            id: 'ITEM-002',
            title: 'WAGO-221-412',
            quantity: 5,
            price: '35.99',
            sku: 'WAGO-221-412'
          }
        ],
        source: 'SellerDynamics'
      }
    ];
  }

  // Update inventory item
  async updateInventoryItem(sku, updates) {
    try {
      console.log(`[SellerDynamics Integration] Updating inventory item ${sku}...`);

      if (this.useMock || !this.endpoint || !this.encryptedLogin || !this.retailerId) {
        console.log('[SellerDynamics Integration] Mock mode - simulating inventory update');
        return {
          success: true,
          message: 'Inventory updated successfully (mock mode)',
          sku,
          updates,
          timestamp: new Date().toISOString()
        };
      }

      // In a real implementation, this would make a SOAP call to update inventory
      // For now, we'll simulate the update
      const headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'https://my.sellerdynamics.com/UpdateStockLevel'
      };

      const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <UpdateStockLevel xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${this.encryptedLogin}</encryptedLogin>
      <retailerId>${this.retailerId}</retailerId>
      <sku>${sku}</sku>
      <quantity>${updates.currentStock}</quantity>
      <allocatedQuantity>${updates.allocatedStock}</allocatedQuantity>
    </UpdateStockLevel>
  </soap:Body>
</soap:Envelope>`;

      const response = await axios.post(this.endpoint, xml, {
        headers,
        timeout: 30000
      });

      console.log(`[SellerDynamics Integration] Successfully updated inventory for ${sku}`);
      
      return {
        success: true,
        message: 'Inventory updated successfully',
        sku,
        updates,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[SellerDynamics Integration] Error updating inventory for ${sku}:`, error.message);
      
      return {
        success: false,
        error: error.message,
        sku,
        updates,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get integration status
  getStatus() {
    return {
      endpoint: this.endpoint ? 'Configured' : 'Not Configured',
      encryptedLogin: this.encryptedLogin ? 'Configured' : 'Not Configured',
      retailerId: this.retailerId ? 'Configured' : 'Not Configured',
      useMock: this.useMock,
      status: this.useMock || (!this.endpoint || !this.encryptedLogin || !this.retailerId) ? 'Mock Mode' : 'Live Mode'
    };
  }
}

export default SellerDynamicsIntegration; 