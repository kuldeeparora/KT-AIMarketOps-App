const express = require('express');
const router = express.Router();
const path = require('path');

// Import API modules
const analyticsRoutes = require('./analytics');
const inventoryRoutes = require('./inventory');
const ordersRoutes = require('./orders');
const customersRoutes = require('./customers');
const productsRoutes = require('./products');
const settingsRoutes = require('./settings');
const notificationsRoutes = require('./notifications');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API versioning
router.use('/v1', (req, res, next) => {
  req.apiVersion = 'v1';
  next();
});

// Mount API routes
router.use('/v1/analytics', analyticsRoutes);
router.use('/v1/inventory', inventoryRoutes);
router.use('/v1/orders', ordersRoutes);
router.use('/v1/customers', customersRoutes);
router.use('/v1/products', productsRoutes);
router.use('/v1/settings', settingsRoutes);
router.use('/v1/notifications', notificationsRoutes);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR'
    }
  });
});

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'API endpoint not found',
      code: 'ENDPOINT_NOT_FOUND',
      path: req.originalUrl
    }
  });
});

module.exports = router; 