import { saveToCache, loadFromCache } from '../../../lib/sellerdynamics-storage.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status,(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const updateData = req.body;

    // Validate required fields
    if (!updateData.id || !updateData.sku) {
      return res.status(400).json({
        success: false,
        error: 'Product ID and SKU are required'
      });
  }

    // Load current cached data
    const cachedData = loadFromCache();
    if (!cachedData || !cachedData.data || !cachedData.data.productGrid) {
      return res.status(404).json({
        success: false,
        error: 'No cached SellerDynamics data found'
      });
  }

    // Find the product to update
    const productIndex = cachedData.data.productGrid.Goods.findIndex(
      p => p.GoodID === updateData.id || p.SKU === updateData.sku
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found in cached data'
      });
  }

    // Update the product with new data
    const updatedProduct = {
      ...cachedData.data.productGrid.Goods[productIndex],
      ItemTitle:
        updateData.productName || cachedData.data.productGrid.Goods[productIndex].ItemTitle,
      SKU: updateData.sku || cachedData.data.productGrid.Goods[productIndex].SKU,
      EANBarCode:
        updateData.metadata?.barcode || cachedData.data.productGrid.Goods[productIndex].EANBarCode,
      Stock: updateData.currentStock || cachedData.data.productGrid.Goods[productIndex].Stock,
      FBAStock: updateData.fbaStock || cachedData.data.productGrid.Goods[productIndex].FBAStock,
      SupplierStock:
        updateData.supplierStock || cachedData.data.productGrid.Goods[productIndex].SupplierStock,
      ConditionID:
        updateData.conditionId || cachedData.data.productGrid.Goods[productIndex].ConditionID,
      KitProduct:
        updateData.kitProduct || cachedData.data.productGrid.Goods[productIndex].KitProduct,
      ParentSKU: updateData.parentSku || cachedData.data.productGrid.Goods[productIndex].ParentSKU,
      AssignedLocation:
        updateData.assignedLocation ||
        cachedData.data.productGrid.Goods[productIndex].AssignedLocation,
      Location: updateData.location || cachedData.data.productGrid.Goods[productIndex].Location,
      Flag: updateData.flag || cachedData.data.productGrid.Goods[productIndex].Flag,
      Marketplaces:
        updateData.marketplaces || cachedData.data.productGrid.Goods[productIndex].Marketplaces,
      Suppliers: updateData.suppliers || cachedData.data.productGrid.Goods[productIndex].Suppliers,
      HasErrors: updateData.hasErrors || cachedData.data.productGrid.Goods[productIndex].HasErrors,
      HasWarnings:
        updateData.hasWarnings || cachedData.data.productGrid.Goods[productIndex].HasWarnings
    };

    // Update the product in the cached data
    cachedData.data.productGrid.Goods[productIndex] = updatedProduct;

    // Save updated data back to cache
    const saveSuccess = saveToCache(cachedData.data, {
      ...cachedData.metadata,
      lastUpdated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      modifiedBy: 'admin-dashboard',
      updateType: 'product_update'
    });

    if (!saveSuccess) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save updated data to cache'
      });
  }

    // Return success response with updated product
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: updatedProduct,
        cacheUpdated: true,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[SellerDynamics Update] Error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to update product',
      details: error.message
    });
  }
}
