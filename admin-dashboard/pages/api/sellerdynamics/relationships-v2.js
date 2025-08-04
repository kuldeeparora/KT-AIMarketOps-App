import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status,(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { source = 'auto' } = req.query;
      let products = [];
      let dataSource = 'unknown';

      // Try different data sources based on preference
      switch (source) {
        case 'csv':
          products = await loadFromCSV();
          dataSource = products.length > 0 ? 'csv' : 'fallback';
          break;
        case 'database':
          products = await loadFromDatabase();
          dataSource = products.length > 0 ? 'database' : 'fallback';
          break;
        case 'api':
          products = await loadFromAPI();
          dataSource = products.length > 0 ? 'api' : 'fallback';
          break;
        case 'mock':
          products = generateMockProducts();
          dataSource = 'mock';
          break;
        case 'auto':
        default:
          // Try sources in order of preference
          products = await loadFromCSV();
          if (products.length > 0) {
            dataSource = 'csv';
          } else {
            products = await loadFromDatabase();
            if (products.length > 0) {
              dataSource = 'database';
            } else {
              products = await loadFromAPI();
              if (products.length > 0) {
                dataSource = 'api';
              } else {
                products = generateMockProducts();
                dataSource = 'mock';
              }
            }
          }
          break;
      }

      // Process products into relationships
      const masterProducts = products.filter(p => !p.isKit);
      const kitProducts = products.filter(p => p.isKit);
      const relationships = buildRelationships(products);

      return res.status(200).json({
        success: true,
        data: {
          totalProducts: products.length,
          masterProducts: masterProducts.length,
          kitProducts: kitProducts.length,
          relationships: relationships.length,
          relationships,
          masterProducts: masterProducts.slice(0, 20),
          kitProducts: kitProducts.slice(0, 20),
          dataSource,
          availableSources: ['csv', 'database', 'api', 'mock']
        }
      });
    } catch (error) {
      console.error('Error processing SellerDynamics relationships:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process SellerDynamics relationships: ' + error.message
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

// Load data from CSV file
async function loadFromCSV() {
  try {
    let csvPath = path.join(process.cwd(), 'amazon-SD-data.csv');

    if (!fs.existsSync(csvPath)) {
      csvPath = path.join(process.cwd(), 'admin-dashboard', 'amazon-SD-data.csv');
    }

    if (!fs.existsSync(csvPath)) {
      csvPath = path.join(process.cwd(), '..', 'amazon-SD-data.csv');
    }

    if (!fs.existsSync(csvPath)) {
      console.log('CSV file not found');
      return [];
    }

    const csvData = fs.readFileSync(csvPath, 'utf8');
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    const itemTitleIndex = headers.findIndex(h => h === 'ItemTitle');
    const skuIndex = headers.findIndex(h => h === 'SKU');
    const isKitIndex = headers.findIndex(h => h === 'IsKit');
    const goodIdIndex = headers.findIndex(h => h === 'GoodID');
    const stockLevelIndex = headers.findIndex(h => h === 'StockLevel');
    const costPriceIndex = headers.findIndex(h => h === 'CostPrice');

    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = parseCSVLine(line);

      if (
        values.length <
        Math.max(
          itemTitleIndex,
          skuIndex,
          isKitIndex,
          goodIdIndex,
          stockLevelIndex,
          costPriceIndex
        ) +
          1
      ) {
        continue;
      }

      const productName = values[itemTitleIndex]?.replace(/"/g, '') || '';
      const sku = values[skuIndex]?.replace(/"/g, '') || '';
      const isKit = values[isKitIndex]?.replace(/"/g, '') === 'TRUE';
      const goodId = values[goodIdIndex]?.replace(/"/g, '') || '';
      const stockLevel = parseInt(values[stockLevelIndex]?.replace(/"/g, '') || '0');
      const costPrice = parseFloat(values[costPriceIndex]?.replace(/"/g, '') || '0');

      if (!productName || !sku) continue;

      products.push({
        productName,
        sku,
        isKit,
        goodId,
        stockLevel,
        costPrice,
        isMasterProduct: !isKit,
        productType: isKit ? 'Kit Product' : 'Master Product'});
  }

    return products;
  } catch (error) {
    console.error('Error loading from CSV:', error);
    return [];
  }
}

// Load data from database (simulated)
async function loadFromDatabase() {
  try {
    console.log('Simulating database query for SellerDynamics relationships...');

    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return empty array to simulate no database connection
    // In a real implementation, this would query your database
    return [];
  } catch (error) {
    console.error('Error loading from database:', error);
    return [];
  }
}

// Load data from SellerDynamics API (simulated)
async function loadFromAPI() {
  try {
    console.log('Simulating SellerDynamics API call...');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Return empty array to simulate no API connection
    // In a real implementation, this would call the SellerDynamics API
    return [];
  } catch (error) {
    console.error('Error loading from API:', error);
    return [];
  }
}

// Generate mock products for testing
function generateMockProducts() {
  return [
    // Master Products
    {
      productName: 'BG Electrical 1-Gang 2-Way Metal Antique Brass Light Switch',
    sku: 'BG-NAB12',
      isKit: false,
      goodId: '98781de8-591c-412d-89dd-fc43b01cdfe7',
      stockLevel: 96,
      costPrice: 3.1,
      isMasterProduct: true,
      productType: 'Master Product'},
    {
      productName: 'BG Nexus Metal Black Nickel Switches and Sockets Full Range',
      sku: 'BG-NBN12',
      isKit: false,
      goodId: '12345678-1234-1234-1234-123456789012',
      stockLevel: 62,
      costPrice: 3.1,
      isMasterProduct: true,
      productType: 'Master Product'},
    {
      productName: 'BG Brushed Steel Light Switches & Sockets Full Range',
      sku: 'BG-NBS12',
      isKit: false,
      goodId: '87654321-4321-4321-4321-210987654321',
      stockLevel: 60,
      costPrice: 3.1,
      isMasterProduct: true,
      productType: 'Master Product'},
    // Kit Products
    {
      productName: 'BG Electrical 1-Gang 2-Way Metal Antique Brass Light Switch',
      sku: 'BG-NAB12_1',
      isKit: true,
      goodId: 'cd4ce63c-bafd-43ef-9b95-05432fe3b037',
      stockLevel: 96,
      costPrice: 3.1,
      isMasterProduct: false,
      productType: 'Kit Product'},
    {
      productName: 'BG Nexus Metal Black Nickel Switches and Sockets Full Range',
      sku: 'BG-NBN12_1',
      isKit: true,
      goodId: '11111111-1111-1111-1111-111111111111',
      stockLevel: 62,
      costPrice: 3.1,
      isMasterProduct: false,
      productType: 'Kit Product'},
    {
      productName: 'BG Nexus Metal Black Nickel Switches and Sockets Full Range',
      sku: 'BG-NBN12_2',
      isKit: true,
      goodId: '22222222-2222-2222-2222-222222222222',
      stockLevel: 62,
      costPrice: 3.1,
      isMasterProduct: false,
      productType: 'Kit Product'},
    {
      productName: 'BG NBN12 Nexus Metal Black Nickel 1 Gang 10A 10AX 2 Way Plate Switch',
      sku: 'BG-NBN12_3',
      isKit: true,
      goodId: '33333333-3333-3333-3333-333333333333',
      stockLevel: 62,
      costPrice: 3.1,
      isMasterProduct: false,
      productType: 'Kit Product'},
    {
      productName: 'BG Wiring Devices - Decorative & Moulded Light Switches & Sockets Full Range',
      sku: 'BG-NBS12_2',
      isKit: true,
      goodId: '44444444-4444-4444-4444-444444444444',
      stockLevel: 54,
      costPrice: 3.1,
      isMasterProduct: false,
      productType: 'Kit Product'},
    {
      productName: 'BG NBS12 Brushed Steel/Satin Chrome Single Light Switch x 4',
      sku: 'BG-NBS12-4',
      isKit: true,
      goodId: '55555555-5555-5555-5555-555555555555',
      stockLevel: 13,
      costPrice: 12.4,
      isMasterProduct: false,
      productType: 'Kit Product'},
    {
      productName: 'BG NBS12 Brushed Steel/Satin Chrome Single Light Switch x 3',
      sku: 'BG-NBS12-3',
      isKit: true,
      goodId: '66666666-6666-6666-6666-666666666666',
      stockLevel: 18,
      costPrice: 9.3,
      isMasterProduct: false,
      productType: 'Kit Product'},
    {
      productName:
        'Pack of 8 x BG NBS12 Brushed Steel/Satin Chrome Single Light Switch -10amp 1 or 2 Way',
      sku: 'BG-NBS12-8',
      isKit: true,
      goodId: '77777777-7777-7777-7777-777777777777',
      stockLevel: 6,
      costPrice: 24.8,
      isMasterProduct: false,
      productType: 'Kit Product'}];
  }

// Helper function to build relationships from products
function buildRelationships(products) {
  const relationships = [];
  const productGroups = {};

  // Group by base SKU pattern
  products.forEach(product => {
    const baseSku = extractBaseSku(product.sku);
    if (!productGroups[baseSku]) {
      productGroups[baseSku] = [];
    }
    productGroups[baseSku].push(product);
  });

  // Create relationships
  Object.values(productGroups).forEach(group => {
    if (group.length > 1) {
      const masterProduct = group.find(p => !p.isKit);
      const kitProducts = group.filter(p => p.isKit);

      if (masterProduct && kitProducts.length > 0) {
        relationships.push({
          masterProduct: {
    sku: masterProduct.sku,
            productName: masterProduct.productName,
            stockLevel: masterProduct.stockLevel,
            costPrice: masterProduct.costPrice
  },
          kitProducts: kitProducts.map(kp => ({
    sku: kp.sku,
            productName: kp.productName,
            stockLevel: kp.stockLevel,
            costPrice: kp.costPrice
  })),
          totalKitProducts: kitProducts.length});
  }
    }
  });

  return relationships;
}

// Helper function to parse CSV line with quotes
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

// Helper function to extract base SKU pattern
function extractBaseSku(sku) {
  if (!sku) return '';

  // Remove common suffixes that indicate kit products
  let baseSku = sku
    .replace(/_\d+$/, '') // Remove _1, _2, etc.
    .replace(/-\d+$/, '') // Remove -10, -2, etc.
    .replace(/_\d+[a-z]$/, '') // Remove _1a, _2b, etc.
    .replace(/-\d+[a-z]$/, ''); // Remove -1a, -2b, etc.

  return baseSku;
}
