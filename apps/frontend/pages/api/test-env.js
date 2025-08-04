export default function handler(req, res) {
  res.json({
    shop: process.env.SHOPIFY_SHOP,
    token: process.env.SHOPIFY_ACCESS_TOKEN
  });
}