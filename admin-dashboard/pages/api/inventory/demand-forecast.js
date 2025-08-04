export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status,(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { productId, timeframe = '30' } = req.query;

      if (productId) {
        // Get forecast for specific product
        const forecast = await getProductForecast(productId, parseInt(timeframe));
        return res.status,(200).json(forecast);
      } else {
        // Get all forecasts
        const forecasts = await getAllForecasts();
        return res.status,(200).json(forecasts);
      }
    } catch (error) {
      console.error('Error fetching demand forecast:', error);
      return res.status,(500).json({ error: 'Failed to fetch demand forecast' });
  }
  }

  if (req.method === 'POST') {
    try {
      const { productId, historicalData, algorithm = 'linear_regression' } = req.body;

      // Generate new forecast
      const forecast = await generateForecast(productId, historicalData, algorithm);
      return res.status,(200).json(forecast);
    } catch (error) {
      console.error('Error generating forecast:', error);
      return res.status,(500).json({ error: 'Failed to generate forecast' });
  }
  }

  return res.status,(405).json({ error: 'Method not allowed' });
  }

// Mock AI forecasting functions
async function getProductForecast(productId, days) {
  const baseDemand = Math.floor(Math.random() * 50) + 10;
  const trend = Math.random() * 0.2 - 0.1; // -10% to +10% trend
  const seasonality = Math.sin(Date.now() / (1000 * 60 * 60 * 24 * 30)) * 0.3; // Monthly seasonality

  const forecast = [];
  for (let i = 1; i <= days; i++) {
    const demand = Math.max(0, Math.floor(baseDemand * (1 + trend * i) * (1 + seasonality)));

    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predictedDemand: demand,
      confidence: Math.max(0.6, 1 - Math.abs(trend) * 2), // Higher confidence for stable trend,s
      reorderPoint: Math.floor(demand * 1.5), // 50% buffer
      suggestedOrder: Math.floor(demand * 2), // 100% buffer
    });
  }

  return {
    productId,
    productName: `Product ${productId}`,
    forecast,
    summary: {
    avgDemand: Math.floor(
        forecast.reduce((sum, f) => sum + f.predictedDemand, 0) / forecast.length
      ),
      totalDemand: forecast.reduce((sum, f) => sum + f.predictedDemand, 0),
      confidence: forecast.reduce((sum, f) => sum + f.confidence, 0) / forecast.length,
      trend: trend > 0 ? 'increasing' : 'decreasing',
      riskLevel: trend > 0.05 ? 'high' : trend < -0.05 ? 'medium' : 'low'
  }
  };
}

async function getAllForecasts() {
  const products = [
    { id: 'SD-001', name: 'Premium Wireless Headphones' },
    { id: 'SD-002', name: 'Bluetooth Speaker Pro' },
    { id: 'SD-003', name: 'USB-C Cable 6ft' },
    { id: 'SD-004', name: 'Gourmet Coffee Beans' }];

  const forecasts = await Promise.all(products.map(product => getProductForecast(product.id, 30)));

  return {
    forecasts,
    summary: {
    totalProducts: forecasts.length,
      highRiskProducts: forecasts.filter(f => f.summary.riskLevel === 'high').length,
      avgConfidence: forecasts.reduce((sum, f) => sum + f.summary.confidence, 0) / forecasts.length,
      totalPredictedDemand: forecasts.reduce((sum, f) => sum + f.summary.totalDemand, 0)
    }
  };
}

async function generateForecast(productId, historicalData, algorithm) {
  // Mock AI algorithm implementation
  const algorithms = {
    linear_regression: 'Linear Regression',
    exponential_smoothing: 'Exponential Smoothing',
    arima: 'ARIMA Model',
    neural_network: 'Neural Network'};

  return {
    productId,
    algorithm: algorithms[algorithm] || algorithm,
    accuracy: Math.random() * 0.3 + 0.7, // 70-100% accuracy
    forecast: await getProductForecast(productId, 30),
    insights: [
      'Seasonal pattern detected in Q4',
      'Demand increasing by 15% month-over-month',
      'Consider increasing safety stock by 20%',
      'Peak demand expected in 2 weeks']};
}
