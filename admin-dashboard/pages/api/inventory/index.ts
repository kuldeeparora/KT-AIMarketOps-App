import { NextApiRequest, NextApiResponse } from 'next';
import SellerDynamicsService from '../../../lib/sellerdynamicsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Inventory API] Fetching inventory data...');
    
    const sellerDynamicsService = new SellerDynamicsService();
    const inventory = await sellerDynamicsService.getInventory();
    
    console.log('[Inventory API] Successfully fetched inventory:', {
      totalItems: inventory.totalItems,
      totalStock: inventory.totalStock,
      lowStockItems: inventory.lowStockItems,
      outOfStockItems: inventory.outOfStockItems
    });

    return res.status(200).json({
      success: true,
      data: inventory,
      meta: {
        lastUpdated: new Date().toISOString(),
        dataSource: inventory.totalItems > 0 ? 'real' : 'mock',
        note: inventory.totalItems > 0 ? 'Using real inventory data' : 'Using mock inventory data'
      }
    });
  } catch (error) {
    console.error('[Inventory API] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory data',
      message: error.message
    });
  }
}
