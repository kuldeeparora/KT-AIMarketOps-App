const express = require('express');
const router = express.Router();

// Analytics endpoints
router.get('/dashboard', async (req, res) => {
  try {
    // Mock analytics data - replace with real implementation
    const analytics = {
      sales: {
        today: 1250.50,
        week: 8750.25,
        month: 32500.75,
        trend: 12.5
      },
      orders: {
        today: 15,
        week: 98,
        month: 425,
        trend: 8.3
      },
      customers: {
        new: 8,
        returning: 7,
        total: 1250,
        trend: 15.2
      },
      products: {
        total: 450,
        lowStock: 12,
        outOfStock: 3,
        trending: ['Product A', 'Product B', 'Product C']
      }
    };

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/sales', async (req, res) => {
  try {
    const { period = '30d', groupBy = 'day' } = req.query;
    
    // Mock sales data
    const salesData = {
      period,
      groupBy,
      data: [
        { date: '2025-01-01', sales: 1250.50, orders: 15 },
        { date: '2025-01-02', sales: 1350.25, orders: 18 },
        { date: '2025-01-03', sales: 1100.75, orders: 12 },
        // Add more data points
      ],
      summary: {
        totalSales: 32500.75,
        totalOrders: 425,
        averageOrderValue: 76.47,
        growthRate: 12.5
      }
    };

    res.json({
      success: true,
      data: salesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const revenueData = {
      period: { startDate, endDate },
      revenue: {
        gross: 32500.75,
        net: 29250.68,
        refunds: 1250.07,
        tax: 3250.00
      },
      breakdown: {
        byProduct: [
          { product: 'Product A', revenue: 8500.25, percentage: 26.2 },
          { product: 'Product B', revenue: 7200.50, percentage: 22.1 },
          { product: 'Product C', revenue: 6800.00, percentage: 20.9 }
        ],
        byChannel: [
          { channel: 'Online Store', revenue: 19500.45, percentage: 60.0 },
          { channel: 'Mobile App', revenue: 9750.23, percentage: 30.0 },
          { channel: 'Social Media', revenue: 3250.07, percentage: 10.0 }
        ]
      }
    };

    res.json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/customers', async (req, res) => {
  try {
    const customerAnalytics = {
      total: 1250,
      new: 125,
      returning: 1125,
      segments: [
        { segment: 'VIP', count: 50, revenue: 15000.00 },
        { segment: 'Regular', count: 800, revenue: 12000.00 },
        { segment: 'Occasional', count: 400, revenue: 5500.75 }
      ],
      lifetimeValue: {
        average: 26.00,
        bySegment: {
          VIP: 300.00,
          Regular: 15.00,
          Occasional: 13.75
        }
      },
      retention: {
        rate: 85.5,
        byMonth: [
          { month: 'Jan', rate: 87.2 },
          { month: 'Feb', rate: 85.8 },
          { month: 'Mar', rate: 84.1 }
        ]
      }
    };

    res.json({
      success: true,
      data: customerAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/products', async (req, res) => {
  try {
    const productAnalytics = {
      total: 450,
      active: 425,
      inactive: 25,
      performance: [
        { product: 'Product A', sales: 150, revenue: 8500.25, rank: 1 },
        { product: 'Product B', sales: 120, revenue: 7200.50, rank: 2 },
        { product: 'Product C', sales: 95, revenue: 6800.00, rank: 3 }
      ],
      inventory: {
        lowStock: 12,
        outOfStock: 3,
        overstocked: 8,
        totalValue: 45000.00
      },
      categories: [
        { category: 'Electronics', products: 150, revenue: 15000.00 },
        { category: 'Clothing', products: 200, revenue: 12000.00 },
        { category: 'Home & Garden', products: 100, revenue: 5500.75 }
      ]
    };

    res.json({
      success: true,
      data: productAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 