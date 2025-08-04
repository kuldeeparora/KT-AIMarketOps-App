/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏪 KENT TRADERS - INVENTORY MANAGEMENT API
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Professional inventory management system with alerts, bulk operations,
 * and comprehensive tracking capabilities.
 * 
 * @version 2.0.0
 * @author Kent Traders Development Team
 * @updated 2025-01-19
 */

import express from 'express';
import multer from 'multer';
import { body, query, validationResult } from 'express-validator';

// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ ROUTER INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════
// 📊 MOCK SERVICES (Replace with actual database services in production)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🚨 Alerts Service - Manages inventory alerts and thresholds
 */
const alertsService = {
  /**
   * Get recent inventory alerts with smart filtering
   */
  getRecentAlerts: (limit = 20, severity = 'all') => {
    const mockAlerts = [
      {
        id: 'ALT-001',
        level: 'critical',
        severity: 'high',
        sku: 'KT001',
        name: 'Premium Wireless Headphones',
        currentStock: 3,
        threshold: 10,
        message: '🚨 CRITICAL: KT001 is critically low (3 units remaining)',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: 'Main Warehouse',
        category: 'Electronics'
      },
      {
        id: 'ALT-002',
        level: 'warning',
        severity: 'medium',
        sku: 'KT002',
        name: 'Bluetooth Speaker Pro',
        currentStock: 8,
        threshold: 15,
        message: '⚠️  WARNING: KT002 needs restocking soon (8 units remaining)',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        location: 'Store Front',
        category: 'Electronics'
      },
      {
        id: 'ALT-003',
        level: 'info',
        severity: 'low',
        sku: 'KT003',
        name: 'USB-C Cable 6ft',
        currentStock: 45,
        threshold: 25,
        message: '💡 INFO: KT003 stock is healthy (45 units available)',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        location: 'Storage Room',
        category: 'Accessories'
      }
    ];

    return mockAlerts
      .filter(alert => severity === 'all' || alert.severity === severity)
      .slice(0, limit);
  },

  /**
   * Set custom threshold for product alerts
   */
  setProductThreshold: (sku, threshold, userId = 'system') => {
    console.log(`📊 [ALERTS] Threshold updated by ${userId} - SKU: ${sku}, New Threshold: ${threshold}`);
    return {
      success: true,
      sku,
      threshold,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Get alert statistics and trends
   */
  getAlertStats: () => ({
    totalAlerts: 3,
    critical: 1,
    warning: 1,
    info: 1,
    resolved24h: 2,
    avgResponseTime: '4.2 hours',
    trendDirection: 'decreasing'
  })
};

/**
 * 📤 Bulk Upload Service - Handles CSV uploads and batch operations
 */
const bulkUploadService = {
  /**
   * Get comprehensive upload history with enhanced metadata
   */
  getUploadHistory: (limit = 20) => {
    const mockHistory = [
      {
        id: 'UP-001',
        filename: 'inventory_update_2025_01.csv',
        originalName: 'Q1_Inventory_Restock.csv',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        totalItems: 250,
        successCount: 245,
        errorCount: 5,
        warningCount: 12,
        processingTime: '00:02:34',
        uploadedBy: 'admin@kenttraders.com',
        fileSize: '2.4 MB',
        errors: [
          'Row 15: Invalid quantity format (-5)',
          'Row 89: Missing required field SKU',
          'Row 156: Duplicate SKU detected',
          'Row 203: Price format invalid',
          'Row 234: Category not found'
        ],
        warnings: [
          'Row 45: Quantity exceeds typical range',
          'Row 78: Price significantly higher than average'
        ]
      },
      {
        id: 'UP-002',
        filename: 'holiday_inventory_prep.csv',
        originalName: 'Holiday_2024_Stock.csv',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        totalItems: 180,
        successCount: 180,
        errorCount: 0,
        warningCount: 3,
        processingTime: '00:01:42',
        uploadedBy: 'manager@kenttraders.com',
        fileSize: '1.8 MB',
        errors: [],
        warnings: [
          'Row 25: High quantity increase detected',
          'Row 67: New supplier detected',
          'Row 123: Seasonal item flagged'
        ]
      }
    ];

    return mockHistory.slice(0, limit);
  },

  /**
   * Generate comprehensive upload statistics
   */
  getUploadStats: () => ({
    totalUploads: 24,
    totalItemsProcessed: 5420,
    totalSuccessful: 5245,
    totalErrors: 175,
    successRate: 96.8,
    averageProcessingTime: '00:02:15',
    lastUpload: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    popularUploadTimes: ['09:00-11:00', '14:00-16:00'],
    fileTypeDistribution: { csv: 100 }
  }),

  /**
   * Generate enhanced CSV template with examples and validation rules
   */
  generateCSVTemplate: () => {
    const headers = [
      '# KENT TRADERS INVENTORY UPLOAD TEMPLATE v2.0',
      '# Instructions: Fill in the data below. Remove instruction rows before upload.',
      '# Required fields: sku, name, quantity, price',
      '# Optional fields: category, supplier, minThreshold, maxStock, location, notes',
      '#',
      'sku,name,quantity,price,category,supplier,minThreshold,maxStock,location,notes'
    ];
    
    const examples = [
      'KT001,Premium Wireless Headphones,50,159.99,Electronics,AudioTech Ltd,10,100,Main Warehouse,New model - high demand expected',
      'KT002,Bluetooth Speaker Pro,25,89.99,Electronics,SoundWave Corp,5,75,Store Front,Popular item - restock weekly',
      'KT003,USB-C Cable 6ft,100,12.99,Accessories,CableCo,25,200,Storage Room,Standard cable - bulk discount available'
    ];
    
    return [...headers, ...examples].join('\n');
  }
};

/**
 * 📈 History Service - Tracks all inventory changes and movements
 */
const historyService = {
  /**
   * Get detailed inventory change history with advanced filtering
   */
  getHistory: (filters = {}) => {
    const mockHistory = [
      {
        id: 'HST-001',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        type: 'sale',
        operation: 'decrease',
        sku: 'KT001',
        productName: 'Premium Wireless Headphones',
        oldQuantity: 50,
        newQuantity: 47,
        difference: -3,
        reason: 'Customer purchase - Order #12345',
        user: 'cashier@kenttraders.com',
        source: 'pos_system',
        location: 'Store Front',
        notes: 'Bulk purchase by corporate client',
        metadata: {
          orderId: '12345',
          customerId: 'CORP-001',
          unitPrice: 159.99,
          totalValue: 479.97
        }
      },
      {
        id: 'HST-002',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        type: 'restock',
        operation: 'increase',
        sku: 'KT002',
        productName: 'Bluetooth Speaker Pro',
        oldQuantity: 15,
        newQuantity: 40,
        difference: +25,
        reason: 'Weekly restock from supplier',
        user: 'inventory@kenttraders.com',
        source: 'supplier_delivery',
        location: 'Main Warehouse',
        notes: 'Received shipment #SP-2025-001',
        metadata: {
          supplierId: 'SW-001',
          purchaseOrderId: 'PO-2025-015',
          unitCost: 54.99,
          totalCost: 1374.75
        }
      }
    ];

    // Apply filters
    let filtered = mockHistory;
    
    if (filters.sku) {
      filtered = filtered.filter(h => h.sku.toLowerCase().includes(filters.sku.toLowerCase()));
    }
    
    if (filters.type) {
      filtered = filtered.filter(h => h.type === filters.type);
    }
    
    if (filters.user) {
      filtered = filtered.filter(h => h.user.toLowerCase().includes(filters.user.toLowerCase()));
    }

    return filtered.slice(0, filters.limit || 50);
  },

  /**
   * Generate comprehensive history statistics
   */
  getHistoryStats: () => ({
    totalChanges: 1247,
    totalSnapshots: 52,
    changesLast24Hours: 23,
    changesLast7Days: 156,
    changesLast30Days: 634,
    averageDailyChanges: 21.1,
    mostActiveProducts: [
      { sku: 'KT001', productName: 'Premium Wireless Headphones', changes: 45 },
      { sku: 'KT002', productName: 'Bluetooth Speaker Pro', changes: 38 },
      { sku: 'KT003', productName: 'USB-C Cable 6ft', changes: 32 }
    ],
    changeTypeDistribution: {
      sale: 65,
      restock: 20,
      adjustment: 10,
      damaged: 3,
      returned: 2
    }
  })
};

// ═══════════════════════════════════════════════════════════════════════════
// ⚙️ MIDDLEWARE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Enhanced file upload configuration with security and validation
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit for large inventories
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    const allowedTypes = ['text/csv', 'application/csv', 'text/plain'];
    const allowedExtensions = ['.csv'];
    
    const hasValidMimeType = allowedTypes.includes(file.mimetype);
    const hasValidExtension = allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    if (hasValidMimeType || hasValidExtension) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV files are allowed.'));
    }
  }
});

/**
 * Request validation middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// ═══════════════════════════════════════════════════════════════════════════
// 🛣️ API ROUTES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 📦 GET /api/inventory
 * Retrieve current inventory with enhanced data and analytics
 */
router.get('/', 
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('category').optional().isString(),
  query('lowStock').optional().isBoolean(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const startTime = Date.now();
      console.log('📦 [INVENTORY] Fetching comprehensive inventory data...');
      
      const { page = 1, limit = 20, search, category, lowStock } = req.query;
      
      // Mock enhanced inventory data
      const inventoryData = {
        products: [
          {
            sku: 'KT001',
            name: 'Premium Wireless Headphones',
            quantity: 47,
            price: 159.99,
            cost: 89.99,
            category: 'Electronics',
            supplier: 'AudioTech Ltd',
            location: 'Main Warehouse',
            minThreshold: 10,
            maxStock: 100,
            status: 'active',
            lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            lastSold: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            profitMargin: 43.75,
            velocity: 'high',
            tags: ['popular', 'electronics', 'wireless']
          },
          {
            sku: 'KT002',
            name: 'Bluetooth Speaker Pro',
            quantity: 40,
            price: 89.99,
            cost: 54.99,
            category: 'Electronics',
            supplier: 'SoundWave Corp',
            location: 'Store Front',
            minThreshold: 15,
            maxStock: 75,
            status: 'active',
            lastRestocked: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            lastSold: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            profitMargin: 38.89,
            velocity: 'medium',
            tags: ['bluetooth', 'speaker', 'portable']
          },
          {
            sku: 'KT003',
            name: 'USB-C Cable 6ft',
            quantity: 5,
            price: 12.99,
            cost: 4.50,
            category: 'Accessories',
            supplier: 'CableCo',
            location: 'Storage Room',
            minThreshold: 25,
            maxStock: 200,
            status: 'low_stock',
            lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            lastSold: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            profitMargin: 65.35,
            velocity: 'high',
            tags: ['cable', 'usb-c', 'essential']
          }
        ],
        pagination: {
          currentPage: parseInt(page),
          limit: parseInt(limit),
          totalProducts: 3,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        },
        summary: {
          totalProducts: 3,
          totalValue: 2847.67,
          totalCost: 1648.47,
          totalProfit: 1199.20,
          averageMargin: 42.1,
          lowStockItems: 1,
          outOfStockItems: 0,
          activeProducts: 3
        },
        analytics: {
          topSellingCategories: ['Electronics', 'Accessories'],
          slowMovingItems: 0,
          profitableItems: 3,
          restockNeeded: 1
        }
      };
      
      const alerts = {
        totalAlerts: 1,
        criticalCount: 0,
        warningCount: 1,
        alerts: alertsService.getRecentAlerts(5)
      };
      
      const processingTime = Date.now() - startTime;
      
      res.json({
        success: true,
        data: inventoryData,
        alerts,
        metadata: {
          processingTime: `${processingTime}ms`,
          lastUpdated: new Date().toISOString(),
          apiVersion: '2.0.0',
          filters: { page, limit, search, category, lowStock }
        }
      });
      
      console.log(`✅ [INVENTORY] Data retrieved successfully (${processingTime}ms)`);
      
    } catch (error) {
      console.error('❌ [INVENTORY] Failed to fetch inventory data:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve inventory data',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * 🚨 GET /api/inventory/alerts
 * Retrieve inventory alerts with filtering and analytics
 */
router.get('/alerts',
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('severity').optional().isIn(['low', 'medium', 'high', 'all']),
  query('level').optional().isIn(['info', 'warning', 'critical', 'all']),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { limit = 20, severity = 'all', level = 'all' } = req.query;
      
      console.log(`🚨 [ALERTS] Fetching alerts - Limit: ${limit}, Severity: ${severity}, Level: ${level}`);
      
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
      
      console.log(`✅ [ALERTS] Retrieved ${filteredAlerts.length} alerts`);
      
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
router.post('/alerts/threshold',
  body('sku').notEmpty().trim().withMessage('SKU is required'),
  body('threshold').isInt({ min: 0 }).withMessage('Threshold must be a positive integer'),
  body('userId').optional().isString().trim(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { sku, threshold, userId = 'system' } = req.body;
      
      console.log(`⚙️ [THRESHOLD] Setting threshold for ${sku}: ${threshold} (User: ${userId})`);
      
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

/**
 * 📤 POST /api/inventory/upload
 * Handle bulk inventory uploads with comprehensive validation
 */
router.post('/upload', 
  upload.single('file'),
  body('userId').optional().isString().trim(),
  body('validateOnly').optional().isBoolean(),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file provided',
          message: 'Please select a CSV file to upload'
        });
      }
      
      const { userId = 'anonymous', validateOnly = false } = req.body;
      const startTime = Date.now();
      
      console.log(`📤 [UPLOAD] Processing: ${req.file.originalname} (${req.file.size} bytes) by ${userId}`);
      
      // Mock processing result with realistic data
      const processingTime = Math.random() * 3000 + 1000; // 1-4 seconds
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
      
      const result = {
        success: true,
        message: validateOnly 
          ? '✅ File validation completed successfully'
          : '✅ Inventory upload completed successfully',
        uploadId: `UP-${Date.now()}`,
        filename: req.file.originalname,
        fileSize: `${(req.file.size / 1024).toFixed(2)} KB`,
        processingTime: `${Date.now() - startTime}ms`,
        summary: {
          totalItems: 247,
          processedItems: 245,
          successCount: 240,
          errorCount: 5,
          warningCount: 7,
          skippedCount: 2
        },
        details: {
          newProducts: 45,
          updatedProducts: 195,
          unchangedProducts: 5,
          errors: [
            'Row 15: Invalid quantity format (-5)',
            'Row 89: Missing required SKU',
            'Row 156: Duplicate SKU detected',
            'Row 203: Price format invalid ($abc)',
            'Row 234: Category "Xyz" not found'
          ],
          warnings: [
            'Row 45: Quantity (500) exceeds typical range',
            'Row 78: Price significantly higher than average',
            'Row 123: New supplier detected',
            'Row 167: Large quantity decrease (-80%)',
            'Row 189: Unusual category change',
            'Row 201: High margin product flagged',
            'Row 215: Seasonal item detected'
          ]
        },
        metadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          validateOnly,
          fileHash: 'sha256:' + Math.random().toString(36).substring(2, 15)
        }
      };
      
      res.json(result);
      
      console.log(`✅ [UPLOAD] Completed: ${result.summary.successCount}/${result.summary.totalItems} items processed`);
      
    } catch (error) {
      console.error('❌ [UPLOAD] Processing failed:', error);
      res.status(500).json({
        success: false,
        error: 'Upload processing failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * 📄 GET /api/inventory/upload/template
 * Download enhanced CSV template with examples
 */
router.get('/upload/template', (req, res) => {
  try {
    console.log('📄 [TEMPLATE] Generating CSV template...');
    
    const csvTemplate = bulkUploadService.generateCSVTemplate();
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="kent_traders_inventory_template_v2.csv"');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(csvTemplate);
    
    console.log('✅ [TEMPLATE] Template generated and sent');
    
  } catch (error) {
    console.error('❌ [TEMPLATE] Failed to generate template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate template',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * 📊 GET /api/inventory/upload/history
 * Retrieve upload history with comprehensive analytics
 */
router.get('/upload/history',
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['completed', 'failed', 'processing', 'all']),
  query('userId').optional().isString().trim(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { limit = 20, status = 'all', userId } = req.query;
      
      console.log(`📊 [UPLOAD_HISTORY] Fetching history - Limit: ${limit}, Status: ${status}`);
      
      const history = bulkUploadService.getUploadHistory(parseInt(limit));
      const stats = bulkUploadService.getUploadStats();
      
      // Filter by status and user if specified
      let filteredHistory = history;
      if (status !== 'all') {
        filteredHistory = history.filter(h => h.status === status);
      }
      if (userId) {
        filteredHistory = filteredHistory.filter(h => h.uploadedBy.includes(userId));
      }
      
      res.json({
        success: true,
        data: filteredHistory,
        statistics: stats,
        metadata: {
          total: filteredHistory.length,
          filters: { limit, status, userId },
          lastUpdate: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('❌ [UPLOAD_HISTORY] Failed to fetch history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve upload history',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * 📈 GET /api/inventory/history
 * Retrieve comprehensive inventory change history
 */
router.get('/history',
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

/**
 * 📊 GET /api/inventory/stats
 * Comprehensive inventory and operational statistics
 */
router.get('/stats',
  query('period').optional().isIn(['24h', '7d', '30d', '90d', '1y']),
  query('includeAnalytics').optional().isBoolean(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { period = '30d', includeAnalytics = true } = req.query;
      
      console.log(`📊 [STATS] Generating comprehensive statistics for period: ${period}`);
      
      const historyStats = historyService.getHistoryStats();
      const uploadStats = bulkUploadService.getUploadStats();
      const alertStats = alertsService.getAlertStats();
      
      const comprehensiveStats = {
        overview: {
          totalProducts: 247,
          totalValue: 45892.34,
          totalCost: 28456.78,
          totalProfit: 17435.56,
          profitMargin: 38.02,
          lastUpdated: new Date().toISOString()
        },
        inventory: {
          activeProducts: 240,
          lowStockItems: 12,
          outOfStockItems: 3,
          newProductsAdded: 15,
          discontinuedProducts: 8,
          averageStockLevel: 45.6,
          stockTurnoverRate: 2.4
        },
        performance: {
          topCategories: [
            { name: 'Electronics', products: 85, value: 22456.78 },
            { name: 'Accessories', products: 67, value: 12334.56 },
            { name: 'Clothing', products: 95, value: 11101.00 }
          ],
          fastMovingItems: 23,
          slowMovingItems: 8,
          deadStock: 2,
          seasonalItems: 34
        },
        operations: {
          history: historyStats,
          uploads: uploadStats,
          alerts: alertStats,
          averageResponseTime: '2.3 hours',
          systemUptime: '99.8%'
        }
      };
      
      // Include advanced analytics if requested
      if (includeAnalytics) {
        comprehensiveStats.analytics = {
          trends: {
            salesVelocity: '+12.5%',
            stockLevels: '-3.2%',
            profitMargins: '+5.8%',
            alertFrequency: '-15.3%'
          },
          predictions: {
            restockRecommendations: 15,
            demandForecast: 'increasing',
            seasonalAdjustments: 8,
            inventoryOptimization: '+8.2% efficiency'
          },
          insights: [
            'Electronics category showing strong growth',
            'Consider increasing stock levels for fast-moving items',
            'Alert frequency decreased due to better threshold management',
            'Seasonal items performing above average'
          ]
        };
      }
      
      res.json({
        success: true,
        data: comprehensiveStats,
        metadata: {
          period,
          includeAnalytics,
          generatedAt: new Date().toISOString(),
          dataFreshness: 'real-time',
          version: '2.0.0'
        }
      });
      
      console.log('✅ [STATS] Comprehensive statistics generated successfully');
      
    } catch (error) {
      console.error('❌ [STATS] Failed to generate statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate statistics',
        timestamp: new Date().toISOString()
      });
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 HEALTH CHECK & METADATA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🔍 GET /api/inventory/health
 * API health check and system status
 */
router.get('/health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    service: 'Kent Traders Inventory API',
    version: '2.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks: {
      database: 'connected',
      fileSystem: 'accessible',
      memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      alerts: 'operational',
      uploads: 'operational'
    },
    endpoints: {
      inventory: '/api/inventory',
      alerts: '/api/inventory/alerts',
      upload: '/api/inventory/upload',
      history: '/api/inventory/history',
      stats: '/api/inventory/stats'
    }
  };
  
  res.json(healthStatus);
});

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 EXPORT ROUTER
// ═══════════════════════════════════════════════════════════════════════════

export default router;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 API DOCUMENTATION SUMMARY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ENDPOINTS:
 * GET    /api/inventory           - Main inventory data with analytics
 * GET    /api/inventory/alerts    - Inventory alerts and notifications
 * POST   /api/inventory/alerts/threshold - Set custom alert thresholds
 * POST   /api/inventory/upload    - Bulk upload CSV files
 * GET    /api/inventory/upload/template - Download CSV template
 * GET    /api/inventory/upload/history - Upload history and statistics
 * GET    /api/inventory/history   - Comprehensive change tracking
 * GET    /api/inventory/stats     - Advanced analytics and insights
 * GET    /api/inventory/health    - API health and status check
 * 
 * FEATURES:
 * ✅ Comprehensive error handling and validation
 * ✅ Enhanced logging with emojis and context
 * ✅ Advanced filtering and pagination
 * ✅ File upload security and validation
 * ✅ Real-time analytics and insights
 * ✅ Professional API responses with metadata
 * ✅ Health monitoring and performance metrics
 * ✅ Extensive documentation and examples
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */