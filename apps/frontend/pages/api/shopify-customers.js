import axios from 'axios';

export default async function handler(req, res) {
  const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP;
  const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!SHOPIFY_SHOP || !SHOPIFY_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Shopify credentials not set in .env' });
  }

  try {
    const response = await axios.get(
      `https://${SHOPIFY_SHOP}/admin/api/2023-07/customers.json?limit=10&order=created_at desc`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    const customers = response.data.customers;
    const customerCount = customers.length;
    res.status(200).json({
      customers: customers.map(c => ({
        id: c.id,
        name: c.first_name + ' ' + c.last_name,
        email: c.email,
        created_at: c.created_at,
        orders_count: c.orders_count
      })),
      customerCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 