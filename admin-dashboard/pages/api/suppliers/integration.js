export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { supplierId } = req.query;

      if (supplierId) {
        // Get specific supplier integration status,
        const supplier = await getSupplierIntegration(supplierId);
        return res.status(200).json(supplier);
      } else {
        // Get all supplier integrations
        const suppliers = await getAllSupplierIntegrations();
        return res.status(200).json(suppliers);
      }
    } catch (error) {
      console.error('Error fetching supplier integrations:', error);
      return res.status(500).json({ error: 'Failed to fetch supplier integrations' });
  }
  }

  if (req.method === 'POST') {
    try {
      const { supplierId, action, data } = req.body;

      let result;
      switch (action) {
        case 'send_order':
          result = await sendOrderToSupplier(supplierId, data);
          break;
        case 'check_stock':
          result = await checkSupplierStock(supplierId, data);
          break;
        case 'get_pricing':
          result = await getSupplierPricing(supplierId, data);
          break;
        case 'sync_inventory':
          result = await syncSupplierInventory(supplierId);
          break;
        default: return res.status(400).json({ error: 'Invalid action' });
  }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error with supplier integration:', error);
      return res.status(500).json({ error: 'Failed to process supplier action' });
  }
  }

  return res.status(405).json({ error: 'Method not allowed' });
  }

// Mock supplier integration functions
async function getSupplierIntegration(supplierId) {
  const suppliers = {
    'supplier-001': {
      id: 'supplier-001',
      name: 'Tech Supplies Ltd',
      integrationType: 'API',
      status: 'connected',
      lastSync: '2024-01-15T14:30:00Z',
      apiEndpoint: 'https://api.techsupplies.com/v1',
      capabilities: ['inventory', 'pricing', 'ordering'],
      responseTime: '2.3s',
      reliability: 0.98
    },
    'supplier-002': {
      id: 'supplier-002',
      name: 'Global Electronics',
      integrationType: 'EDI',
      status: 'connected',
      lastSync: '2024-01-15T13:45:00Z',
      apiEndpoint: 'https://edi.globalelectronics.com',
      capabilities: ['inventory', 'pricing'],
      responseTime: '1.8s',
      reliability: 0.95
    },
    'supplier-003': {
      id: 'supplier-003',
      name: 'Premium Components',
      integrationType: 'Manual',
      status: 'disconnected',
      lastSync: '2024-01-10T09:15:00Z',
      apiEndpoint: null,
      capabilities: ['pricing'],
      responseTime: 'N/A',
      reliability: 0.75
    }
  };

  return suppliers[supplierId] || { error: 'Supplier not found' };
}

async function getAllSupplierIntegrations() {
  const suppliers = await Promise.all([
    getSupplierIntegration('supplier-001'),
    getSupplierIntegration('supplier-002'),
    getSupplierIntegration('supplier-003')
  ]);

  return {
    suppliers: suppliers.filter(s => !s.error),
    summary: {
      totalSuppliers: suppliers.length,
      connectedSuppliers: suppliers.filter(s => s.status === 'connected').length,
      avgReliability: suppliers.reduce((sum, s) => sum + s.reliability, 0) / suppliers.length,
      lastSync: suppliers.reduce(
        (latest, s) => (s.lastSync > latest ? s.lastSync : latest),
        '1970-01-01T00:00:00Z'
      )
    }
  };
}

async function sendOrderToSupplier(supplierId, orderData) {
  // Mock order sending to supplier
  const order = {
    id: `PO-${Date.now()}`,
    supplierId,
    items: orderData.items,
    totalValue: orderData.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    status: 'sent',
    sentAt: new Date().toISOString(),
    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };

  return {
    success: true,
    order,
    message: 'Order sent successfully to supplier',
    estimatedDelivery: order.expectedDelivery
  };
}

async function checkSupplierStock(supplierId, productIds) {
  // Mock stock check with supplier
  const stockLevels = productIds.map(productId => ({
    productId,
    availableStock: Math.floor(Math.random() * 100) + 10,
    reservedStock: Math.floor(Math.random() * 20),
    leadTime: Math.floor(Math.random() * 14) + 1, // 1-14 days
    price: Math.floor(Math.random() * 50) + 10,
    lastUpdated: new Date().toISOString()
  }));

  return {
    success: true,
    stockLevels,
    checkedAt: new Date().toISOString()
  };
}

async function getSupplierPricing(supplierId, productIds) {
  // Mock pricing check with supplier
  const pricing = productIds.map(productId => ({
    productId,
    basePrice: Math.floor(Math.random() * 100) + 20,
    bulkDiscount: Math.random() * 0.3, // 0-30% discount
    minimumOrder: Math.floor(Math.random() * 50) + 10,
    currency: 'GBP',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }));

  return {
    success: true,
    pricing,
    retrievedAt: new Date().toISOString()
  };
}

async function syncSupplierInventory(supplierId) {
  // Mock inventory sync with supplier
  const syncResult = {
    success: true,
    syncedAt: new Date().toISOString(),
    productsUpdated: Math.floor(Math.random() * 50) + 10,
    newProducts: Math.floor(Math.random() * 5),
    discontinuedProducts: Math.floor(Math.random() * 3),
    priceChanges: Math.floor(Math.random() * 10),
    stockUpdates: Math.floor(Math.random() * 30)
  };

  return syncResult;
}
