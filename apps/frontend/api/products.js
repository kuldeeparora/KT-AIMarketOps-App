const express = require('express');
const router = express.Router();

// Products endpoints
router.get('/dashboard', async (req, res) => {
  try {
    const productsData = {
      total: 450,
      active: 425,
      inactive: 25,
      categories: [
        { category: 'Electronics', count: 150, revenue: 15000.00 },
        { category: 'Clothing', count: 200, revenue: 12000.00 },
        { category: 'Home & Garden', count: 100, revenue: 5500.75 }
      ],
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
      }
    };

    res.json({
      success: true,
      data: productsData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/list', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, status, search } = req.query;
    
    const products = [
      {
        id: 1,
        name: 'Product A',
        sku: 'PROD-001',
        category: 'Electronics',
        price: 29.99,
        quantity: 25,
        status: 'active',
        revenue: 8500.25,
        sales: 150
      },
      {
        id: 2,
        name: 'Product B',
        sku: 'PROD-002',
        category: 'Clothing',
        price: 49.99,
        quantity: 5,
        status: 'low_stock',
        revenue: 7200.50,
        sales: 120
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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = {
      id: parseInt(id),
      name: 'Product A',
      sku: 'PROD-001',
      description: 'High-quality electronic product with advanced features.',
      category: 'Electronics',
      price: 29.99,
      comparePrice: 39.99,
      cost: 15.00,
      quantity: 25,
      weight: 0.5,
      dimensions: {
        length: 10,
        width: 5,
        height: 2
      },
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ],
      variants: [
        {
          id: 1,
          name: 'Small',
          sku: 'PROD-001-S',
          price: 24.99,
          quantity: 10
        },
        {
          id: 2,
          name: 'Large',
          sku: 'PROD-001-L',
          price: 34.99,
          quantity: 15
        }
      ],
      tags: ['electronics', 'featured', 'bestseller'],
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
      stats: {
        totalSales: 150,
        totalRevenue: 8500.25,
        averageRating: 4.5,
        reviewCount: 25
      }
    };

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 