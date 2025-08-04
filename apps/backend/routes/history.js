
import express from 'express';
import { query } from 'express-validator';
import historyService from '../services/historyService.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

/**
 * 📈 GET /api/inventory/history
 * Retrieve comprehensive inventory change history
 */
router.get('/',
  query('sku').optional().isString().trim(),
  query('type').optional().isIn(['sale', 'restock', 'adjustment', 'damaged', 'returned']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('user').optional().isString().trim(),
  query('limit').optional().isInt({ min: 1, max: 200 }),
  query('page').optional().isInt({ min: 1 }),
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        sku,
        type,
        startDate,
        endDate,
        user,
        limit = 50,
        page = 1
      } = req.query;
      
      console.log(`📈 [HISTORY] Fetching change history with filters:`, {
        sku, type, startDate, endDate, user, limit, page
      });
      
      const filters = {
        sku, type, startDate, endDate, user,
        limit: parseInt(limit),
        page: parseInt(page)
      };
      
      const history = historyService.getHistory(filters);
      const stats = historyService.getHistoryStats();
      
      res.json({
        success: true,
        data: history,
        statistics: stats,
        pagination: {
          currentPage: parseInt(page),
          limit: parseInt(limit),
          totalRecords: history.length,
          totalPages: Math.ceil(history.length / parseInt(limit))
        },
        metadata: {
          filters,
          generatedAt: new Date().toISOString(),
          queryPerformance: 'optimized'
        }
      });
      
    } catch (error) {
      console.error('❌ [HISTORY] Failed to fetch history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve inventory history',
        timestamp: new Date().toISOString()
      });
    }
  }
);

export default router;
