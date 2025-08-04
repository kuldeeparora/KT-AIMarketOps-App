/**
 * Inventory History Service
 * Tracks inventory changes, audit trail, and historical snapshots
 */
class InventoryHistoryService {
  constructor() {
    this.history = [];
    this.snapshots = [];
    this.maxHistorySize = 1000; // Keep last 1000 changes
    this.maxSnapshots = 100;    // Keep last 100 snapshots
  }

  /**
   * Log inventory change
   */
  logInventoryChange(change) {
    const historyEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type: change.type || 'update', // 'update', 'upload', 'manual', 'sync'
      sku: change.sku,
      productName: change.productName,
      oldQuantity: change.oldQuantity,
      newQuantity: change.newQuantity,
      difference: change.newQuantity - change.oldQuantity,
      user: change.user || 'system',
      source: change.source || 'unknown', // 'sellerdynamics', 'csv', 'manual', 'api'
      notes: change.notes || '',
      metadata: change.metadata || {}
    };

    this.history.push(historyEntry);

    // Keep history size manageable
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }

    console.log(`📝 [Inventory History] Logged change: ${change.sku} ${change.oldQuantity} → ${change.newQuantity}`);
    return historyEntry;
  }

  /**
   * Create inventory snapshot
   */
  createSnapshot(inventoryData, snapshotType = 'daily') {
    const snapshot = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type: snapshotType, // 'daily', 'weekly', 'monthly', 'manual'
      totalProducts: inventoryData.products?.length || 0,
      totalValue: inventoryData.totalValue || 0,
      products: inventoryData.products?.map(product => ({
        sku: product.sku,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        category: product.category,
        supplier: product.supplier
      })) || []
    };

    this.snapshots.push(snapshot);

    // Keep snapshots size manageable
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots = this.snapshots.slice(-this.maxSnapshots);
    }

    console.log(`📸 [Inventory History] Created ${snapshotType} snapshot: ${snapshot.totalProducts} products`);
    return snapshot;
  }

  /**
   * Get inventory history with filters
   */
  getHistory(filters = {}) {
    let filteredHistory = [...this.history];

    // Filter by SKU
    if (filters.sku) {
      filteredHistory = filteredHistory.filter(entry => 
        entry.sku.toLowerCase().includes(filters.sku.toLowerCase())
      );
    }

    // Filter by type
    if (filters.type) {
      filteredHistory = filteredHistory.filter(entry => 
        entry.type === filters.type
      );
    }

    // Filter by date range
    if (filters.startDate) {
      filteredHistory = filteredHistory.filter(entry => 
        new Date(entry.timestamp) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filteredHistory = filteredHistory.filter(entry => 
        new Date(entry.timestamp) <= new Date(filters.endDate)
      );
    }

    // Filter by user
    if (filters.user) {
      filteredHistory = filteredHistory.filter(entry => 
        entry.user.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    // Sort by timestamp (newest first)
    filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply limit
    if (filters.limit) {
      filteredHistory = filteredHistory.slice(0, filters.limit);
    }

    return filteredHistory;
  }

  /**
   * Get inventory snapshots
   */
  getSnapshots(filters = {}) {
    let filteredSnapshots = [...this.snapshots];

    // Filter by type
    if (filters.type) {
      filteredSnapshots = filteredSnapshots.filter(snapshot => 
        snapshot.type === filters.type
      );
    }

    // Filter by date range
    if (filters.startDate) {
      filteredSnapshots = filteredSnapshots.filter(snapshot => 
        new Date(snapshot.timestamp) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filteredSnapshots = filteredSnapshots.filter(snapshot => 
        new Date(snapshot.timestamp) <= new Date(filters.endDate)
      );
    }

    // Sort by timestamp (newest first)
    filteredSnapshots.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply limit
    if (filters.limit) {
      filteredSnapshots = filteredSnapshots.slice(0, filters.limit);
    }

    return filteredSnapshots;
  }

  /**
   * Get product history
   */
  getProductHistory(sku, limit = 50) {
    return this.getHistory({ sku, limit });
  }

  /**
   * Get inventory statistics
   */
  getInventoryStats() {
    const totalChanges = this.history.length;
    const totalSnapshots = this.snapshots.length;
    
    // Calculate change frequency
    const last30Days = this.history.filter(entry => 
      new Date(entry.timestamp) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    // Calculate average daily changes
    const averageDailyChanges = totalChanges > 0 ? 
      (totalChanges / Math.max(1, Math.floor((Date.now() - new Date(this.history[0]?.timestamp || Date.now())) / (24 * 60 * 60 * 1000)))).toFixed(2) : 0;

    // Get most active products
    const productActivity = {};
    this.history.forEach(entry => {
      if (!productActivity[entry.sku]) {
        productActivity[entry.sku] = 0;
      }
      productActivity[entry.sku]++;
    });

    const mostActiveProducts = Object.entries(productActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([sku, count]) => ({ sku, changes: count }));

    return {
      totalChanges,
      totalSnapshots,
      changesLast30Days: last30Days,
      averageDailyChanges,
      mostActiveProducts
    };
  }

  /**
   * Compare snapshots
   */
  compareSnapshots(snapshotId1, snapshotId2) {
    const snapshot1 = this.snapshots.find(s => s.id === snapshotId1);
    const snapshot2 = this.snapshots.find(s => s.id === snapshotId2);

    if (!snapshot1 || !snapshot2) {
      throw new Error('One or both snapshots not found');
    }

    const comparison = {
      snapshot1: {
        id: snapshot1.id,
        timestamp: snapshot1.timestamp,
        totalProducts: snapshot1.totalProducts,
        totalValue: snapshot1.totalValue
      },
      snapshot2: {
        id: snapshot2.id,
        timestamp: snapshot2.timestamp,
        totalProducts: snapshot2.totalProducts,
        totalValue: snapshot2.totalValue
      },
      differences: {
        productCountChange: snapshot2.totalProducts - snapshot1.totalProducts,
        valueChange: snapshot2.totalValue - snapshot1.totalValue,
        timeDifference: new Date(snapshot2.timestamp) - new Date(snapshot1.timestamp)
      },
      productChanges: []
    };

    // Create maps for easy lookup
    const products1 = new Map(snapshot1.products.map(p => [p.sku, p]));
    const products2 = new Map(snapshot2.products.map(p => [p.sku, p]));

    // Find all unique SKUs
    const allSkus = new Set([...products1.keys(), ...products2.keys()]);

    for (const sku of allSkus) {
      const product1 = products1.get(sku);
      const product2 = products2.get(sku);

      if (product1 && product2) {
        // Product exists in both snapshots
        if (product1.quantity !== product2.quantity || product1.price !== product2.price) {
          comparison.productChanges.push({
            sku,
            name: product2.name,
            quantityChange: product2.quantity - product1.quantity,
            priceChange: product2.price - product1.price,
            oldQuantity: product1.quantity,
            newQuantity: product2.quantity,
            oldPrice: product1.price,
            newPrice: product2.price
          });
        }
      } else if (product1) {
        // Product removed
        comparison.productChanges.push({
          sku,
          name: product1.name,
          quantityChange: -product1.quantity,
          priceChange: -product1.price,
          oldQuantity: product1.quantity,
          newQuantity: 0,
          oldPrice: product1.price,
          newPrice: 0,
          status: 'removed'
        });
      } else if (product2) {
        // Product added
        comparison.productChanges.push({
          sku,
          name: product2.name,
          quantityChange: product2.quantity,
          priceChange: product2.price,
          oldQuantity: 0,
          newQuantity: product2.quantity,
          oldPrice: 0,
          newPrice: product2.price,
          status: 'added'
        });
      }
    }

    return comparison;
  }

  /**
   * Export history to CSV
   */
  exportHistoryToCSV(filters = {}) {
    const history = this.getHistory(filters);
    
    const headers = [
      'Timestamp',
      'Type',
      'SKU',
      'Product Name',
      'Old Quantity',
      'New Quantity',
      'Difference',
      'User',
      'Source',
      'Notes'
    ];

    const rows = history.map(entry => [
      entry.timestamp,
      entry.type,
      entry.sku,
      entry.productName,
      entry.oldQuantity,
      entry.newQuantity,
      entry.difference,
      entry.user,
      entry.source,
      entry.notes
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Clear old history (for maintenance)
   */
  clearOldHistory(daysToKeep = 90) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    const initialCount = this.history.length;
    
    this.history = this.history.filter(entry => 
      new Date(entry.timestamp) >= cutoffDate
    );
    
    const removedCount = initialCount - this.history.length;
    console.log(`🧹 [Inventory History] Cleared ${removedCount} old entries (kept last ${daysToKeep} days)`);
    
    return removedCount;
  }
}

export default InventoryHistoryService; 