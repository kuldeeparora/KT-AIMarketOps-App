const express = require('express');
const router = express.Router();

// Inventory endpoints
router.get('/dashboard', async (req, res) => {
  try {
    const inventoryData = {
      total: 1250,
      lowStock: 12,
      outOfStock: 3,
      overstocked: 8,
      totalValue: 45000.00,
      categories: [
        { category: 'Electronics', count: 150, value: 15000.00 },
        { category: 'Clothing', count: 200, value: 12000.00 },
        { category: 'Home & Garden', count: 100, value: 5500.75 }
      ],
      alerts: [
        { type: 'low_stock', count: 8, severity: 'medium' },
        { type: 'out_of_stock', count: 3, severity: 'high' },
        { type: 'overstocked', count: 5, severity: 'low' }
      ]
    };

    res.json({
      success: true,
      data: inventoryData,
      timestamp: new Date().toISOString()
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
    const { page = 1, limit = 20, category, search } = req.query;
    
    const products = [
      {
        id: 1,
        name: 'Product A',
        sku: 'PROD-001',
        quantity: 25,
        price: 29.99,
        category: 'Electronics',
        status: 'active',
        lastUpdated: '2025-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'Product B',
        sku: 'PROD-002',
        quantity: 5,
        price: 49.99,
        category: 'Clothing',
        status: 'low_stock',
        lastUpdated: '2025-01-15T09:15:00Z'
      }
    ];

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 450,
          pages: Math.ceil(450 / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const { type, severity, limit = 50 } = req.query;
    
    const alerts = [
      {
        id: 1,
        type: 'low_stock',
        severity: 'medium',
        product: 'Product B',
        sku: 'PROD-002',
        quantity: 5,
        message: 'Product B is running low: 5 remaining',
        timestamp: '2025-01-15T09:15:00Z'
      },
      {
        id: 2,
        type: 'out_of_stock',
        severity: 'high',
        product: 'Product C',
        sku: 'PROD-003',
        quantity: 0,
        message: 'Product C is out of stock',
        timestamp: '2025-01-15T08:45:00Z'
      }
    ];

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 