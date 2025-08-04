import axios from 'axios';

export default async function handler(req, res) {
  const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP;
  const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!SHOPIFY_SHOP || !SHOPIFY_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Shopify credentials not set in .env' });
  }

  try {
    const response = await axios.get(
      `https://${SHOPIFY_SHOP}/admin/api/2023-07/orders.json?status=any&limit=10&order=created_at desc`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    const orders = response.data.orders;
    const orderCount = orders.length;
    const pendingOrders = orders.filter(o => o.financial_status === 'pending').length;
    res.status(200).json({
      orders: orders.map(o => ({
        id: o.id,
        name: o.name,
        created_at: o.created_at,
        total_price: o.total_price,
        financial_status: o.financial_status,
        fulfillment_status: o.fulfillment_status,
        customer: o.customer ? o.customer.first_name + ' ' + o.customer.last_name : 'Guest'
      })),
      orderCount,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 