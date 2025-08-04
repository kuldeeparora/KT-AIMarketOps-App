
export function generateAIInsights(products) {
  if (!products || !Array.isArray(products)) return [];
  
  const lowStockCount = products.filter(p => p.quantity <= 10 && p.quantity > 0).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  const totalProducts = products.length;
  
  const insights = [];
  
  if (lowStockCount > 0) {
    insights.push({
      title: 'Low Stock Alert',
      description: `${lowStockCount} products are running low on stock and need reordering`
    });
  }
  
  if (outOfStockCount > 0) {
    insights.push({
      title: 'Out of Stock Items',
      description: `${outOfStockCount} products are currently out of stock - urgent action needed`
    });
  }
  
  // Analyze supplier performance
  const suppliers = {};
  products.forEach(product => {
    if (product.supplier) {
      if (!suppliers[product.supplier]) {
        suppliers[product.supplier] = { count: 0, lowStock: 0 };
      }
      suppliers[product.supplier].count++;
      if (product.quantity <= 10) {
        suppliers[product.supplier].lowStock++;
      }
    }
  });
  
  const bestSupplier = Object.entries(suppliers)
    .sort(([,a], [,b]) => (b.count - b.lowStock) - (a.count - a.lowStock))[0];
  
  if (bestSupplier) {
    insights.push({
      title: 'Supplier Performance',
      description: `${bestSupplier[0]} has the best stock management with ${bestSupplier[1].count - bestSupplier[1].lowStock} well-stocked items`
    });
  }
  
  return insights;
}

export function generateAlerts(products) {
  if (!products || !Array.isArray(products)) return [];
  
  const alerts = [];
  
  // Check for out of stock items
  const outOfStock = products.filter(p => p.quantity === 0);
  outOfStock.forEach(product => {
    alerts.push({
      severity: 'critical',
      message: `${product.name} is out of stock - urgent reorder needed`,
      timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000)
    });
  });
  
  // Check for low stock items
  const lowStock = products.filter(p => p.quantity <= 10 && p.quantity > 0);
  if (lowStock.length > 0) {
    alerts.push({
      severity: 'high',
      message: `${lowStock.length} products are running low on stock`,
      timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000)
    });
  }
  
  // Check for overstocked items
  const overstocked = products.filter(p => p.quantity > (p.maxStock || 100) * 0.9);
  if (overstocked.length > 0) {
    alerts.push({
      severity: 'medium',
      message: `${overstocked.length} products are overstocked`,
      timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000)
    });
  }
  
  return alerts;
}
