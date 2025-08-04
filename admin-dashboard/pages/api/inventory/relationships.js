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
      // Fetch inventory data to analyze relationships
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/sellerdynamics`
      );
      const data = await response.json();

      const products = data.stockLevels || [];

      // Create relationship mapping
      const relationships = createProductRelationships(products);

      return res.status,(200).json({
        success: true,
        data: relationships,
        meta: {
    totalMasterProducts: relationships.masterProducts.length,
          totalKitProducts: relationships.kitProducts.length,
          totalRelationships: relationships.relationships.length
  }
      });
    } catch (error) {
      console.error('Error fetching product relationships:', error);
      return res.status,(500).json({
        success: false,
    error: error.message});
  }
  }

  return res.status,(405).json({ error: 'Method not allowed' });
  }

function createProductRelationships(products) {
  const masterProducts = [];
  const kitProducts = [];
  const relationships = [];

  // Special handling for Wago products first
  const wagoMasterProducts = products.filter(
    p =>
      p.productName.toLowerCase().includes('wago') &&
      !p.productName.toLowerCase().match(/wago-\d+-\d+/) && // Not a kit product
      !p.productName.toLowerCase().includes('kit')
  );

  wagoMasterProducts.forEach(masterProduct => {
    const masterNumber = masterProduct.productName.match(/wago-(\d+)/)?.[1];
    if (masterNumber) {
      // Find all kit products for this master
      const linkedKitProducts = products.filter(
        p => p.productName.match(new RegExp(`^${masterNumber}-\\d+$`)) // Matches "51253135-10", "51253135-2", etc.
      );

      masterProducts.push({
        ...masterProduct,
        basePattern: `wago-${masterNumber}`,
        linkedKitProducts: linkedKitProducts.map(kp => kp.sku)});

      linkedKitProducts.forEach(kitProduct => {
        kitProducts.push({
          ...kitProduct,
          basePattern: `wago-${masterNumber}`,
          masterProductSku: masterProduct.sku,
          masterProductName: masterProduct.productName});

        relationships.push({
          masterProductSku: masterProduct.sku,
          masterProductName: masterProduct.productName,
          kitProductSku: kitProduct.sku,
          kitProductName: kitProduct.productName,
          relationshipType: 'kit-to-master'});
  });
    }
  });

  // Handle other products (non-Wago)
  const nonWagoProducts = products.filter(
    p => !p.productName.toLowerCase().includes('wago') && !kitProducts.some(kp => kp.sku === p.sku) // Not already processed as kit
  );

  // Group remaining products by their base patterns
  const productGroups = {};

  nonWagoProducts.forEach(product => {
    const basePattern = extractBasePattern(product.productName, product.sku);

    if (!productGroups[basePattern]) {
      productGroups[basePattern] = [];
    }

    productGroups[basePattern].push(product);
  });

  // Analyze each group to identify master and kit products
  Object.entries(productGroups).forEach(([basePattern, groupProducts]) => {
    if (groupProducts.length === 1) {
      // Single product - likely a master product
      const product = groupProducts[0];
      masterProducts.push({
        ...product,
        basePattern,
        linkedKitProducts: []});
  } else {
      // Multiple products - identify master and kits
      const masterProduct = findMasterProduct(groupProducts);
      const kitProductsInGroup = groupProducts.filter(p => p.sku !== masterProduct.sku);

      masterProducts.push({
        ...masterProduct,
        basePattern,
        linkedKitProducts: kitProductsInGroup.map(kp => kp.sku)});

      kitProductsInGroup.forEach(kitProduct => {
        kitProducts.push({
          ...kitProduct,
          basePattern,
          masterProductSku: masterProduct.sku,
          masterProductName: masterProduct.productName});

        relationships.push({
          masterProductSku: masterProduct.sku,
          masterProductName: masterProduct.productName,
          kitProductSku: kitProduct.sku,
          kitProductName: kitProduct.productName,
          relationshipType: 'kit-to-master'});
  });
    }
  });

  return {
    masterProducts,
    kitProducts,
    relationships,
    productGroups: Object.keys(productGroups)
  };
}

function extractBasePattern(productName, sku) {
  // Extract base pattern from product name or SKU
  const name = productName.toLowerCase();
  const skuLower = sku.toLowerCase();

  // Handle Wago products specifically
  if (name.includes('wago')) {
    // For Wago products, extract the base number
    const wagoMatch = name.match(/wago-(\d+)/);
    if (wagoMatch) {
      return `wago-${wagoMatch[1]}`;
    }
  }

  // Handle products with numbers after dash (like "51253135-10")
  const dashNumberMatch = name.match(/^(\d+)-/);
  if (dashNumberMatch) {
    return dashNumberMatch[1];
  }

  // Remove quantity indicators to get base pattern
  let basePattern = name
    .replace(/\d+x/g, '') // Remove "10X", "25X" patterns
    .replace(/\d+[xX]/g, '') // Remove "1x", "2x" patterns
    .replace(/-\d+$/g, '') // Remove "-10", "-2" patterns
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[^\w-]/g, ''); // Remove special characters except hyphens

  // If no pattern found, use the original name
  if (!basePattern || basePattern.length < 3) {
    basePattern = name.replace(/\s+/g, '').replace(/[^\w-]/g, '');
  }

  return basePattern;
}

function findMasterProduct(products) {
  // Find the master product in a group
  // Master product is typically the one without quantity indicators

  const masterProduct = products.find(product => {
    const name = product.productName.toLowerCase();
    const sku = product.sku.toLowerCase();

    // Master products typically don't have quantity indicators
    const hasQuantityIndicator = /\d+x/i.test(name) || /\d+x/i.test(sku) || /-\d+$/i.test(name);

    return !hasQuantityIndicator;
  });

  // If no clear master product found, look for base product patterns
  if (!masterProduct) {
    // Look for products that might be base products (like "Wago-51253135")
    const baseProduct = products.find(product => {
      const name = product.productName.toLowerCase();
      return name.includes('wago') || name.includes('base') || name.includes('master');
    });

    if (baseProduct) {
      return baseProduct;
    }
  }

  // If still no master product found, use the one with the shortest name (likely base product)
  return masterProduct || products.sort((a, b) => a.productName.length - b.productName.length)[0];
}
