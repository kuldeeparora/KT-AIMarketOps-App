const USE_MOCK = process.env.USE_MOCK_SELLERDYNAMICS !== 'false';

// Mock data generator (same structure as before)
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

function extractBaseSku(sku) {
  if (!sku) return '';
  let baseSku = sku
    .replace(/_\d+$/, '')
    .replace(/-\d+$/, '')
    .replace(/_\d+[a-z]$/, '')
    .replace(/-\d+[a-z]$/, '');
  return baseSku;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    if (USE_MOCK) {
      const products = generateMockProducts();
      const masterProducts = products.filter(p => !p.isKit);
      const kitProducts = products.filter(p => p.isKit);
      const relationships = buildRelationships(products);
          return res.status(200).json({
      success: true,
      data: {
        totalProducts: products.length,
        masterProducts,
        kitProducts,
        relationships,
        dataSource: 'mock'
      }
    });
  } else {
      // Placeholder for real SellerDynamics API/database logic
      return res.status(200).json({
        success: true,
        data: {
          totalProducts: 0,
          masterProducts: [],
          kitProducts: [],
          relationships: [],
          dataSource: 'real',
          message: 'Real SellerDynamics API/database integration not yet implemented.'
        }
      });
  }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
