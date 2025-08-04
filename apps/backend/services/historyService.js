
/**
 * 📈 History Service - Tracks all inventory changes and movements
 */
const historyService = {
  /**
   * Get detailed inventory change history with advanced filtering
   */
  getHistory: (filters = {}) => {
    const mockHistory = [
      {
        id: 'HST-001',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        type: 'sale',
        operation: 'decrease',
        sku: 'KT001',
        productName: 'Premium Wireless Headphones',
        oldQuantity: 50,
        newQuantity: 47,
        difference: -3,
        reason: 'Customer purchase - Order #12345',
        user: 'cashier@kenttraders.com',
        source: 'pos_system',
        location: 'Store Front',
        notes: 'Bulk purchase by corporate client',
        metadata: {
          orderId: '12345',
          customerId: 'CORP-001',
          unitPrice: 159.99,
          totalValue: 479.97
        }
      },
      {
        id: 'HST-002',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        type: 'restock',
        operation: 'increase',
        sku: 'KT002',
        productName: 'Bluetooth Speaker Pro',
        oldQuantity: 15,
        newQuantity: 40,
        difference: +25,
        reason: 'Weekly restock from supplier',
        user: 'inventory@kenttraders.com',
        source: 'supplier_delivery',
        location: 'Main Warehouse',
        notes: 'Received shipment #SP-2025-001',
        metadata: {
          supplierId: 'SW-001',
          purchaseOrderId: 'PO-2025-015',
          unitCost: 54.99,
          totalCost: 1374.75
        }
      }
    ];

    // Apply filters
    let filtered = mockHistory;
    
    if (filters.sku) {
      filtered = filtered.filter(h => h.sku.toLowerCase().includes(filters.sku.toLowerCase()));
    }
    
    if (filters.type) {
      filtered = filtered.filter(h => h.type === filters.type);
    }
    
    if (filters.user) {
      filtered = filtered.filter(h => h.user.toLowerCase().includes(filters.user.toLowerCase()));
    }

    return filtered.slice(0, filters.limit || 50);
  },

  /**
   * Generate comprehensive history statistics
   */
  getHistoryStats: () => ({
    totalChanges: 1247,
    totalSnapshots: 52,
    changesLast24Hours: 23,
    changesLast7Days: 156,
    changesLast30Days: 634,
    averageDailyChanges: 21.1,
    mostActiveProducts: [
      { sku: 'KT001', productName: 'Premium Wireless Headphones', changes: 45 },
      { sku: 'KT002', productName: 'Bluetooth Speaker Pro', changes: 38 },
      { sku: 'KT003', productName: 'USB-C Cable 6ft', changes: 32 }
    ],
    changeTypeDistribution: {
      sale: 65,
      restock: 20,
      adjustment: 10,
      damaged: 3,
      returned: 2
    }
  })
};

export default historyService;
