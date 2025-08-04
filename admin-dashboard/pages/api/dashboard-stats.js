import SellerDynamicsService from '../../lib/sellerdynamicsService';

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
    console.log('[Dashboard Stats] Fetching real SellerDynamics data...');
    
    const sellerDynamicsService = new SellerDynamicsService();
    const [stats, inventory] = await Promise.all([
      sellerDynamicsService.getDashboardStats(),
      sellerDynamicsService.getInventory()
    ]);
    
    console.log('[Dashboard Stats] Successfully fetched stats:', {
      totalProducts: stats.totalProducts,
      totalStock: inventory.totalStock,
      lowStockItems: inventory.lowStockItems,
      totalRevenue: stats.totalRevenue,
      dataSource: stats.dataSource
    });

    return res.status(200).json({
      success: true,
      data: {
        totalProducts: stats.totalProducts || inventory.totalItems,
        totalStock: inventory.totalStock,
        totalOrders: stats.totalOrders || 0,
        totalRevenue: stats.totalRevenue || 0,
        averageOrderValue: stats.averageOrderValue || 0,
        inventoryValue: stats.inventoryValue || 0,
        completedOrders: stats.completedOrders || 0,
        pendingOrders: stats.pendingOrders || 0,
        activeMarketplaces: stats.activeMarketplaces || 0,
        totalSettlement: stats.totalSettlement || 0,
        pendingSettlement: stats.pendingSettlement || 0,
        settledAmount: stats.settledAmount || 0,
        totalMarketplaces: stats.totalMarketplaces || 0,
        lowStockItems: inventory.lowStockItems,
        outOfStockItems: inventory.outOfStockItems,
        ordersToday: Math.floor((stats.totalOrders || 0) * 0.1), // Estimate 10% of total orders as today's orders
        dataSource: stats.dataSource || 'mock'
      },
      meta: {
        lastUpdated: stats.lastUpdated,
        dataSource: stats.dataSource,
        note: stats.dataSource === 'real' ? 'Using real SellerDynamics data' : 'Using mock data (no credentials configured)'
      }
    });
  } catch (error) {
    console.error('[Dashboard Stats] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
      message: error.message
    });
  }
} 