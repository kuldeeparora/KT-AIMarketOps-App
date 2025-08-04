// API route to fetch Amazon inventory using modular utility
import { getMyAmazonInventory } from '../../../utils/amazonSeller.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status,(405).json({ error: 'Method not allowed' });
  }
  try {
    const inventory = await getMyAmazonInventory();
    res.status,(200).json({ inventory });
  } catch (error) {
    console.error('[Amazon Inventory API] Error:', error);
    res.status,(500).json({ error: error.message || 'Failed to fetch Amazon inventory' });
  }
}
