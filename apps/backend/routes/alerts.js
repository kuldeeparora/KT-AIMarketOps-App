
import express from 'express';
import { body, query } from 'express-validator';
import alertsService from '../services/alertsService.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

/**
 * 🚨 GET /api/inventory/alerts
 * Retrieve inventory alerts with filtering and analytics
 */
router.get('/',
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('severity').optional().isIn(['low', 'medium', 'high', 'all']),
  query('level').optional().isIn(['info', 'warning', 'critical', 'all']),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { limit = 20, severity = 'all', level = 'all' } = req.query;
      
      const alerts = alertsService.getRecentAlerts(parseInt(limit), severity);
      const stats = alertsService.getAlertStats();
      
      // Filter by level if specified
      const filteredAlerts = level === 'all' 
        ? alerts 
        : alerts.filter(alert => alert.level === level);
      
      res.json({
        success: true,
        data: filteredAlerts,
        statistics: stats,
        metadata: {
          total: filteredAlerts.length,
          filters: { limit, severity, level },
          lastGenerated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ [ALERTS] Failed to fetch alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve alerts',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * ⚙️ POST /api/inventory/alerts/threshold
 * Set custom alert threshold for products
 */
router.post('/threshold',
  body('sku').notEmpty().trim().withMessage('SKU is required'),
  body('threshold').isInt({ min: 0 }).withMessage('Threshold must be a positive integer'),
  body('userId').optional().isString().trim(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { sku, threshold, userId = 'system' } = req.body;
      
      const result = alertsService.setProductThreshold(sku, parseInt(threshold), userId);
      
      res.json({
        success: true,
        message: `✅ Threshold successfully updated for ${sku}`,
        data: result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ [THRESHOLD] Failed to set threshold:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update threshold',
        timestamp: new Date().toISOString()
      });
    }
  }
);

export default router;
