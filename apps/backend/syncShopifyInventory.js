import { shopify } from './shopify.js'; // Adjust path as needed
import prisma from './prismaClient.js';

async function syncShopifyInventory(session) {
  try {
    const client = new shopify.api.clients.Rest({ session });

    // Fetch Shopify products (limit 50 for example)
    const productsResponse = await client.get({
      path: 'products',
      query: { limit: 50 },
    });
    const products = productsResponse.body.products;

    const inventoryItemsToSync = [];

    for (const product of products) {
      for (const variant of product.variants) {
        inventoryItemsToSync.push({
          sku: variant.sku,
          name: `${product.title} - ${variant.title}`,
          inventoryItemId: variant.inventory_item_id,
        });
      }
    }

    const inventoryItemIds = inventoryItemsToSync.map(i => i.inventoryItemId);

    // Fetch inventory levels for these items
    const inventoryLevelsResponse = await client.get({
      path: 'inventory_levels',
      query: { inventory_item_ids: inventoryItemIds.join(',') },
    });

    const inventoryLevels = inventoryLevelsResponse.body.inventory_levels;

    // Merge quantity info
    const dataToUpsert = inventoryItemsToSync.map(item => {
      const level = inventoryLevels.find(lvl => lvl.inventory_item_id === item.inventoryItemId);
      return {
        sku: item.sku || null,
        name: item.name,
        quantity: level ? level.available : 0,
      };
    });

    // Upsert each item into Prisma DB
    for (const item of dataToUpsert) {
      if (!item.sku) continue; // skip if no SKU
      try {
        await prisma.inventoryItem.upsert({
          where: { sku: item.sku },
          update: { quantity: item.quantity, name: item.name },
          create: { sku: item.sku, name: item.name, quantity: item.quantity },
        });
      } catch (dbError) {
        console.error(`Failed to upsert SKU ${item.sku}:`, dbError);
      }
    }

    console.log('Shopify inventory synced successfully.');
    return { success: true };
  } catch (error) {
    console.error('Error syncing Shopify inventory:', error);
    throw error;
  }
}

export default syncShopifyInventory;