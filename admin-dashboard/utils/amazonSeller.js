// utils/amazonSeller.js
import SellingPartnerAPI from 'amazon-sp-api';

/**
 * Fetch your own Amazon inventory and BSR using SP-API
 * @returns {Promise<Array>} Array of { sku, asin, quantity, bsr }
 */
export async function getMyAmazonInventory() {
  const sellingPartner = new SellingPartnerAPI({
    region: process.env.SPAPI_REGION,
    refresh_token: process.env.LWA_REFRESH_TOKEN,
    credentials: {
    SELLING_PARTNER_APP_CLIENT_ID: process.env.LWA_CLIENT_ID,
      SELLING_PARTNER_APP_CLIENT_SECRET: process.env.LWA_CLIENT_SECRET,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE
  }
  });

  // Get inventory summaries
  const res = await sellingPartner.callAPI({
    operation: 'getInventorySummaries',
    endpoint: 'inventory',
    query: {
    details: true,
      granularityType: 'Marketplace',
      granularityId: process.env.SPAPI_SELLER_ID
  }
  });

  // Map to { sku, asin, quantity, bsr }
  return (res.inventorySummaries || []).map(item => ({
    sku: item.sku,
    asin: item.asin,
    quantity: item.quantity || 0,
    bsr: item.bestsellersRank || null
  }));
} 