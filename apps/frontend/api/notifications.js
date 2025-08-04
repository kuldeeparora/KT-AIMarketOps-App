const express = require('express');
const router = express.Router();

// Notifications endpoints
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, read } = req.query;
    
    const notifications = [
      {
        id: 1,
        type: 'order',
        title: 'New Order Received',
        message: 'Order #ORD-001 has been placed by John Doe',
        data: {
          orderId: 'ORD-001',
          customer: 'John Doe',
          total: 125.50
        },
        read: false,
        timestamp: '2025-01-15T10:30:00Z'
      },
      {
        id: 2,
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'Product B is running low: 5 remaining',
        data: {
          productId: 2,
          productName: 'Product B',
          sku: 'PROD-002',
          quantity: 5
        },
        read: false,
        timestamp: '2025-01-15T09:15:00Z'
      },
      {
        id: 3,
        type: 'customer',
        title: 'New Customer Registration',
        message: 'Jane Smith has registered for an account',
        data: {
          customerId: 2,
          customerName: 'Jane Smith',
          email: 'jane@example.com'
        },
        read: true,
        timestamp: '2025-01-15T08:45:00Z'
      }
    ];

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 25,
          pages: Math.ceil(25 / parseInt(limit))
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

router.get('/unread', async (req, res) => {
  try {
    const unreadCount = 2;
    
    res.json({
      success: true,
      data: {
        count: unreadCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock mark as read operation
    console.log('Marking notification as read:', id);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/read-all', async (req, res) => {
  try {
    // Mock mark all as read operation
    console.log('Marking all notifications as read');

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 