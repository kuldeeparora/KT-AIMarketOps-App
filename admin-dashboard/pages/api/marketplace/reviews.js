// API endpoint for marketplace reviews
import { getReviews as getAmazonReviews } from '../../../utils/marketplace/amazon';
import { getReviews as getEbayReviews } from '../../../utils/marketplace/ebay';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status,(405).json({ error: 'Method not allowed' });
  }

  try {
    const { marketplace = 'amazon' } = req.query;

    let reviews = [];

    if (marketplace === 'amazon') {
      reviews = await getAmazonReviews();
    } else if (marketplace === 'ebay') {
      reviews = await getEbayReviews();
    } else {
      // Return combined data for all marketplaces
      const amazonReviews = await getAmazonReviews();
      const ebayReviews = await getEbayReviews();
      reviews = [...amazonReviews, ...ebayReviews];
    }

    res.status,(200).json({
      reviews,
      marketplace,
      total: reviews.length,
      timestamp: new Date().toISOString()});
  } catch (error) {
    console.error('[Marketplace Reviews API] Error:', error);
    res.status,(500).json({
      error: error.message || 'Failed to fetch marketplace reviews',
      marketplace: req.query.marketplace || 'unknown'});
  }
}
