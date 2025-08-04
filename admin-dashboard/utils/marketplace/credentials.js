/**
 * Marketplace credentials management
 * This file handles credentials for various marketplace integrations
 */

// Amazon credentials
export async function getAmazonCredentials() {
  return {
    accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
    region: process.env.AMAZON_REGION || 'us-east-1',
    marketplaceId: process.env.AMAZON_MARKETPLACE_ID,
    sellerId: process.env.AMAZON_SELLER_ID,
    appId: process.env.AMAZON_APP_ID,
    appSecret: process.env.AMAZON_APP_SECRET,
  };
}

// eBay credentials
export async function getEbayCredentials() {
  return {
    appId: process.env.EBAY_APP_ID,
    certId: process.env.EBAY_CERT_ID,
    clientSecret: process.env.EBAY_CLIENT_SECRET,
    devId: process.env.EBAY_DEV_ID,
    siteId: process.env.EBAY_SITE_ID || '0', // US
    authToken: process.env.EBAY_AUTH_TOKEN,
  };
}

// Shopify credentials
export async function getShopifyCredentials() {
  return {
    shopDomain: process.env.SHOPIFY_SHOP_DOMAIN,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01',
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET,
  };
}

// WooCommerce credentials
export async function getWooCommerceCredentials() {
  return {
    url: process.env.WOOCOMMERCE_URL,
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    version: process.env.WOOCOMMERCE_VERSION || 'wc/v3',
  };
}

// Etsy credentials
export async function getEtsyCredentials() {
  return {
    apiKey: process.env.ETSY_API_KEY,
    apiSecret: process.env.ETSY_API_SECRET,
    accessToken: process.env.ETSY_ACCESS_TOKEN,
    refreshToken: process.env.ETSY_REFRESH_TOKEN,
    shopId: process.env.ETSY_SHOP_ID,
  };
}

// Walmart credentials
export async function getWalmartCredentials() {
  return {
    clientId: process.env.WALMART_CLIENT_ID,
    clientSecret: process.env.WALMART_CLIENT_SECRET,
    accessToken: process.env.WALMART_ACCESS_TOKEN,
    refreshToken: process.env.WALMART_REFRESH_TOKEN,
    partnerId: process.env.WALMART_PARTNER_ID,
  };
}

// Generic marketplace credentials
export async function getMarketplaceCredentials(marketplace) {
  switch (marketplace.toLowerCase()) {
    case 'amazon':
      return await getAmazonCredentials();
    case 'ebay':
      return await getEbayCredentials();
    case 'shopify':
      return await getShopifyCredentials();
    case 'woocommerce':
      return await getWooCommerceCredentials();
    case 'etsy':
      return await getEtsyCredentials();
    case 'walmart':
      return await getWalmartCredentials();
    default:
      throw new Error(`Unsupported marketplace: ${marketplace}`);
  }
}

// Validate credentials
export function validateCredentials(credentials) {
  if (!credentials) {
    throw new Error('Credentials are required');
  }
  
  const requiredFields = Object.keys(credentials).filter(key => 
    credentials[key] === undefined || credentials[key] === null || credentials[key] === ''
  );
  
  if (requiredFields.length > 0) {
    throw new Error(`Missing required credentials: ${requiredFields.join(', ')}`);
  }
  
  return true;
}

// Test credentials
export async function testCredentials(marketplace) {
  try {
    const credentials = await getMarketplaceCredentials(marketplace);
    validateCredentials(credentials);
    return { valid: true, marketplace };
  } catch (error) {
    return { valid: false, marketplace, error: error.message };
  }
}

// Get all marketplace credentials
export async function getAllCredentials() {
  const marketplaces = ['amazon', 'ebay', 'shopify', 'woocommerce', 'etsy', 'walmart'];
  const results = {};
  
  for (const marketplace of marketplaces) {
    try {
      results[marketplace] = await getMarketplaceCredentials(marketplace);
    } catch (error) {
      results[marketplace] = { error: error.message };
    }
  }
  
  return results;
} 