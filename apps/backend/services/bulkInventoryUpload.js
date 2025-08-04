import { parseCSV } from '../utils/csvUtils.js';
import { validateInventoryData } from '../utils/validationUtils.js';

/**
 * Bulk Inventory Upload Service
 * Handles CSV uploads and bulk updates to SellerDynamics
 */
class BulkInventoryUploadService {
  constructor(sellerDynamicsService) {
    this.sellerDynamicsService = sellerDynamicsService;
    this.uploadHistory = [];
  }

  /**
   * Process CSV file and upload to SellerDynamics
   */
  async processCSVUpload(fileBuffer, filename) {
    try {
      console.log('📤 [Bulk Upload] Processing CSV file:', filename);
      // Parse CSV data using shared utility
      const inventoryData = await parseCSV(fileBuffer, this.normalizeCSVData);
      // Validate data using shared utility
      const validation = validateInventoryData(inventoryData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      // Upload to SellerDynamics
      const uploadResult = await this.uploadToSellerDynamics(inventoryData);
      // Log upload history
      this.logUploadHistory({
        filename,
        timestamp: new Date().toISOString(),
        totalItems: inventoryData.length,
        successCount: uploadResult.successCount,
        errorCount: uploadResult.errorCount,
        errors: uploadResult.errors
      });
      return {
        success: true,
        message: `Successfully uploaded ${uploadResult.successCount} items`,
        totalItems: inventoryData.length,
        successCount: uploadResult.successCount,
        errorCount: uploadResult.errorCount,
        errors: uploadResult.errors
      };
    } catch (error) {
      console.error('❌ [Bulk Upload] Upload failed:', error.message);
      return {
        success: false,
        message: error.message,
        totalItems: 0,
        successCount: 0,
        errorCount: 0,
        errors: [error.message]
      };
    }
  }

  /**
   * Parse CSV buffer to inventory data
   */
  // parseCSV now handled by csvUtils

  /**
   * Normalize CSV data to standard format
   */
  normalizeCSVData(data) {
    return {
      sku: data.sku || data.SKU || data.Sku || '',
      name: data.name || data.Name || data.title || data.Title || '',
      quantity: parseInt(data.quantity || data.Quantity || data.stock || data.Stock || '0'),
      price: parseFloat(data.price || data.Price || data.cost || data.Cost || '0'),
      category: data.category || data.Category || data.type || data.Type || 'Uncategorized',
      supplier: data.supplier || data.Supplier || data.vendor || data.Vendor || 'Unknown',
      minThreshold: parseInt(data.minThreshold || data['min_threshold'] || data['Min Threshold'] || '10'),
      maxStock: parseInt(data.maxStock || data['max_stock'] || data['Max Stock'] || '100'),
      location: data.location || data.Location || data.warehouse || data.Warehouse || 'Main',
      notes: data.notes || data.Notes || data.description || data.Description || ''
    };
  }

  /**
   * Validate inventory data
   */
  // validateInventoryData now handled by validationUtils

  /**
   * Upload inventory data to SellerDynamics
   */
  async uploadToSellerDynamics(inventoryData) {
    const results = {
      successCount: 0,
      errorCount: 0,
      errors: []
    };

    console.log(`📤 [Bulk Upload] Uploading ${inventoryData.length} items to SellerDynamics`);

    // Process in batches of 50 to avoid overwhelming the API
    const batchSize = 50;
    for (let i = 0; i < inventoryData.length; i += batchSize) {
      const batch = inventoryData.slice(i, i + batchSize);
      
      try {
        // Upload batch to SellerDynamics
        const batchResult = await this.uploadBatch(batch);
        
        results.successCount += batchResult.successCount;
        results.errorCount += batchResult.errorCount;
        results.errors.push(...batchResult.errors);
        
        console.log(`📊 [Bulk Upload] Batch ${Math.floor(i / batchSize) + 1}: ${batchResult.successCount} success, ${batchResult.errorCount} errors`);
        
        // Small delay between batches
        if (i + batchSize < inventoryData.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`❌ [Bulk Upload] Batch ${Math.floor(i / batchSize) + 1} failed:`, error.message);
        results.errorCount += batch.length;
        results.errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Upload a batch of inventory items
   */
  async uploadBatch(batch) {
    const results = {
      successCount: 0,
      errorCount: 0,
      errors: []
    };

    for (const item of batch) {
      try {
        // Upload individual item to SellerDynamics
        await this.sellerDynamicsService.uploadInventory('main', [item]);
        results.successCount++;
      } catch (error) {
        results.errorCount++;
        results.errors.push(`${item.sku}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Log upload history
   */
  logUploadHistory(record) {
    this.uploadHistory.push(record);
    
    // Keep only last 50 uploads
    if (this.uploadHistory.length > 50) {
      this.uploadHistory = this.uploadHistory.slice(-50);
    }
    
    console.log(`📝 [Bulk Upload] Logged upload: ${record.filename} - ${record.successCount}/${record.totalItems} items`);
  }

  /**
   * Get upload history
   */
  getUploadHistory(limit = 20) {
    return this.uploadHistory.slice(-limit);
  }

  /**
   * Generate CSV template for download
   */
  generateCSVTemplate() {
    const headers = [
      'sku',
      'name', 
      'quantity',
      'price',
      'category',
      'supplier',
      'minThreshold',
      'maxStock',
      'location',
      'notes'
    ];
    
    const sampleData = [
      'KT001',
      'Sample Product',
      '50',
      '29.99',
      'Electronics',
      'Supplier A',
      '10',
      '100',
      'Main Warehouse',
      'Sample product for testing'
    ];
    
    return [headers, sampleData].map(row => row.join(',')).join('\n');
  }

  /**
   * Get upload statistics
   */
  getUploadStats() {
    const totalUploads = this.uploadHistory.length;
    const totalItems = this.uploadHistory.reduce((sum, record) => sum + record.totalItems, 0);
    const totalSuccess = this.uploadHistory.reduce((sum, record) => sum + record.successCount, 0);
    const totalErrors = this.uploadHistory.reduce((sum, record) => sum + record.errorCount, 0);
    
    return {
      totalUploads,
      totalItems,
      totalSuccess,
      totalErrors,
      successRate: totalItems > 0 ? ((totalSuccess / totalItems) * 100).toFixed(2) : 0
    };
  }
}

export default BulkInventoryUploadService; 