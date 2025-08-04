// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const apiBaseUrl = API_BASE_URL;

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    orders: '/api/shopify-orders',
    products: '/api/shopify-products',
    customers: '/api/shopify-customers',
    sales: '/api/shopify-total-sales',
    analytics: '/api/analytics/ai',
    recommendations: '/api/ai/recommendations',
    status: '/api/status',
    auth: {
      status: '/auth/status',
      login: '/auth'
    },
    dashboard: '/dashboard',
    audit: {
      security: '/audit/security',
      performance: '/audit/performance',
      accessibility: '/audit/accessibility'
    }
  }
};

export default apiConfig; 