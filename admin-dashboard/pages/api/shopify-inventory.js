export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const shop = process.env.SHOPIFY_SHOP;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (!shop || !accessToken) {
      console.warn('Missing Shopify credentials, returning mock data');
      return res.status(200).json({
        success: true,
        data: {
          products: getMockShopifyData(),
          meta: {
            totalProducts: 25,
            lowStockCount: 3,
            outOfStockCount: 1
          }
        }
      });
    }

    // Fetch real products from Shopify using REST API
    const productsResponse = await fetch(
      `https://${shop}/admin/api/2024-01/products.json?limit=250&fields=id,title,variants,images,status,`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!productsResponse.ok) {
      throw new Error(
        `Shopify API error: ${productsResponse.status} ${productsResponse.statusText}`
      );
    }

    const productsData = await productsResponse.json();

    // Process and combine data
    const products = productsData.products.map(product => ({
      id: product.id,
      title: product.title,
      status: product.status,
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        price: variant.price,
        inventory_quantity: variant.inventory_quantity || 0,
        inventory_policy: variant.inventory_policy
      })),
      images: product.images.map(img => ({
        id: img.id,
        src: img.src,
        alt: img.alt
      })),
      totalInventory: product.variants.reduce(
        (sum, variant) => sum + (variant.inventory_quantity || 0),
        0
      ),
      lowStock: product.variants.some(variant => (variant.inventory_quantity || 0) < 10)
    }));

    return res.status(200).json({
      success: true,
      data: {
        products,
        meta: {
          totalProducts: products.length,
          lowStockCount: products.filter(p => p.lowStock).length,
          outOfStockCount: products.filter(p => p.totalInventory === 0).length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching Shopify inventory:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
}

function getMockShopifyData() {
  const baseProducts = [
    {
      id: 1,
      title: 'Premium Wireless Headphones',
      status: 'active',
      variants: [
        {
          id: 1,
          title: 'Default Title',
          sku: 'PWH-001',
          price: '159.99',
          inventory_quantity: 45,
          inventory_policy: 'continue',
          cost: '89.50'
        }
      ],
      images: [
        {
          id: 1,
          src: 'https://via.placeholder.com/300x300?text=Headphones',
          alt: 'Premium Wireless Headphones'
        }
      ],
      totalInventory: 45,
      lowStock: false,
      cost: 89.5
    },
    {
      id: 2,
      title: 'Bluetooth Speaker Pro',
      status: 'active',
      variants: [
        {
          id: 2,
          title: 'Default Title',
          sku: 'BSP-002',
          price: '89.99',
          inventory_quantity: 8,
          inventory_policy: 'continue',
          cost: '45.25'
        }
      ],
      images: [
        {
          id: 2,
          src: 'https://via.placeholder.com/300x300?text=Speaker',
          alt: 'Bluetooth Speaker Pro'
        }
      ],
      totalInventory: 8,
      lowStock: true,
      cost: 45.25
    }
  ];

  // Generate additional Shopify products
  const additionalProducts = [];
  const productTypes = [
    { name: 'Smart Watch', category: 'Wearables', price: 299.99, cost: 150 },
    { name: 'Laptop Stand', category: 'Accessories', price: 49.99, cost: 25 },
    { name: 'Wireless Mouse', category: 'Accessories', price: 29.99, cost: 15 },
    { name: 'Mechanical Keyboard', category: 'Accessories', price: 129.99, cost: 65 },
    { name: 'Gaming Headset', category: 'Audio', price: 89.99, cost: 45 },
    { name: 'USB-C Hub', category: 'Accessories', price: 39.99, cost: 20 },
    { name: 'Portable Charger', category: 'Accessories', price: 59.99, cost: 30 },
    { name: 'Webcam HD', category: 'Accessories', price: 79.99, cost: 40 },
    { name: 'Monitor Stand', category: 'Accessories', price: 69.99, cost: 35 },
    { name: 'Cable Organizer', category: 'Accessories', price: 19.99, cost: 10 }
  ];

  for (let i = 1; i <= 50; i++) {
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const stock = Math.floor(Math.random() * 100) + 5;
    const cost = productType.cost;
    const price = productType.price;

    additionalProducts.push({
      id: i + 2,
      title: `${productType.name} ${i}`,
      status: 'active',
      variants: [
        {
          id: i + 2,
          title: 'Default Title',
          sku: `${productType.name.replace(/\s+/g, '').toUpperCase()}-${i.toString().padStart(3, '0')}`,
          price: price.toString(),
          inventory_quantity: stock,
          inventory_policy: 'continue',
          cost: cost.toString()
        }
      ],
      images: [
        {
          id: i + 2,
          src: `https://via.placeholder.com/300x300?text=${encodeURIComponent(productType.name)}`,
          alt: `${productType.name} ${i}`
        }
      ],
      totalInventory: stock,
      lowStock: stock < 10,
      cost: cost,
      product_type: productType.category
    });
  }

  return [...baseProducts, ...additionalProducts];
}
