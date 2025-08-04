
/**
 * 🚨 Alerts Service - Manages inventory alerts and thresholds
 */
const alertsService = {
  /**
   * Get recent inventory alerts with smart filtering
   */
  getRecentAlerts: (limit = 20, severity = 'all') => {
    const mockAlerts = [
      {
        id: 'ALT-001',
        level: 'critical',
        severity: 'high',
        sku: 'KT001',
        name: 'Premium Wireless Headphones',
        currentStock: 3,
        threshold: 10,
        message: '🚨 CRITICAL: KT001 is critically low (3 units remaining)',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: 'Main Warehouse',
        category: 'Electronics'
      },
      {
        id: 'ALT-002',
        level: 'warning',
        severity: 'medium',
        sku: 'KT002',
        name: 'Bluetooth Speaker Pro',
        currentStock: 8,
        threshold: 15,
        message: '⚠️  WARNING: KT002 needs restocking soon (8 units remaining)',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        location: 'Store Front',
        category: 'Electronics'
      },
      {
        id: 'ALT-003',
        level: 'info',
        severity: 'low',
        sku: 'KT003',
        name: 'USB-C Cable 6ft',
        currentStock: 45,
        threshold: 25,
        message: '💡 INFO: KT003 stock is healthy (45 units available)',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        location: 'Storage Room',
        category: 'Accessories'
      }
    ];

    return mockAlerts
      .filter(alert => severity === 'all' || alert.severity === severity)
      .slice(0, limit);
  },

  /**
   * Set custom threshold for product alerts
   */
  setProductThreshold: (sku, threshold, userId = 'system') => {
    
    return {
      success: true,
      sku,
      threshold,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Get alert statistics and trends
   */
  getAlertStats: () => ({
    totalAlerts: 3,
    critical: 1,
    warning: 1,
    info: 1,
    resolved24h: 2,
    avgResponseTime: '4.2 hours',
    trendDirection: 'decreasing'
  })
};

export default alertsService;
