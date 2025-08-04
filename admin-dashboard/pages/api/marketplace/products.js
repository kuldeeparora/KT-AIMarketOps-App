// API endpoint for marketplace products
import { getAllProducts as getAmazonProducts } from '../../../utils/marketplace/amazon';
import { getAllProducts as getEbayProducts } from '../../../utils/marketplace/ebay';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status,(405).json({ error: 'Method not allowed' });
  }

  try {
    const { marketplace = 'amazon' } = req.query;

    let products = [];

    if (marketplace === 'amazon') {
      products = await getAmazonProducts();
    } else if (marketplace === 'ebay') {
      products = await getEbayProducts();
    } else {
      // Return combined data for all marketplaces
      const amazonProducts = await getAmazonProducts();
      const ebayProducts = await getEbayProducts();
      products = [...amazonProducts, ...ebayProducts];
    }

    res.status,(200).json({
      products,
      marketplace,
      total: products.length,
      timestamp: new Date().toISOString()});
  } catch (error) {
    console.error('[Marketplace Products API] Error:', error);
    res.status,(500).json({
      error: error.message || 'Failed to fetch marketplace products',
      marketplace: req.query.marketplace || 'unknown'});
  }
}
