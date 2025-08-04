// admin-dashboard/pages/api/ai/dashboard.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate mock metrics for AI dashboard
    const metrics = {
      aiConfidence: {
        name: 'AI Confidence',
        value: 98.5,
        previousValue: 97.2,
      },
      predictionsAccuracy: {
        name: 'Predictions Accuracy',
        value: 94.2,
        previousValue: 92.8,
        unit: '%',
      },
      automatedActions: {
        name: 'Automated Actions Today',
        value: 156,
        previousValue: 104,
      },
      costSavings: {
        name: 'Cost Savings',
        value: 4250,
        previousValue: 3890,
        unit: '$',
      },
      responseTime: {
        name: 'Avg Response Time',
        value: 185,
        previousValue: 210,
        unit: 'ms',
        target: 200,
      },
    };

    // Generate chart data
    const charts = {
      performance: generatePerformanceData(),
      modelUsage: generateModelUsageData(),
      costBreakdown: generateCostBreakdown(),
    };

    // Get recent insights
    const recentInsights = await generateInsights();

    res.status(200).json({
      metrics,
      charts,
      recentInsights,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
}

function generatePerformanceData() {
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'];
  return hours.map((time, index) => ({
    time,
    accuracy: 92 + Math.random() * 3,
    latency: 220 - index * 8 + Math.random() * 10,
  }));
}

function generateModelUsageData() {
  return [
    { name: 'GPT-4', value: 45, color: '#1976d2' },
    { name: 'Claude-3', value: 30, color: '#dc004e' },
    { name: 'Mixtral', value: 15, color: '#ff9800' },
    { name: 'Local Models', value: 10, color: '#2196f3' },
  ];
}

function generateCostBreakdown() {
  return [
    { category: 'API Calls', amount: 1250, percentage: 45 },
    { category: 'Compute', amount: 890, percentage: 32 },
    { category: 'Storage', amount: 420, percentage: 15 },
    { category: 'Network', amount: 230, percentage: 8 },
  ];
}

async function generateInsights(): Promise<any[]> {
  return [
    {
      id: 1,
      type: 'optimization',
      title: 'Inventory Optimization Opportunity',
      description: 'AI detected 15 products with low stock that need reordering',
      confidence: 94,
      action: 'Review and approve reorder suggestions',
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'prediction',
      title: 'Sales Forecast Update',
      description: 'Predicted 12% increase in sales for next quarter',
      confidence: 87,
      action: 'Adjust inventory levels accordingly',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      type: 'anomaly',
      title: 'Unusual Customer Behavior Detected',
      description: 'Spike in orders from new customer segment',
      confidence: 92,
      action: 'Investigate and prepare for increased demand',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}