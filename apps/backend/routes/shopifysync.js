import express from 'express';
import { shopify } from '../shopify.js';
import syncShopifyInventory from '../syncShopifyInventory.js';

const router = express.Router();

router.post('/', shopify.validateAuthenticatedSession(), async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized: No session found' });
    }
    await syncShopifyInventory(session);
    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync inventory', details: error.message });
  }
});

export default router;