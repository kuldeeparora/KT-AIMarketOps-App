import express from "express";
import { shopify } from "../shopify.js"; // Adjust path if needed

const router = express.Router();

router.get("/", shopify.validateAuthenticatedSession(), async (req, res) => {
  try {
    const session = res.locals.shopify.session;

    if (!session) {
      return res.status(401).json({ error: "Unauthorized: No session found" });
    }

    const client = new shopify.api.clients.Rest({ session });

    // Step 1: Fetch products with variants
    const productsResponse = await client.get({
      path: "products",
      query: { limit: 50 },
    });

    const products = productsResponse.body.products;

    // Step 2: Extract inventory item IDs and variant info
    const inventoryItemMap = [];
    for (const product of products) {
      for (const variant of product.variants) {
        inventoryItemMap.push({
          productTitle: product.title,
          variantTitle: variant.title,
          sku: variant.sku,
          inventoryItemId: variant.inventory_item_id,
        });
      }
    }

    const inventoryItemIds = inventoryItemMap.map((item) => item.inventoryItemId);

    if (inventoryItemIds.length === 0) {
      return res.json({ inventory: [] });
    }

    // Step 3: Fetch inventory levels for all inventory item IDs
    const inventoryLevelsResponse = await client.get({
      path: "inventory_levels",
      query: {
        inventory_item_ids: inventoryItemIds.join(","),
      },
    });

    const inventoryLevels = inventoryLevelsResponse.body.inventory_levels;

    // Step 4: Combine inventory info with levels
    const inventoryData = inventoryItemMap.map((item) => {
      const level = inventoryLevels.find(
        (lvl) => lvl.inventory_item_id === item.inventoryItemId
      );
      return {
        product: item.productTitle,
        variant: item.variantTitle,
        sku: item.sku,
        quantity: level ? level.available : "N/A",
        location_id: level ? level.location_id : "N/A",
      };
    });

    res.json({ inventory: inventoryData });
  } catch (error) {
    console.error("Failed to fetch Shopify inventory:", error);
    res.status(500).json({ error: "Failed to fetch Shopify inventory" });
  }
});

export default router;