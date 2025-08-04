export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch current inventory from both sources
    const [shopifyResponse, sellerdynamicsResponse] = await Promise.allSettled([
  fetch('/api/shopify-inventory'),
  fetch('/api/sellerdynamics')
]);

    const shopifyData =
      shopifyResponse.status === 'fulfilled'
        ? await shopifyResponse.value.json()
        : { data: { products: [] } };

    const sellerdynamicsData =
      sellerdynamicsResponse.status === 'fulfilled'
        ? await sellerdynamicsResponse.value.json()
        : { stockLevels: [] };

    // Process Shopify data for sync
    const shopifyItems = shopifyData.data?.products || [];
    const syncPromises = shopifyItems.map(async item => {
      const variant = item.variants?.[0] || {};
      const sku = variant.sku || `SHOP-${item.id}`;

      try {
        const response = await fetch(`${process.env.SELLERDYNAMICS_API_URL}/inventory/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SELLERDYNAMICS_API_KEY}`},
          body: JSON.stringify({
            sku,
            productName: item.title,
            currentStock: variant.inventory_quantity || 0,
            price: parseFloat(variant.price) || 0,
            category: item.product_type || 'General',
            vendor: item.vendor || 'Unknown Brand',
            lastUpdated: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to sync ${sku}: ${response.statusText}`);
        }

        return { sku, status: 'success' };
      } catch (error) {
        console.error(`Error syncing ${sku}:`, error);
        return { sku, status: 'error', error: error.message };
      }
    });

    const results = await Promise.allSettled(syncPromises);

    const successful = results.filter(
      r => r.status === 'fulfilled' && r.value.status === 'success'
    ).length;
    const failed = results.length - successful;

    return res.status(200).json({
      message: `Sync completed. ${successful} successful, ${failed} failed.`,
      summary: {
        total: results.length,
        successful,
        failed
      },
      results: results.map(r =>
        r.status === 'fulfilled' ? r.value : { status: 'error', error: r.reason }
      ),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync all error:', error);
    return res.status(500).json({
      error: 'Sync all failed',
      details: error.message
    });
  }
}
