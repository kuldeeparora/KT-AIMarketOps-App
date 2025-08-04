import axios from 'axios';

export default async function handler(req, res) {
  const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP;
  const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!SHOPIFY_SHOP || !SHOPIFY_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Shopify credentials not set in .env' });
  }

  try {
    // Fetch orders for sales over time
    const ordersRes = await axios.get(
      `https://${SHOPIFY_SHOP}/admin/api/2023-07/orders.json?status=any&limit=50&order=created_at desc`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    const orders = ordersRes.data.orders;
    // Group sales by day
    const salesByDay = {};
    orders.forEach(order => {
      const day = order.created_at.slice(0, 10);
      salesByDay[day] = (salesByDay[day] || 0) + parseFloat(order.total_price);
    });
    // Fetch products for top products
    const productsRes = await axios.get(
      `https://${SHOPIFY_SHOP}/admin/api/2023-07/products.json?limit=50&order=created_at desc`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    const products = productsRes.data.products;
    // Top products by order count (from orders)
    const productSales = {};
    orders.forEach(order => {
      order.line_items.forEach(item => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = { title: item.title, sales: 0, revenue: 0 };
        }
        productSales[item.product_id].sales += item.quantity;
        productSales[item.product_id].revenue += parseFloat(item.price) * item.quantity;
      });
    });
    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    res.status(200).json({
      salesByDay,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 