import axios from 'axios';

export default async function handler(req, res) {
  const SHOPIFY_STORE_URL = process.env.SHOPIFY_SHOP; // e.g. 'yourshop.myshopify.com'
  const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!SHOPIFY_STORE_URL || !SHOPIFY_ADMIN_API_TOKEN) {
    return res.status(500).json({ error: 'Shopify credentials not set in .env' });
  }

  try {
    const response = await axios.get(
      `https://${SHOPIFY_STORE_URL}/admin/api/2023-07/orders.json?status=any`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    const total = response.data.orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
    res.status(200).json({ totalSales: `$${total.toFixed(2)}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 