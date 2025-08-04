// SellerDynamics API Configuration
// Based on Gary's feedback about excessive login attempts

export const SELLERDYNAMICS_CONFIG = {
  // Rate limiting settings
  MIN_CALL_INTERVAL: 60000, // 1 minute between calls (as recommended by Gary)
  CACHE_EXPIRY: 300000, // 5 minutes cache
  
  // API endpoints
  SOAP_ENDPOINT: process.env.SELLERDYNAMICS_SOAP_ENDPOINT,
  ENCRYPTED_LOGIN: process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN,
  RETAILER_ID: process.env.SELLERDYNAMICS_RETAILER_ID,
  
  // SOAP method names (to be verified with SellerDynamics)
  METHODS: {
    GET_PRODUCTS: 'GetProducts',
    GET_ORDERS: 'GetOrders',
    GET_RELATIONSHIPS: 'GetRelationships',
    GET_CUSTOMERS: 'GetCustomers'
  },
  
  // Namespace
  NAMESPACE: 'http://www.sellerdynamics.com/',
  
  // Error handling
  MAX_RETRIES: 3,
  TIMEOUT: 30000, // 30 seconds
  
  // Logging
  ENABLE_LOGGING: process.env.NODE_ENV === 'development'
};

// Rate limiting function
export async function throttleApiCall() {
  const now = Date.now();
  const timeSinceLastCall = now - (global.lastSellerDynamicsCall || 0);
  
  if (timeSinceLastCall < SELLERDYNAMICS_CONFIG.MIN_CALL_INTERVAL) {
    const waitTime = SELLERDYNAMICS_CONFIG.MIN_CALL_INTERVAL - timeSinceLastCall;
    console.log(`[SellerDynamics] Rate limiting: waiting ${waitTime}ms before next call`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  global.lastSellerDynamicsCall = Date.now();
}

// Cache management
const cache = new Map();

export function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp) < SELLERDYNAMICS_CONFIG.CACHE_EXPIRY) {
    console.log(`[SellerDynamics] Using cached data for ${key}`);
    return cached.data;
  }
  return null;
}

export function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
  console.log(`[SellerDynamics] Cached data for ${key}`);
}

// Clear cache function
export function clearCache() {
  cache.clear();
  console.log('[SellerDynamics] Cache cleared');
} 