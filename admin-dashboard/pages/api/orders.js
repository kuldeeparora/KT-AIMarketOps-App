export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { marketplace = 'all' } = req.query;

  // Check for required environment variables
  const retailerId = process.env.SELLERDYNAMICS_RETAILER_ID;
  const encryptedLogin = process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN;

  if (!retailerId || !encryptedLogin) {
    console.warn('⚠️ [Orders API] Missing SellerDynamics credentials');
    return res.status(200).json({
      orders: [],
      stats: {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
      },
      dataSource: 'mock',
      error: 'Missing SellerDynamics credentials',
      lastUpdated: new Date().toISOString()
    });
  }

  console.log('🔍 [Orders API] Fetching orders with mock data...');

  try {
    // Mock orders data since the backend service doesn't exist
    const mockOrders = [
      {
        orderId: 'ORD-001',
        orderNumber: 'KT-2024-001',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        orderDate: '2024-01-15',
        totalAmount: 125.50,
        status: 'Shipped',
        marketplace: 'Amazon',
        items: [
          { sku: 'PROD-001', name: 'Premium Widget', quantity: 2, price: 62.75 }
        ],
        shippingAddress: '123 Main St, London, UK',
        billingAddress: '123 Main St, London, UK'
      },
      {
        orderId: 'ORD-002',
        orderNumber: 'KT-2024-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.johnson@email.com',
        orderDate: '2024-01-16',
        totalAmount: 89.99,
        status: 'Processing',
        marketplace: 'eBay',
        items: [
          { sku: 'PROD-002', name: 'Standard Widget', quantity: 1, price: 89.99 }
        ],
        shippingAddress: '456 Oak Ave, Manchester, UK',
        billingAddress: '456 Oak Ave, Manchester, UK'
      },
      {
        orderId: 'ORD-003',
        orderNumber: 'KT-2024-003',
        customerName: 'Mike Wilson',
        customerEmail: 'mike.wilson@email.com',
        orderDate: '2024-01-17',
        totalAmount: 245.75,
        status: 'Delivered',
        marketplace: 'Amazon',
        items: [
          { sku: 'PROD-003', name: 'Deluxe Widget', quantity: 1, price: 245.75 }
        ],
        shippingAddress: '789 Pine Rd, Birmingham, UK',
        billingAddress: '789 Pine Rd, Birmingham, UK'
      },
      {
        orderId: 'ORD-004',
        orderNumber: 'KT-2024-004',
        customerName: 'Emma Davis',
        customerEmail: 'emma.davis@email.com',
        orderDate: '2024-01-18',
        totalAmount: 67.25,
        status: 'Pending',
        marketplace: 'Shopify',
        items: [
          { sku: 'PROD-004', name: 'Basic Widget', quantity: 1, price: 67.25 }
        ],
        shippingAddress: '321 Elm St, Liverpool, UK',
        billingAddress: '321 Elm St, Liverpool, UK'
      }
    ];

    // Filter by marketplace if specified
    let filteredOrders = mockOrders;
    if (marketplace && marketplace !== 'all') {
      filteredOrders = mockOrders.filter(order => 
        order.marketplace && order.marketplace.toLowerCase() === marketplace.toLowerCase()
      );
    }

    // Calculate stats
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = filteredOrders.filter(order => order.status === 'Pending').length;
    const completedOrders = filteredOrders.filter(order => order.status === 'Delivered' || order.status === 'Shipped').length;

    console.log('✅ [Orders API] Successfully fetched mock orders');

    return res.status(200).json({
      orders: filteredOrders,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        pendingOrders,
        completedOrders,
        averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'
      },
      dataSource: 'mock',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [Orders API] Error fetching orders:', error);
    return res.status(500).json({
      error: 'Failed to fetch orders',
      message: error.message,
      dataSource: 'error',
      lastUpdated: new Date().toISOString()
    });
  }
}


