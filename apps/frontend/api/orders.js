const express = require('express');
const router = express.Router();

// Orders endpoints
router.get('/dashboard', async (req, res) => {
  try {
    const ordersData = {
      today: 15,
      week: 98,
      month: 425,
      pending: 8,
      processing: 12,
      shipped: 85,
      delivered: 320,
      revenue: {
        today: 1250.50,
        week: 8750.25,
        month: 32500.75
      },
      averageOrderValue: 76.47
    };

    res.json({
      success: true,
      data: ordersData,
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
    const { page = 1, limit = 20, status, customer } = req.query;
    
    const orders = [
      {
        id: 'ORD-001',
        customer: 'John Doe',
        email: 'john@example.com',
        total: 125.50,
        status: 'pending',
        date: '2025-01-15T10:30:00Z',
        items: 3
      },
      {
        id: 'ORD-002',
        customer: 'Jane Smith',
        email: 'jane@example.com',
        total: 89.99,
        status: 'shipped',
        date: '2025-01-14T15:45:00Z',
        items: 2
      }
    ];

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 425,
          pages: Math.ceil(425 / parseInt(limit))
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
    
    const order = {
      id: id,
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      },
      shipping: {
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'US'
      },
      billing: {
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'US'
      },
      items: [
        {
          id: 1,
          name: 'Product A',
          sku: 'PROD-001',
          quantity: 2,
          price: 29.99,
          total: 59.98
        },
        {
          id: 2,
          name: 'Product B',
          sku: 'PROD-002',
          quantity: 1,
          price: 49.99,
          total: 49.99
        }
      ],
      totals: {
        subtotal: 109.97,
        tax: 8.80,
        shipping: 6.99,
        total: 125.76
      },
      status: 'pending',
      date: '2025-01-15T10:30:00Z',
      notes: 'Customer requested expedited shipping'
    };

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 