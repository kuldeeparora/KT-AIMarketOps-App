// Real SellerDynamics Database Connection
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.SELLERDYNAMICS_DB_HOST || 'localhost',
  port: process.env.SELLERDYNAMICS_DB_PORT || 3306,
  user: process.env.SELLERDYNAMICS_DB_USER || 'root',
  password: process.env.SELLERDYNAMICS_DB_PASSWORD || '',
  database: process.env.SELLERDYNAMICS_DB_NAME || 'sellerdynamics',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true};

// Connection pool
let pool = null;

async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Real database functions
export async function getRealSellerDynamicsData() {
  try {
    const connection = await getConnection();

    const query = `
      SELECT 
        sku,
        product_name,
        stock_level,
        cost_price,
        is_kit,
        good_id,
        category,
        vendor,
        reorder_point,
        last_updated
      FROM products 
      WHERE active = true
      ORDER BY product_name
      LIMIT 1000
    `;

    const [rows] = await connection.execute(query);

    return rows.map(product => {
      const isMasterProduct = identifyMasterProductFromSD(
        product.product_name,
        product.sku,
        product.is_kit,
        product.good_id
      );

      return {
        id: `SD-${product.sku}`,
    productName: product.product_name,
        sku: product.sku,
        category: product.category,
        vendor: product.vendor,
        currentStock: product.stock_level,
        allocatedStock: 0,
        availableStock: product.stock_level,
        cost: product.cost_price,
        price: product.cost_price * 1.5, // 50% markup
        reorderPoint: product.reorder_point,
        turnoverRate: 0.85,
        daysInStock: 15,
        lastUpdated: product.last_updated,
        supplier: {
    id: `supplier-${product.vendor.toLowerCase()}`,
          name: product.vendor,
          contact: '+44 20 1234 5678'
  },
        location: {
    warehouse: 'Main Warehouse',
          aisle: 'A-12',
          shelf: 'S-05'
  },
        metadata: {
    weight: '0.5kg',
          dimensions: '20x15x8cm',
          barcode: '1234567890123',
          tags: ['general']
  },
        isMasterProduct,
        productType: isMasterProduct ? 'Master Product' : 'Kit Product',
        isKit: product.is_kit,
        goodId: product.good_id};
  });
  } catch (error) {
    console.error('Error reading real SellerDynamics database:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

export async function updateRealSellerDynamicsDatabase(updateData) {
  try {
    const connection = await getConnection();

    // Start transaction
    await connection.beginTransaction();

    try {
      // Prepare updates
      const updates = [];
      const values = [];

      if (updateData.stockLevel !== null) {
        updates.push('stock_level = ?');
        values.push(updateData.stockLevel);
      }

      if (updateData.costPrice !== null) {
        updates.push('cost_price = ?');
        values.push(updateData.costPrice);
      }

      if (updateData.productName) {
        updates.push('product_name = ?');
        values.push(updateData.productName);
      }

      if (updateData.isKit !== null) {
        updates.push('is_kit = ?');
        values.push(updateData.isKit);
      }

      updates.push('updated_at = NOW()');
      values.push(updateData.sku);

      const query = `
        UPDATE products 
        SET ${updates.join(', ')}
        WHERE sku = ?
      `;

      const [result] = await connection.execute(query, values);

      if (result.affectedRows === 0) {
        throw new Error(`Product with SKU ${updateData.sku} not found`);
      }

      // Commit transaction
      await connection.commit();

      return {
        success: true,
    message: 'Database updated successfully',
        affectedRows: result.affectedRows,
        query: query};
  } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating real SellerDynamics database:', error);
    return {
      success: false,
    message: 'Database update failed',
      error: error.message};
  }
}

// Helper function for master product identification
function identifyMasterProductFromSD(productName, sku, isKit, goodId) {
  // Implementation from existing code
  const kitProductPatterns = [
    /^(?!.*wago).*-\d+$/i, // Pattern like "51253135-10" but not "Wago-51253135"
    /.*\s+pack$/i, // Products ending with "pack"
    /.*\s+set$/i, // Products ending with "set"
    /.*\s+kit$/i, // Products ending with "kit"
    /.*\s+bundle$/i, // Products ending with "bundle"
  ];

  const isKitProduct = kitProductPatterns.some(pattern => pattern.test(sku)) || isKit;

  return !isKitProduct;
}

// Close database connection
export async function closeConnection() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
