const express = require('express');
const router = express.Router();

// Customers endpoints
router.get('/dashboard', async (req, res) => {
  try {
    const customersData = {
      total: 1250,
      new: 125,
      returning: 1125,
      active: 980,
      inactive: 270,
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
      }
    };

    res.json({
      success: true,
      data: customersData,
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
    const { page = 1, limit = 20, segment, search } = req.query;
    
    const customers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        segment: 'VIP',
        totalOrders: 15,
        totalSpent: 1250.50,
        lastOrder: '2025-01-15T10:30:00Z',
        status: 'active'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        segment: 'Regular',
        totalOrders: 8,
        totalSpent: 450.25,
        lastOrder: '2025-01-10T14:20:00Z',
        status: 'active'
      }
    ];

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 1250,
          pages: Math.ceil(1250 / parseInt(limit))
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
    
    const customer = {
      id: parseInt(id),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      segment: 'VIP',
      status: 'active',
      joined: '2023-01-15T10:30:00Z',
      addresses: [
        {
          type: 'shipping',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          country: 'US'
        },
        {
          type: 'billing',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          country: 'US'
        }
      ],
      preferences: {
        newsletter: true,
        marketing: false,
        notifications: true
      },
      stats: {
        totalOrders: 15,
        totalSpent: 1250.50,
        averageOrderValue: 83.37,
        lastOrder: '2025-01-15T10:30:00Z'
      },
      recentOrders: [
        {
          id: 'ORD-001',
          date: '2025-01-15T10:30:00Z',
          total: 125.50,
          status: 'pending'
        },
        {
          id: 'ORD-002',
          date: '2025-01-10T14:20:00Z',
          total: 89.99,
          status: 'delivered'
        }
      ]
    };

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 