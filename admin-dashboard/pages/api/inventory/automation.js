export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, data } = req.body;

    switch (action) {
      case 'auto-restock':
        return await handleAutoRestock(req, res);
      case 'generate-alerts':
        return await handleGenerateAlerts(req, res);
      case 'optimize-inventory':
        return await handleOptimizeInventory(req, res);
      case 'predict-demand':
        return await handlePredictDemand(req, res);
      case 'bulk-update':
        return await handleBulkUpdate(req, res);
      default: return res.status(400).json({ error: 'Invalid action' });
  }
  } catch (error) {
    console.error('Inventory automation error:', error);
    res.status(500).json({
      error: 'Automation failed',
      details: error.message});
  }
}

async function handleAutoRestock(req, res) {
  try {
    // Fetch current inventory data
    const [sellerdynamicsRes, shopifyRes] = await Promise.allSettled([
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/sellerdynamics`),
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/shopify-inventory`)]);

    const sellerdynamics =
      sellerdynamicsRes.status === 'fulfilled'
        ? await sellerdynamicsRes.value.json()
        : { stockLevels: [] };

    const shopify =
      shopifyRes.status === 'fulfilled'
        ? await shopifyRes.value.json()
        : { data: { products: [] } };

    // Analyze inventory levels
    const restockRecommendations = generateRestockRecommendations(sellerdynamics, shopify);

    // Generate purchase orders
    const purchaseOrders = generatePurchaseOrders(restockRecommendations);

    // Send notifications
    const notifications = generateRestockNotifications(restockRecommendations);

    res.status(200).json({
      success: true,
      restockRecommendations,
      purchaseOrders,
      notifications,
      summary: {
    totalItemsToRestock: restockRecommendations.length,
        estimatedCost: purchaseOrders.reduce((sum, po) => sum + po.totalCost, 0),
        priorityItems: restockRecommendations.filter(r => r.priority === 'critical').length
  }
    });
  } catch (error) {
    console.error('Auto-restock error:', error);
    res.status(500).json({ error: 'Auto-restock failed' });
  }
}

async function handleGenerateAlerts(req, res) {
  try {
    const { threshold = 10, includePredictions = true } = req.body;

    // Fetch inventory data
    const [sellerdynamicsRes, shopifyRes] = await Promise.allSettled([
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/sellerdynamics`),
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/shopify-inventory`)]);

    const sellerdynamics =
      sellerdynamicsRes.status === 'fulfilled'
        ? await sellerdynamicsRes.value.json()
        : { stockLevels: [] };

    const shopify =
      shopifyRes.status === 'fulfilled'
        ? await shopifyRes.value.json()
        : { data: { products: [] } };

    // Generate alerts
    const alerts = generateInventoryAlerts(sellerdynamics, shopify, threshold, includePredictions);

    res.status(200).json({
      success: true,
      alerts,
      summary: {
    criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        warningAlerts: alerts.filter(a => a.severity === 'warning').length,
        infoAlerts: alerts.filter(a => a.severity === 'info').length
  }
    });
  } catch (error) {
    console.error('Alert generation error:', error);
    res.status(500).json({ error: 'Alert generation failed' });
  }
}

async function handleOptimizeInventory(req, res) {
  try {
    const { optimizationType = 'all' } = req.body;

    // Fetch inventory data
    const [sellerdynamicsRes, shopifyRes] = await Promise.allSettled([
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/sellerdynamics`),
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/shopify-inventory`)]);

    const sellerdynamics =
      sellerdynamicsRes.status === 'fulfilled'
        ? await sellerdynamicsRes.value.json()
        : { stockLevels: [] };

    const shopify =
      shopifyRes.status === 'fulfilled'
        ? await shopifyRes.value.json()
        : { data: { products: [] } };

    // Generate optimization recommendations
    const optimizations = generateInventoryOptimizations(sellerdynamics, shopify, optimizationType);

    res.status(200).json({
      success: true,
      optimizations,
      summary: {
    totalOptimizations: optimizations.length,
        critical: optimizations.filter(o => o.priority === 'critical').length,
        high: optimizations.filter(o => o.priority === 'high').length,
        medium: optimizations.filter(o => o.priority === 'medium').length,
        low: optimizations.filter(o => o.priority === 'low').length
  }
    });
  } catch (error) {
    console.error('Inventory optimization error:', error);
    res.status(500).json({ error: 'Inventory optimization failed' });
  }
}

async function handlePredictDemand(req, res) {
  try {
    const { timeFrame = '30', productIds = [] } = req.body;

    // Generate demand predictions
    const predictions = generateDemandPredictions(timeFrame, productIds);

    res.status(200).json({
      success: true,
      predictions,
      summary: {
    totalProducts: predictions.length,
        averageDemand:
          predictions.reduce((sum, p) => sum + p.predictedDemand, 0) / predictions.length,
        highDemandProducts: predictions.filter(p => p.predictedDemand > 100).length
  }
    });
  } catch (error) {
    console.error('Demand prediction error:', error);
    res.status(500).json({ error: 'Demand prediction failed' });
  }
}

async function handleBulkUpdate(req, res) {
  try {
    const { updates, operation } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: 'Invalid updates data' });
  }

    // Process bulk updates
    const results = await processBulkUpdates(updates, operation);

    res.status(200).json({
      success: true,
      results,
      summary: {
    totalUpdated: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length,
        operation
      }
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Bulk update failed' });
  }
}

function generateRestockRecommendations(sellerdynamics, shopify) {
  const recommendations = [];

  // Process SellerDynamics data
  sellerdynamics.stockLevels?.forEach((item, index) => {
    const currentStock = item.currentStock || 0;
    const reorderPoint = item.reorderPoint || 10;
    const maxStock = item.maxStock || 100;

    if (currentStock <= reorderPoint) {
      const recommendedOrder = Math.max(maxStock - currentStock, 20);
      recommendations.push({
        productId: `sd-${index}`,
        productName: item.productName || 'Unknown Product',
        sku: item.sku || `SD-${index}`,
        currentStock,
        reorderPoint,
        maxStock,
        recommendedOrder,
        priority: currentStock === 0 ? 'critical' : currentStock <= 5 ? 'high' : 'medium',
        estimatedCost: recommendedOrder * (item.cost || 0),
        supplier: item.supplier || 'Unknown',
        leadTime: item.leadTime || 7, // days
      });
    }
  });

  // Process Shopify data
  shopify.data?.products?.forEach(item => {
    const variant = item.variants?.[0] || {};
    const currentStock = variant.inventory_quantity || 0;
    const reorderPoint = 10; // Default threshold

    if (currentStock <= reorderPoint) {
      const recommendedOrder = Math.max(50 - currentStock, 20);
      recommendations.push({
        productId: `shop-${item.id}`,
        productName: item.title,
        sku: variant.sku || `SHOP-${item.id}`,
        currentStock,
        reorderPoint,
        maxStock: 50,
        recommendedOrder,
        priority: currentStock === 0 ? 'critical' : currentStock <= 5 ? 'high' : 'medium',
        estimatedCost: recommendedOrder * 0, // No cost data available
        supplier: 'Unknown',
        leadTime: 7, // Default lead time
      });
    }
  });

  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 3, high: 2, medium: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function generatePurchaseOrders(recommendations) {
  const purchaseOrders = [];
  const supplierGroups = {};

  // Group by supplier
  recommendations.forEach(rec => {
    if (!supplierGroups[rec.supplier]) {
      supplierGroups[rec.supplier] = [];
    }
    supplierGroups[rec.supplier].push(rec);
  });

  // Generate purchase orders for each supplier
  Object.keys(supplierGroups).forEach(supplier => {
    const items = supplierGroups[supplier];
    const totalCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);

    purchaseOrders.push({
      poNumber: `PO-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      supplier,
      items,
      totalCost,
      totalItems: items.length,
      priority: items.some(item => item.priority === 'critical') ? 'urgent' : 'normal',
      estimatedDelivery: new Date(
        Date.now() + Math.max(...items.map(item => item.leadTime)) * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'pending',});
  });

  return purchaseOrders;
}

function generateRestockNotifications(recommendations) {
  const notifications = [];

  // Critical stock notifications
  const criticalItems = recommendations.filter(r => r.priority === 'critical');
  if (criticalItems.length > 0) {
    notifications.push({
      type: 'critical',
      title: 'Critical Stock Alert',
      message: `${criticalItems.length} products are out of stock and need immediate attention`,
      products: criticalItems.slice(0, 5).map(item => item.productName),
      action: 'restock'});
  }

  // Low stock notifications
  const lowStockItems = recommendations.filter(r => r.priority === 'high');
  if (lowStockItems.length > 0) {
    notifications.push({
      type: 'warning',
      title: 'Low Stock Alert',
      message: `${lowStockItems.length} products are running low on stock`,
      products: lowStockItems.slice(0, 5).map(item => item.productName),
      action: 'restock'});
  }

  return notifications;
}

function generateInventoryAlerts(sellerdynamics, shopify, threshold, includePredictions) {
  const alerts = [];

  // Process all inventory data
  const allProducts = [];

  sellerdynamics.stockLevels?.forEach((item, index) => {
    allProducts.push({
      id: `sd-${index}`,
      name: item.productName || 'Unknown Product',
      sku: item.sku || `SD-${index}`,
      stock: item.currentStock || 0,
      source: 'SellerDynamics',
      allocatedStock: item.allocatedStock || 0,
      availableStock: item.availableStock || 0});
  });

  shopify.data?.products?.forEach(item => {
    const variant = item.variants?.[0] || {};
    allProducts.push({
      id: `shop-${item.id}`,
      name: item.title,
      sku: variant.sku || `SHOP-${item.id}`,
      stock: variant.inventory_quantity || 0,
      source: 'Shopify',
      allocatedStock: 0,
      availableStock: variant.inventory_quantity || 0});
  });

  // Generate alerts
  allProducts.forEach(product => {
    if (product.stock === 0) {
      alerts.push({
        id: `alert-${product.id}`,
        type: 'stockout',
        severity: 'critical',
        title: 'Out of Stock',
        message: `${product.name} (${product.sku}) is out of stock`,
        product: product.name,
        sku: product.sku,
        currentStock: product.stock,
        recommendedAction: 'Restock immediately',
        timestamp: new Date().toISOString()});
  } else if (product.stock <= threshold) {
      alerts.push({
        id: `alert-${product.id}`,
        type: 'low_stock',
        severity: 'warning',
        title: 'Low Stock',
        message: `${product.name} (${product.sku}) is running low on stock`,
        product: product.name,
        sku: product.sku,
        currentStock: product.stock,
        threshold,
        recommendedAction: 'Consider restocking',
        timestamp: new Date().toISOString()});
  }
  });

  // Add predictive alerts if requested
  if (includePredictions) {
    const predictedStockouts = generatePredictedStockouts(allProducts);
    alerts.push(...predictedStockouts);
  }

  return alerts;
}

function generatePredictedStockouts(products) {
  const alerts = [];

  // Mock prediction logic - in real system would use ML models
  products.forEach(product => {
    if (product.stock > 0 && product.stock <= 5) {
      const daysUntilStockout = Math.floor(product.stock / 2); // Mock calculation

      if (daysUntilStockout <= 7) {
        alerts.push({
          id: `prediction-${product.id}`,
          type: 'predicted_stockout',
          severity: 'warning',
          title: 'Predicted Stockout',
          message: `${product.name} (${product.sku}) may run out of stock in ${daysUntilStockout} days`,
          product: product.name,
          sku: product.sku,
          currentStock: product.stock,
          predictedStockoutDate: new Date(
            Date.now() + daysUntilStockout * 24 * 60 * 60 * 1000
          ).toISOString(),
          confidence: 85, // Mock confidence level
          recommendedAction: 'Plan restocking',
          timestamp: new Date().toISOString()});
  }
    }
  });

  return alerts;
}

function generateInventoryOptimizations(sellerdynamics, shopify, optimizationType) {
  const optimizations = [];

  // Combine all products
  const allProducts = [];

  sellerdynamics.stockLevels?.forEach((item, index) => {
    allProducts.push({
      id: `sd-${index}`,
      name: item.productName || 'Unknown Product',
      sku: item.sku || `SD-${index}`,
      stock: item.currentStock || 0,
      price: item.price || 0,
      cost: item.cost || 0,
      source: 'SellerDynamics'});
  });

  shopify.data?.products?.forEach(item => {
    const variant = item.variants?.[0] || {};
    allProducts.push({
      id: `shop-${item.id}`,
      name: item.title,
      sku: variant.sku || `SHOP-${item.id}`,
      stock: variant.inventory_quantity || 0,
      price: parseFloat(variant.price) || 0,
      cost: 0,
      source: 'Shopify'});
  });

  if (optimizationType === 'all' || optimizationType === 'overstock') {
    // Overstock optimization
    const overstockedProducts = allProducts.filter(p => p.stock > 50);
    overstockedProducts.forEach(product => {
      optimizations.push({
        type: 'overstock_reduction',
        product: product.name,
        sku: product.sku,
        currentStock: product.stock,
        recommendedReduction: Math.floor(product.stock * 0.3),
        potentialSavings: product.cost * Math.floor(product.stock * 0.3),
        action: 'Consider promotions or discounts',
        priority: 'medium'});
  });
  }

  if (optimizationType === 'all' || optimizationType === 'pricing') {
    // Pricing optimization
    const lowProfitProducts = allProducts.filter(
      p => p.price > 0 && p.cost > 0 && (p.price - p.cost) / p.price < 0.2
    );
    lowProfitProducts.forEach(product => {
      const currentMargin = ((product.price - product.cost) / product.price) * 100;
      const recommendedPrice = product.cost * 1.3; // 30% margin

      optimizations.push({
        type: 'pricing_optimization',
        product: product.name,
        sku: product.sku,
        currentPrice: product.price,
        recommendedPrice: recommendedPrice,
        currentMargin: currentMargin,
        potentialMargin: ((recommendedPrice - product.cost) / recommendedPrice) * 100,
        potentialSavings: (recommendedPrice - product.price) * product.stock,
        action: 'Consider price increase',
        priority: 'medium'});
  });
  }

  if (optimizationType === 'all' || optimizationType === 'efficiency') {
    // Efficiency optimization
    const slowMovingProducts = allProducts.filter(p => p.stock > 20 && p.stock < 50);
    slowMovingProducts.forEach(product => {
      optimizations.push({
        type: 'efficiency_improvement',
        product: product.name,
        sku: product.sku,
        currentStock: product.stock,
        recommendedStock: Math.floor(product.stock * 0.7),
        potentialSavings: product.cost * Math.floor(product.stock * 0.3),
        action: 'Reduce reorder quantities',
        priority: 'low'});
  });
  }

  return optimizations;
}

function generateDemandPredictions(timeFrame, productIds) {
  // Mock demand predictions - in real system would use ML models
  const predictions = [];

  // Generate predictions for specified products or all products
  const products =
    productIds.length > 0 ? productIds : Array.from({ length: 20 }, (_, i) => `product-${i}`);

  products.forEach((productId, index) => {
    const baseDemand = Math.floor(Math.random() * 100) + 20;
    const seasonalFactor = 1 + Math.sin(Date.now() / (1000 * 60 * 60 * 24 * 30)) * 0.3;
    const predictedDemand = Math.floor(baseDemand * seasonalFactor);

    predictions.push({
      productId,
      productName: `Product ${index + 1}`,
      predictedDemand,
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
      timeFrame: `${timeFrame} days`,
      factors: ['seasonal', 'trend,', 'historical'],
      recommendation: predictedDemand > 50 ? 'Increase stock' : 'Maintain current levels'});
  });

  return predictions;
}

async function processBulkUpdates(updates, operation) {
  const results = [];

  for (const update of updates) {
    try {
      // Mock bulk update processing
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing time

      results.push({
        id: update.id,
        success: true,
        message: `${operation} completed successfully`,
        timestamp: new Date().toISOString()});
  } catch (error) {
      results.push({
        id: update.id,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()});
  }
  }

  return results;
}
