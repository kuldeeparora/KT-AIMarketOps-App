export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch inventory data from multiple sources
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

    // Process and analyze data
    const analytics = generateAdvancedAnalytics(sellerdynamics, shopify);

    res.status(200).json(analytics);
  } catch (error) {
    console.error('Error generating inventory analytics:', error);
    res.status(500).json({
      error: 'Failed to generate analytics',
      details: error.message});
  }
}

function generateAdvancedAnalytics(sellerdynamics, shopify) {
  const allProducts = [];

  // Process SellerDynamics data
  sellerdynamics.stockLevels?.forEach((item, index) => {
    allProducts.push({
      id: `sd-${index}`,
      name: item.productName || 'Unknown Product',
      sku: item.sku || `SD-${index}`,
      category: item.category || 'General',
      stock: item.currentStock || 0,
      price: item.price || 0,
      cost: item.cost || 0,
      allocatedStock: item.allocatedStock || 0,
      availableStock: item.availableStock || 0,
      source: 'SellerDynamics',
      lastUpdated: item.lastUpdated || new Date().toISOString(),
      turnoverRate: Math.random() * 100, // Mock data
      profitMargin: item.price && item.cost ? ((item.price - item.cost) / item.price) * 100 : 0});
  });

  // Process Shopify data
  shopify.data?.products?.forEach(item => {
    const variant = item.variants?.[0] || {};
    allProducts.push({
      id: `shop-${item.id}`,
      name: item.title,
      sku: variant.sku || `SHOP-${item.id}`,
      category: item.product_type || 'General',
      stock: variant.inventory_quantity || 0,
      price: parseFloat(variant.price) || 0,
      cost: 0,
      allocatedStock: 0,
      availableStock: variant.inventory_quantity || 0,
      source: 'Shopify',
      lastUpdated: new Date().toISOString(),
      turnoverRate: Math.random() * 100, // Mock data
      profitMargin: 0});
  });

  // Calculate analytics
  const totalProducts = allProducts.length;
  const totalValue = allProducts.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalCost = allProducts.reduce((sum, p) => sum + p.cost * p.stock, 0);
  const totalProfit = totalValue - totalCost;
  const averageProfitMargin = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;

  // Stock level analysis
  const outOfStock = allProducts.filter(p => p.stock === 0);
  const lowStock = allProducts.filter(p => p.stock > 0 && p.stock <= 10);
  const wellStocked = allProducts.filter(p => p.stock > 10 && p.stock <= 50);
  const overstocked = allProducts.filter(p => p.stock > 50);

  // Category analysis
  const categoryAnalysis = {};
  allProducts.forEach(product => {
    if (!categoryAnalysis[product.category]) {
      categoryAnalysis[product.category] = {
        count: 0,
        totalValue: 0,
        totalStock: 0,
        averagePrice: 0,
        lowStockCount: 0};
  }
    categoryAnalysis[product.category].count++;
    categoryAnalysis[product.category].totalValue += product.price * product.stock;
    categoryAnalysis[product.category].totalStock += product.stock;
    if (product.stock <= 10) categoryAnalysis[product.category].lowStockCount++;
  });

  // Calculate averages
  Object.keys(categoryAnalysis).forEach(category => {
    const cat = categoryAnalysis[category];
    cat.averagePrice = cat.count > 0 ? cat.totalValue / cat.totalStock : 0;
  });

  // Top performing products
  const topSellingProducts = allProducts
    .sort((a, b) => b.turnoverRate - a.turnoverRate)
    .slice(0, 10);

  // Slow moving products
  const slowMovingProducts = allProducts
    .filter(p => p.turnoverRate < 20)
    .sort((a, b) => a.turnoverRate - b.turnoverRate)
    .slice(0, 10);

  // Predictive analytics
  const predictions = generatePredictions(allProducts);

  // Recommendations
  const recommendations = generateRecommendations(allProducts, categoryAnalysis);

  return {
    summary: {
      totalProducts,
      totalValue: totalValue.toFixed(2),
      totalCost: totalCost.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      averageProfitMargin: averageProfitMargin.toFixed(2),
      averageStockLevel: (allProducts.reduce((sum, p) => sum + p.stock, 0) / totalProducts).toFixed(
        2
      )},
    stockLevels: {
    outOfStock: outOfStock.length,
      lowStock: lowStock.length,
      wellStocked: wellStocked.length,
      overstocked: overstocked.length
  },
    categoryAnalysis,
    topSellingProducts: topSellingProducts.map(p => ({
    name: p.name,
      sku: p.sku,
      turnoverRate: p.turnoverRate.toFixed(1),
      stock: p.stock,
      value: (p.price * p.stock).toFixed(2)})),
    slowMovingProducts: slowMovingProducts.map(p => ({
    name: p.name,
      sku: p.sku,
      turnoverRate: p.turnoverRate.toFixed(1),
      stock: p.stock,
      value: (p.price * p.stock).toFixed(2)})),
    predictions,
    recommendations,
    alerts: generateAlerts(allProducts),
    trend: generateTrends(allProducts)};
  }

function generatePredictions(products) {
  // Mock predictive analytics
  return {
    stockoutRisk: products.filter(p => p.stock <= 5).length,
    restockRecommendations: products
      .filter(p => p.stock <= 10)
      .map(p => ({
        product: p.name,
        sku: p.sku,
        currentStock: p.stock,
        recommendedOrder: Math.max(20 - p.stock, 10),
        urgency: p.stock === 0 ? 'Critical' : p.stock <= 5 ? 'High' : 'Medium'})),
    salesForecast: {
    nextWeek: Math.floor(Math.random() * 1000) + 500,
      nextMonth: Math.floor(Math.random() * 5000) + 2000,
      nextQuarter: Math.floor(Math.random() * 15000) + 8000},
    profitProjection: {
    nextWeek: Math.floor(Math.random() * 200) + 100,
      nextMonth: Math.floor(Math.random() * 1000) + 500,
      nextQuarter: Math.floor(Math.random() * 3000) + 1500}};
  }

function generateRecommendations(products, categoryAnalysis) {
  const recommendations = [];

  // Low stock recommendations
  const lowStockProducts = products.filter(p => p.stock <= 10);
  if (lowStockProducts.length > 0) {
    recommendations.push({
      type: 'restock',
      priority: 'high',
      title: 'Low Stock Alert',
      description: `${lowStockProducts.length} products need immediate restocking`,
      products: lowStockProducts.slice(0, 5).map(p => p.name)});
  }

  // Overstocked recommendations
  const overstockedProducts = products.filter(p => p.stock > 50);
  if (overstockedProducts.length > 0) {
    recommendations.push({
      type: 'promotion',
      priority: 'medium',
      title: 'Overstocked Products',
      description: `${overstockedProducts.length} products are overstocked - consider promotions`,
      products: overstockedProducts.slice(0, 5).map(p => p.name)});
  }

  // Profit optimization
  const lowProfitProducts = products.filter(p => p.profitMargin < 20);
  if (lowProfitProducts.length > 0) {
    recommendations.push({
      type: 'pricing',
      priority: 'medium',
      title: 'Low Profit Margins',
      description: `${lowProfitProducts.length} products have low profit margins`,
      products: lowProfitProducts.slice(0, 5).map(p => p.name)});
  }

  return recommendations;
}

function generateAlerts(products) {
  const alerts = [];

  // Out of stock alerts
  const outOfStock = products.filter(p => p.stock === 0);
  if (outOfStock.length > 0) {
    alerts.push({
      type: 'critical',
      title: 'Out of Stock Products',
      count: outOfStock.length,
      products: outOfStock.slice(0, 5).map(p => p.name)});
  }

  // Low stock alerts
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  if (lowStock.length > 0) {
    alerts.push({
      type: 'warning',
      title: 'Low Stock Products',
      count: lowStock.length,
      products: lowStock.slice(0, 5).map(p => p.name)});
  }

  return alerts;
}

function generateTrends(products) {
  // Mock trend, data
  return {
    stockLevels: {
    trend: 'decreasing',
      change: -5.2,
      period: 'last 7 days'},
    sales: {
    trend: 'increasing',
      change: 12.8,
      period: 'last 7 days'},
    profit: {
    trend: 'stable',
      change: 2.1,
      period: 'last 7 days'}};
  }
