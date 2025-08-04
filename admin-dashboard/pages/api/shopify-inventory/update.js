export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productId, variantId, inventory_quantity, price } = req.body;

    // Validate required fields
    if (!productId || !variantId) {
      return res.status(400).json({ error: 'Product ID and Variant ID are required' });
    }

    const shop = process.env.SHOPIFY_SHOP;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    // If no real credentials, simulate update
    if (!shop || !accessToken) {
      console.log('Simulating Shopify update for Product ID:', productId, 'Variant ID:', variantId);

      return res.status(200).json({
        success: true,
        message: 'Stock updated successfully (simulated)',
        data: {
          productId,
          variantId,
          inventory_quantity: inventory_quantity || 0,
          price: price || 0,
          lastUpdated: new Date().toISOString()
        }
      });
    }

    // Update inventory quantity
    const inventoryResponse = await fetch(
      `https://${shop}/admin/api/2024-01/inventory_levels/set.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location_id: process.env.SHOPIFY_LOCATION_ID || '1', // Default location ID
          inventory_item_id: variantId,
          available: inventory_quantity || 0
        })
      }
    );

    if (!inventoryResponse.ok) {
      throw new Error(
        `Shopify inventory update failed: ${inventoryResponse.status} ${inventoryResponse.statusText}`
      );
    }

    // Update variant price if provided
    if (price !== undefined) {
      const variantResponse = await fetch(
        `https://${shop}/admin/api/2024-01/variants/${variantId}.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            variant: {
              id: variantId,
              price: price.toString()
            }
          })
        }
      );

      if (!variantResponse.ok) {
        throw new Error(
          `Shopify variant update failed: ${variantResponse.status} ${variantResponse.statusText}`
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Stock updated successfully in Shopify',
      data: {
        productId,
        variantId,
        inventory_quantity: inventory_quantity || 0,
        price: price || 0,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[Shopify Update] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
