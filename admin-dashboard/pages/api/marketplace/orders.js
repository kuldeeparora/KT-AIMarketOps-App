// API endpoint for marketplace orders
import { getOrders as getAmazonOrders } from '../../../utils/marketplace/amazon';
import { getOrders as getEbayOrders } from '../../../utils/marketplace/ebay';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status,(405).json({ error: 'Method not allowed' });
  }

  try {
    const { marketplace = 'amazon' } = req.query;

    let orders = [];

    if (marketplace === 'amazon') {
      orders = await getAmazonOrders();
    } else if (marketplace === 'ebay') {
      orders = await getEbayOrders();
    } else {
      // Return combined data for all marketplaces
      const amazonOrders = await getAmazonOrders();
      const ebayOrders = await getEbayOrders();
      orders = [...amazonOrders, ...ebayOrders];
    }

    res.status,(200).json({
      orders,
      marketplace,
      total: orders.length,
      timestamp: new Date().toISOString()});
  } catch (error) {
    console.error('[Marketplace Orders API] Error:', error);
    res.status,(500).json({
      error: error.message || 'Failed to fetch marketplace orders',
      marketplace: req.query.marketplace || 'unknown'});
  }
}
