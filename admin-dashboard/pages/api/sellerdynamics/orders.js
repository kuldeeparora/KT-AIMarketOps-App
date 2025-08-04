import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const endpoint = process.env.SELLERDYNAMICS_SOAP_ENDPOINT;
    const encryptedLogin = process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN;
    const retailerId = process.env.SELLERDYNAMICS_RETAILER_ID;
    const useMock = process.env.USE_MOCK_SELLERDYNAMICS !== 'false';

    // If mock data is enabled or credentials are missing, return enhanced mock orders
    if (useMock || !endpoint || !encryptedLogin || !retailerId) {
      console.log('[SellerDynamics Orders] Using enhanced mock orders data');
      const mockOrders = getEnhancedMockSellerDynamicsOrders();
      return res.status(200).json({
        success: true,
        data: {
          orders: mockOrders,
          meta: {
            totalOrders: mockOrders.length,
            totalRevenue: mockOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0),
            averageOrderValue:
              mockOrders.length > 0
                ? mockOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0) /
                  mockOrders.length
                : 0,
            dataSource: 'mock',
            lastUpdated: new Date().toISOString(),
            note: useMock ? 'Mock orders enabled' : 'Missing SellerDynamics credentials'
          }
        }
      });
    }

    // Fetch real orders from SellerDynamics API
    console.log('[SellerDynamics Orders] Fetching real orders from API...');

    const headers = {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'https://my.sellerdynamics.com/GetOrders'
    };

    const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetOrders xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>1</pageNumber>
      <pageSize>100</pageSize>
      <dateFrom>2024-01-01</dateFrom>
      <dateTo>${new Date().toISOString().split('T')[0]}</dateTo>
    </GetOrders>
  </soap:Body>
</soap:Envelope>`;

    console.log('[SellerDynamics Orders] Sending SOAP request...');

    const response = await axios.post(endpoint, xml, {
      headers,
      timeout: 30000
    });

    const orders = await parseSellerDynamicsOrdersResponse(response.data);

    console.log(`[SellerDynamics Orders] Fetched ${orders.length} orders`);

    // Calculate summary statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return res.status(200).json({
      success: true,
      data: {
        orders,
        meta: {
          totalOrders,
          totalRevenue,
          averageOrderValue,
          dataSource: 'real',
          lastUpdated: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('[SellerDynamics Orders] Error:', error.message);

    // Fallback to mock data on error
    console.log('[SellerDynamics Orders] Falling back to mock data due to error');
    const mockOrders = getEnhancedMockSellerDynamicsOrders();

    return res.status(200).json({
      success: true,
      data: {
        orders: mockOrders,
        meta: {
          totalOrders: mockOrders.length,
          totalRevenue: mockOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0),
          averageOrderValue:
            mockOrders.length > 0
              ? mockOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0) /
                mockOrders.length
              : 0,
          dataSource: 'fallback',
          error: 'SOAP request failed, using mock orders',
          details: error.message
        }
      }
    });
  }
}

async function parseSellerDynamicsOrdersResponse(xmlString) {
  try {
    // Parse the XML response using xml2js approach
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser({ explicitArray: false });

    let result;
    try {
      result = await parser.parseStringPromise(xmlString);
    } catch (parseError) {
      console.error('XML parsing failed:', parseError.message);
      return [];
    }

    // Extract and normalize response
    let body;
    try {
      body = result['soap:Envelope']['soap:Body']['GetOrdersResponse']['GetOrdersResult'];
  } catch (e) {
      console.error('Error parsing SOAP response structure:', e);
      return [];
    }

    if (body.IsError === 'true') {
      console.log(
        'SellerDynamics Orders API returned error:',
        body.ErrorMessage || 'Unknown error'
      );
      return [];
    }

    let orders = [];
    if (body.Orders && (body.Orders.Order || body.Orders.OrderItem)) {
      // Handle both Order and OrderItem structures
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

function getEnhancedMockSellerDynamicsOrders() {
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
    },
    {
      id: 'SD-003',
      orderNumber: '#SD1003',
      createdAt: '2024-01-14T14:20:00Z',
      totalPrice: '89.99',
      financialStatus: 'paid,',
      fulfillmentStatus: 'fulfilled',
      customer: {
    id: 'CUST-003',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com'
  },
      lineItems: [
        {
          id: 'ITEM-003',
          title: 'GRID-SWITCH-1G-10A-MATT-WHITE',
          quantity: 1,
          price: '89.99',
          sku: 'GRID-SWITCH-1G-10A-MATT-WHITE'}],
      source: 'SellerDynamics'},
    {
      id: 'SD-004',
      orderNumber: '#SD1004',
      createdAt: '2024-01-14T11:45:00Z',
      totalPrice: '249.97',
      financialStatus: 'paid,',
      fulfillmentStatus: 'fulfilled',
      customer: {
    id: 'CUST-004',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com'
  },
      lineItems: [
        {
          id: 'ITEM-004',
          title: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE',
          quantity: 1,
          price: '79.99',
          sku: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE'},
        {
          id: 'ITEM-005',
          title: 'WAGO-221-412',
          quantity: 3,
          price: '35.99',
          sku: 'WAGO-221-412'},
        {
          id: 'ITEM-006',
          title: 'GRID-SWITCH-1G-10A-MATT-WHITE',
          quantity: 1,
          price: '89.99',
          sku: 'GRID-SWITCH-1G-10A-MATT-WHITE'}],
      source: 'SellerDynamics'},
    {
      id: 'SD-005',
      orderNumber: '#SD1005',
      createdAt: '2024-01-13T16:30:00Z',
      totalPrice: '159.98',
      financialStatus: 'paid,',
      fulfillmentStatus: 'fulfilled',
      customer: {
    id: 'CUST-005',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@example.com'
  },
      lineItems: [
        {
          id: 'ITEM-007',
          title: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE',
          quantity: 2,
          price: '79.99',
          sku: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE'}],
      source: 'SellerDynamics'},
    {
      id: 'SD-006',
      orderNumber: '#SD1006',
      createdAt: '2024-01-13T13:15:00Z',
      totalPrice: '125.97',
      financialStatus: 'paid,',
      fulfillmentStatus: 'partial',
      customer: {
    id: 'CUST-006',
        firstName: 'Lisa',
        lastName: 'Davis',
        email: 'lisa.davis@example.com'
  },
      lineItems: [
        {
          id: 'ITEM-008',
          title: 'WAGO-221-412',
          quantity: 3,
          price: '35.99',
          sku: 'WAGO-221-412'}],
      source: 'SellerDynamics'},
    {
      id: 'SD-007',
      orderNumber: '#SD1007',
      createdAt: '2024-01-12T10:45:00Z',
      totalPrice: '89.99',
      financialStatus: 'paid,',
      fulfillmentStatus: 'fulfilled',
      customer: {
    id: 'CUST-007',
        firstName: 'Robert',
        lastName: 'Miller',
        email: 'robert.miller@example.com'
  },
      lineItems: [
        {
          id: 'ITEM-009',
          title: 'GRID-SWITCH-1G-10A-MATT-WHITE',
          quantity: 1,
          price: '89.99',
          sku: 'GRID-SWITCH-1G-10A-MATT-WHITE'}],
      source: 'SellerDynamics'},
    {
      id: 'SD-008',
      orderNumber: '#SD1008',
      createdAt: '2024-01-12T09:30:00Z',
      totalPrice: '199.96',
      financialStatus: 'paid,',
      fulfillmentStatus: 'fulfilled',
      customer: {
    id: 'CUST-008',
        firstName: 'Emma',
        lastName: 'Taylor',
        email: 'emma.taylor@example.com'
  },
      lineItems: [
        {
          id: 'ITEM-010',
          title: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE',
          quantity: 2,
          price: '79.99',
          sku: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE'},
        {
          id: 'ITEM-011',
          title: 'WAGO-221-412',
          quantity: 1,
          price: '35.99',
          sku: 'WAGO-221-412'}],
      source: 'SellerDynamics'},
    {
      id: 'SD-009',
      orderNumber: '#SD1009',
      createdAt: '2024-01-11T15:20:00Z',
      totalPrice: '179.97',
      financialStatus: 'paid,',
      fulfillmentStatus: 'fulfilled',
      customer: {
    id: 'CUST-009',
        firstName: 'James',
        lastName: 'Anderson',
        email: 'james.anderson@example.com'
  },
      lineItems: [
        {
          id: 'ITEM-012',
          title: 'WAGO-221-412',
          quantity: 5,
          price: '35.99',
          sku: 'WAGO-221-412'}],
      source: 'SellerDynamics'},
    {
      id: 'SD-010',
      orderNumber: '#SD1010',
      createdAt: '2024-01-11T12:10:00Z',
      totalPrice: '269.95',
      financialStatus: 'paid,',
      fulfillmentStatus: 'fulfilled',
      customer: {
    id: 'CUST-010',
        firstName: 'Amanda',
        lastName: 'White',
        email: 'amanda.white@example.com'
  },
      lineItems: [
        {
          id: 'ITEM-013',
          title: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE',
          quantity: 2,
          price: '79.99',
          sku: 'BG-EVOLVE-1G-2WAY-10A-MATT-WHITE'},
        {
          id: 'ITEM-014',
          title: 'GRID-SWITCH-1G-10A-MATT-WHITE',
          quantity: 1,
          price: '89.99',
          sku: 'GRID-SWITCH-1G-10A-MATT-WHITE'},
        {
          id: 'ITEM-015',
          title: 'WAGO-221-412',
          quantity: 2,
          price: '35.99',
          sku: 'WAGO-221-412'}],
      source: 'SellerDynamics'}];
  }
