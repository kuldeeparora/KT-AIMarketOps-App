import axios from 'axios';

export default async function handler(req, res) {
  const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP;
  const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!SHOPIFY_SHOP || !SHOPIFY_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Shopify credentials not set in .env' });
  }

  try {
    const response = await axios.get(
      `https://${SHOPIFY_SHOP}/admin/api/2023-07/products.json?limit=10&order=created_at desc`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    const products = response.data.products;
    const productCount = products.length;
    // Flatten all variants for inventory
    const inventory = products.flatMap(p => p.variants.map(v => ({
      product: p.title,
      sku: v.sku,
      stock: v.inventory_quantity,
      variant_id: v.id
    })));
    const lowStock = inventory.filter(i => i.stock !== null && i.stock < 5);
    res.status(200).json({
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        created_at: p.created_at
      })),
      productCount,
      inventory,
      lowStock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 