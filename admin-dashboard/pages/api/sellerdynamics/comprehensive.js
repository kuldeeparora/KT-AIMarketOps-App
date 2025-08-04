import axios from 'axios';

// Rate limiting for SellerDynamics API
let lastApiCall = 0;
const minCallInterval = 60000; // 1 minute between calls

async function throttleApiCall() {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < minCallInterval) {
    const waitTime = minCallInterval - timeSinceLastCall;
    console.log(`[SellerDynamics Comprehensive] Rate limiting: waiting ${waitTime}ms before next call`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastApiCall = Date.now();
}

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

    console.log('[SellerDynamics Comprehensive] Starting comprehensive data fetch...');

    // If mock data is enabled or credentials are missing, return comprehensive mock data
    if (useMock || !endpoint || !encryptedLogin || !retailerId) {
      console.log('[SellerDynamics Comprehensive] Using comprehensive mock data');
      const comprehensiveData = getComprehensiveMockData();
      return res.status(200).json({
        success: true,
        data: comprehensiveData,
        meta: {
          dataSource: 'mock',
          lastUpdated: new Date().toISOString(),
          note: useMock ? 'Mock data enabled' : 'Missing SellerDynamics credentials',
          totalProducts: comprehensiveData.products.length,
          totalOrders: comprehensiveData.orders.length,
          totalRelationships: comprehensiveData.relationships.length,
          totalCustomers: comprehensiveData.customers.length
        }
      });
    }

    // Fetch all data types from SellerDynamics API
    console.log('[SellerDynamics Comprehensive] Fetching real data from API...');

    // Apply rate limiting
    await throttleApiCall();

    const [products, orders, relationships, customers] = await Promise.allSettled([
      fetchSellerDynamicsProducts(endpoint, encryptedLogin, retailerId),
      fetchSellerDynamicsOrders(endpoint, encryptedLogin, retailerId),
      fetchSellerDynamicsRelationships(endpoint, encryptedLogin, retailerId),
      fetchSellerDynamicsCustomers(endpoint, encryptedLogin, retailerId)
    ]);

    const comprehensiveData = {
      products: products.status === 'fulfilled' ? products.value : [],
      orders: orders.status === 'fulfilled' ? orders.value : [],
      relationships: relationships.status === 'fulfilled' ? relationships.value : [],
      customers: customers.status === 'fulfilled' ? customers.value : []
    };

    console.log(`[SellerDynamics Comprehensive] Fetched data:`, {
      products: comprehensiveData.products.length,
      orders: comprehensiveData.orders.length,
      relationships: comprehensiveData.relationships.length,
      customers: comprehensiveData.customers.length
    });

    // Check if we got any real data
    const hasRealData = comprehensiveData.products.length > 0 || 
                       comprehensiveData.orders.length > 0 || 
                       comprehensiveData.relationships.length > 0 || 
                       comprehensiveData.customers.length > 0;

    if (!hasRealData) {
      console.log('[SellerDynamics Comprehensive] No real data received, falling back to mock data');
      const comprehensiveData = getComprehensiveMockData();
      return res.status(200).json({
        success: true,
        data: comprehensiveData,
        meta: {
          dataSource: 'mock',
          lastUpdated: new Date().toISOString(),
          note: 'SellerDynamics API returned no data, using mock data',
          totalProducts: comprehensiveData.products.length,
          totalOrders: comprehensiveData.orders.length,
          totalRelationships: comprehensiveData.relationships.length,
          totalCustomers: comprehensiveData.customers.length
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: comprehensiveData,
      meta: {
        dataSource: 'real',
        lastUpdated: new Date().toISOString(),
        totalProducts: comprehensiveData.products.length,
        totalOrders: comprehensiveData.orders.length,
        totalRelationships: comprehensiveData.relationships.length,
        totalCustomers: comprehensiveData.customers.length
      }
    });
  } catch (error) {
    console.error('[SellerDynamics Comprehensive] Error:', error.message);

    // Fallback to comprehensive mock data on error
    console.log('[SellerDynamics Comprehensive] Falling back to mock data due to error');
    const comprehensiveData = getComprehensiveMockData();

    return res.status(200).json({
      success: true,
      data: comprehensiveData,
      meta: {
        dataSource: 'mock',
        lastUpdated: new Date().toISOString(),
        note: `Error: ${error.message}`,
        totalProducts: comprehensiveData.products.length,
        totalOrders: comprehensiveData.orders.length,
        totalRelationships: comprehensiveData.relationships.length,
        totalCustomers: comprehensiveData.customers.length
      }
    });
  }
}

async function fetchSellerDynamicsProducts(endpoint, encryptedLogin, retailerId) {
  try {
    console.log('[SellerDynamics Comprehensive] Fetching products...');
    
    const productsSoap = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetProducts xmlns="http://www.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
    </GetProducts>
  </soap:Body>
</soap:Envelope>`;

    const response = await axios.post(endpoint, productsSoap, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8'
        // Removed SOAPAction header as it's causing the fault
      },
      timeout: 30000
    });

    if (response.data && response.data.includes('IsError>true</IsError>')) {
      console.log('[SellerDynamics Comprehensive] Products API returned error');
      return [];
    }

    return await parseSellerDynamicsProductsResponse(response.data);
  } catch (error) {
    console.error('[SellerDynamics Comprehensive] Error fetching products:', error.message);
    return [];
  }
}

async function fetchSellerDynamicsOrders(endpoint, encryptedLogin, retailerId) {
  try {
    console.log('[SellerDynamics Comprehensive] Fetching orders...');
    
    const ordersSoap = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetOrders xmlns="http://www.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
    </GetOrders>
  </soap:Body>
</soap:Envelope>`;

    const response = await axios.post(endpoint, ordersSoap, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8'
        // Removed SOAPAction header as it's causing the fault
      },
      timeout: 30000
    });

    if (response.data && response.data.includes('IsError>true</IsError>')) {
      console.log('[SellerDynamics Comprehensive] Orders API returned error');
      return [];
    }

    return await parseSellerDynamicsOrdersResponse(response.data);
  } catch (error) {
    console.error('[SellerDynamics Comprehensive] Error fetching orders:', error.message);
    return [];
  }
}

async function fetchSellerDynamicsRelationships(endpoint, encryptedLogin, retailerId) {
  console.log('[SellerDynamics Comprehensive] Fetching relationships...');

  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    SOAPAction: 'https://my.sellerdynamics.com/GetRelationships'};

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetRelationships xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>1</pageNumber>
      <pageSize>500</pageSize>
    </GetRelationships>
  </soap:Body>
</soap:Envelope>`;

  const response = await axios.post(endpoint, xml, { headers, timeout: 30000 });
  return await parseSellerDynamicsRelationshipsResponse(response.data);
}

async function fetchSellerDynamicsCustomers(endpoint, encryptedLogin, retailerId) {
  console.log('[SellerDynamics Comprehensive] Fetching customers...');

  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    SOAPAction: 'https://my.sellerdynamics.com/GetCustomers'};

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetCustomers xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>1</pageNumber>
      <pageSize>500</pageSize>
    </GetCustomers>
  </soap:Body>
</soap:Envelope>`;

  const response = await axios.post(endpoint, xml, { headers, timeout: 30000 });
  return await parseSellerDynamicsCustomersResponse(response.data);
}

async function parseSellerDynamicsProductsResponse(xmlString) {
  try {
    // Parse XML response and extract product data
    // This is a simplified parser - you may need to adjust based on actual XML structure
    const products = [];

    // Extract product data from XML
    const productMatches = xmlString.match(/<Product>(.*?)<\/Product>/gs);

    if (productMatches) {
      for (const match of productMatches) {
        const product = {
          id: extractValue(match, 'GoodId'),
          sku: extractValue(match, 'SKU'),
          productName: extractValue(match, 'ProductName'),
          category: extractValue(match, 'Category'),
          vendor: extractValue(match, 'Vendor'),
          currentStock: parseInt(extractValue(match, 'CurrentStock') || '0'),
          allocatedStock: parseInt(extractValue(match, 'AllocatedStock') || '0'),
          availableStock: parseInt(extractValue(match, 'AvailableStock') || '0'),
          cost: parseFloat(extractValue(match, 'Cost') || '0'),
          price: parseFloat(extractValue(match, 'Price') || '0'),
          reorderPoint: parseInt(extractValue(match, 'ReorderPoint') || '10'),
          lastUpdated: new Date().toISOString()};

        products.push(product);
      }
    }

    return products;
  } catch (error) {
    console.error('[SellerDynamics Comprehensive] Error parsing products:', error);
    return [];
  }
}

async function parseSellerDynamicsOrdersResponse(xmlString) {
  try {
    const orders = [];

    const orderMatches = xmlString.match(/<Order>(.*?)<\/Order>/gs);

    if (orderMatches) {
      for (const match of orderMatches) {
        const order = {
          id: extractValue(match, 'OrderId'),
          orderNumber: extractValue(match, 'OrderNumber'),
          orderDate: extractValue(match, 'OrderDate'),
          customerId: extractValue(match, 'CustomerId'),
          customerName: extractValue(match, 'CustomerName'),
          totalPrice: parseFloat(extractValue(match, 'TotalPrice') || '0'),
          status: extractValue(match, 'Status'),
          items: [], // Parse line items if available
        };

        orders.push(order);
      }
    }

    return orders;
  } catch (error) {
    console.error('[SellerDynamics Comprehensive] Error parsing orders:', error);
    return [];
  }
}

async function parseSellerDynamicsRelationshipsResponse(xmlString) {
  try {
    const relationships = [];

    const relationshipMatches = xmlString.match(/<Relationship>(.*?)<\/Relationship>/gs);

    if (relationshipMatches) {
      for (const match of relationshipMatches) {
        const relationship = {
          id: extractValue(match, 'RelationshipId'),
          masterProductId: extractValue(match, 'MasterProductId'),
          kitProductId: extractValue(match, 'KitProductId'),
          relationshipType: extractValue(match, 'RelationshipType'),
          quantity: parseInt(extractValue(match, 'Quantity') || '1')
        };

        relationships.push(relationship);
      }
    }

    return relationships;
  } catch (error) {
    console.error('[SellerDynamics Comprehensive] Error parsing relationships:', error);
    return [];
  }
}

async function parseSellerDynamicsCustomersResponse(xmlString) {
  try {
    const customers = [];

    const customerMatches = xmlString.match(/<Customer>(.*?)<\/Customer>/gs);

    if (customerMatches) {
      for (const match of customerMatches) {
        const customer = {
          id: extractValue(match, 'CustomerId'),
          name: extractValue(match, 'CustomerName'),
          email: extractValue(match, 'Email'),
          phone: extractValue(match, 'Phone'),
          address: extractValue(match, 'Address'),
          totalOrders: parseInt(extractValue(match, 'TotalOrders') || '0'),
          totalSpent: parseFloat(extractValue(match, 'TotalSpent') || '0')
        };

        customers.push(customer);
      }
    }

    return customers;
  } catch (error) {
    console.error('[SellerDynamics Comprehensive] Error parsing customers:', error);
    return [];
  }
}

function extractValue(xml, tagName) {
  const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function getComprehensiveMockData() {
  return {
    products: getEnhancedMockProducts(),
    orders: getEnhancedMockOrders(),
    relationships: getEnhancedMockRelationships(),
    customers: getEnhancedMockCustomers()};
  }

function getEnhancedMockProducts() {
  return [
    {
      id: '98781de8-591c-412d-89dd-fc43b01cdfe7',
    sku: 'BG-NAB12',
      productName: 'BG Electrical 1-Gang 2-Way Metal Antique Brass Light Switch',
      category: 'Lighting Controls',
      vendor: 'BG Electrical',
      currentStock: 96,
      allocatedStock: 5,
      availableStock: 91,
      cost: 1.55,
      price: 3.1,
      reorderPoint: 10,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '12345678-1234-1234-1234-123456789012',
      sku: 'BG-NBN12',
      productName: 'BG Nexus Metal Black Nickel Switches and Sockets Full Range',
      category: 'Lighting Controls',
      vendor: 'BG Electrical',
      currentStock: 62,
      allocatedStock: 3,
      availableStock: 59,
      cost: 1.55,
      price: 3.1,
      reorderPoint: 15,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '87654321-4321-4321-4321-210987654321',
      sku: 'BG-NBS12',
      productName: 'BG Brushed Steel Light Switches & Sockets Full Range',
      category: 'Lighting Controls',
      vendor: 'BG Electrical',
      currentStock: 60,
      allocatedStock: 2,
      availableStock: 58,
      cost: 1.55,
      price: 3.1,
      reorderPoint: 12,
      lastUpdated: new Date().toISOString()
    }
  ];
  }

function getEnhancedMockOrders() {
  return [
    {
      id: 'order-001',
    orderNumber: 'ORD-2024-001',
      orderDate: '2024-01-15T10:30:00Z',
      customerId: 'cust-001',
      customerName: 'John Smith',
      totalPrice: 125.5,
      status: 'Completed',
      items: [
        { sku: 'BG-NAB12', quantity: 5, price: 3.1 },
        { sku: 'BG-NBN12', quantity: 3, price: 3.1 }
      ]
    },
    {
      id: 'order-002',
      orderNumber: 'ORD-2024-002',
      orderDate: '2024-01-16T14:20:00Z',
      customerId: 'cust-002',
      customerName: 'Sarah Johnson',
      totalPrice: 89.75,
      status: 'Processing',
      items: [
        { sku: 'BG-NBS12', quantity: 2, price: 3.1 },
        { sku: 'BG-NAB12', quantity: 1, price: 3.1 }
      ]
    }
  ];
  }

function getEnhancedMockRelationships() {
  return [
    {
      id: 'rel-001',
    masterProductId: '98781de8-591c-412d-89dd-fc43b01cdfe7',
      kitProductId: 'cd4ce63c-bafd-43ef-9b95-05432fe3b037',
      relationshipType: 'Master-Kit',
      quantity: 1
    },
    {
      id: 'rel-002',
      masterProductId: '12345678-1234-1234-1234-123456789012',
      kitProductId: '11111111-1111-1111-1111-111111111111',
      relationshipType: 'Master-Kit',
      quantity: 1
    }
  ];
  }

function getEnhancedMockCustomers() {
  return [
    {
      id: 'cust-001',
    name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+44 20 1234 5678',
      address: '123 Main St, London, UK',
      totalOrders: 5,
      totalSpent: 450.25
    },
    {
      id: 'cust-002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+44 20 8765 4321',
      address: '456 Oak Ave, Manchester, UK',
      totalOrders: 3,
      totalSpent: 289.75
    }
  ];
  }
