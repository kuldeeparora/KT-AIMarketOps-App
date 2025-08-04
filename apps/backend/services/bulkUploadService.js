

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

export default bulkUploadService;

