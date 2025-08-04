
import express from 'express';
import {
  shopifyOrders,
  shopifyProducts,
  shopifyCustomers,
  shopifyTotalSales,
  analyticsAI,
  aiRecommendations,
  shopifyAnalytics,
  securityAudit,
  performanceAudit,
  accessibilityAudit,
  dashboard,
  orders,
  legacyShopifyOrders,
  analytics,
  apiDashboard,
  seo,
  audit,
  shopifyInventoryData,
  inventoryAlerts,
  aiCopilot,
  plugins,
  accounting,
  analyticsAIResponse,
  analyticsInventoryResponse,
  analyticsCustomerResponse,
  pluginsStatusResponse
} from './mock-data.js';

const router = express.Router();

// Shopify Orders Endpoint
router.get('/shopify-orders', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(shopifyOrders);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Products Endpoint
router.get('/shopify-products', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(shopifyProducts);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Customers Endpoint
router.get('/shopify-customers', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(shopifyCustomers);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Total Sales Endpoint
router.get('/shopify-total-sales', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(shopifyTotalSales);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics AI Endpoint
router.get('/analytics/ai', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(analyticsAI);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Recommendations Endpoint
router.get('/ai/recommendations', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(aiRecommendations);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Analytics Endpoint
router.get('/shopify-analytics', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(shopifyAnalytics);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Security Audit Endpoint
router.get('/audit/security', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(securityAudit);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Performance Audit Endpoint
router.get('/audit/performance', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(performanceAudit);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Accessibility Audit Endpoint
router.get('/audit/accessibility', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(accessibilityAudit);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard endpoint
router.get('/dashboard', async (req, res) => {
  try {
    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Orders endpoint
router.get("/orders", async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Orders Endpoint (legacy)
router.get("/shopify-orders", async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    res.json(legacyShopifyOrders);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Dashboard endpoint for admin dashboard
router.get('/api/dashboard', async (req, res) => {
  try {
    res.json(apiDashboard);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// AI Copilot endpoint for admin dashboard
router.post('/api/ai-copilot', async (req, res) => {
  try {
    const { message } = req.body;
    res.json({
      response: `AI Copilot: I understand you said "${message}". How can I help you with your Shopify store today?`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

router.post('/api/ai-copilot/generate', async (req, res) => {
  try {
    const { type, topic } = req.body;
    res.json({
      content: `Generated ${type} content about ${topic}. This is a sample response from the AI Copilot.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// SEO endpoint for admin dashboard
router.get('/api/seo', async (req, res) => {
  try {
    res.json(seo);
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    res.status(500).json({ error: 'Failed to fetch SEO data' });
  }
});

// Accounting endpoint for admin dashboard
router.post('/api/accounting/invoice', async (req, res) => {
  try {
    const { customer, amount, status, dueDate } = req.body;
    res.json({
      id: `INV-${Date.now()}`,
      customer,
      amount,
      status,
      dueDate,
      createdAt: new Date().toISOString(),
      message: 'Invoice created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Audit endpoint
router.get('/audit', (req, res) => {
  res.json(audit);
});

// Test endpoint for Shopify inventory configuration
router.get('/test-shopify-inventory', (req, res) => {
  const { shop } = req.query;
  
  const config = {
    hasAccessToken: !!process.env.SHOPIFY_ACCESS_TOKEN,
    apiUrl: process.env.SHOPIFY_API_URL || 'https://api.shopify.com',
    shop: shop,
    envVars: {
      SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN ? 'SET' : 'NOT SET',
      SHOPIFY_API_URL: process.env.SHOPIFY_API_URL || 'DEFAULT'
    }
  };
  
  res.json({
    message: 'Shopify Inventory Configuration Test',
    config: config,
    status: config.hasAccessToken ? 'READY' : 'NOT_CONFIGURED',
    instructions: config.hasAccessToken ? 
      'Access token is configured. Check logs for connection details.' : 
      'Add SHOPIFY_ACCESS_TOKEN to your .env file to enable real integration.'
  });
});

// Test Shopify inventory connection endpoint
router.get('/test-shopify-inventory', async (req, res) => {
  const { shop } = req.query;
  
  try {
    // Here you would test Shopify API connection
    // For now, we'll simulate a successful test
    
    res.json({
      success: true,
      message: 'Shopify inventory connection test completed',
      result: {
        shop: shop,
        apiVersion: '2024-01',
        status: 'connected'
      }
    });
  } catch (error) {
    console.error('Shopify inventory test failed:', error);
    res.json({
      success: false,
      message: 'Shopify inventory connection test failed',
      error: error.message
    });
  }
});

// Sync inventory with Shopify endpoint
router.post('/sync-inventory', async (req, res) => {
  const { shop } = req.body;
  
  try {
    // Here you would sync inventory with Shopify
    // For now, we'll simulate the sync
    
    res.json({
      success: true,
      message: 'Inventory synced with Shopify',
      result: {
        syncedProducts: req.body.inventory?.length || 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Inventory sync failed:', error);
    res.json({
      success: false,
      message: 'Inventory sync failed',
      error: error.message
    });
  }
});

// Inventory endpoint - Shopify native inventory management
router.get('/inventory', async (req, res) => {
  try {
    res.json(shopifyInventoryData);
  } catch (error) {
    console.error('❌ [Inventory] Shopify inventory fetch failed:', error.message);
    res.status(500).json({
      error: 'Failed to fetch inventory data',
      message: error.message
    });
  }
});

// Update inventory endpoint
router.post('/inventory/update', async (req, res) => {
  const { productId, quantity } = req.body;
  
  try {
    
    
    // Here you would make actual Shopify API calls to update inventory
    // For now, we'll simulate the update
    
    res.json({
      success: true,
      message: `Product ${productId} inventory updated to ${quantity}`,
      productId,
      newQuantity: quantity,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [Inventory] Update failed:', error.message);
    res.status(500).json({
      error: 'Failed to update inventory',
      message: error.message
    });
  }
});

// Get inventory alerts
router.get('/inventory/alerts', async (req, res) => {
  try {
    res.json({
      alerts: inventoryAlerts,
      totalAlerts: inventoryAlerts.length,
      lastUpdated: new new file to handle all the API routes().toISOString()
    });
  } catch (error) {
    console.error('❌ [Inventory] Alerts fetch failed:', error.message);
    res.status(500).json({
      error: 'Failed to fetch alerts',
      message: error.message
    });
  }
});

// AI Copilot endpoint
router.get('/ai-copilot', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    res.json(aiCopilot);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Copilot chat endpoint
router.post('/ai-copilot/chat', async (req, res) => {
  try {
    const { message, shop } = req.body;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Mock AI response based on message content
    let response = "I'm here to help with your store optimization. How can I assist you today?";
    
    if (message.toLowerCase().includes('inventory')) {
      response = "I can help you optimize your inventory management. I notice you have 12 products running low on stock. Would you like me to generate a reorder report?";
    } else if (message.toLowerCase().includes('revenue') || message.toLowerCase().includes('sales')) {
      response = "Your revenue has increased by 15% this month. I recommend focusing on your top-performing products and considering product bundling to boost sales further.";
    } else if (message.toLowerCase().includes('customer')) {
      response = "I've analyzed your customer data and found opportunities for segmentation. Your repeat customers have 3x higher lifetime value. Consider implementing a loyalty program.";
    } else if (message.toLowerCase().includes('optimize') || message.toLowerCase().includes('improve')) {
      response = "I can help optimize your store in several ways: 1) Product recommendations, 2) Inventory management, 3) Pricing strategies, 4) Marketing automation. Which area interests you most?";
    }
    
    res.json({ 
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Plugins endpoint
router.get('/plugins', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    res.json(plugins);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Plugin toggle endpoint
router.post('/plugins/toggle', async (req, res) => {
  try {
    const { pluginId, enabled } = req.body;
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Mock response for plugin toggle
    res.json({
      success: true,
      pluginId: pluginId,
      enabled: enabled,
      message: `Plugin ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Accounting endpoint
router.get('/accounting', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    res.json(accounting);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- MOCK API ENDPOINTS FOR DASHBOARD ---
router.get('/api/analytics/ai', (req, res) => {
  res.json(analyticsAIResponse);
});

router.get('/api/analytics/inventory', (req, res) => {
  res.json(analyticsInventoryResponse);
});

router.get('/api/analytics/customer', (req, res) => {
  res.json(analyticsCustomerResponse);
});

router.get('/api/plugins/status', (req, res) => {
  res.json(pluginsStatusResponse);
});

export default router;
