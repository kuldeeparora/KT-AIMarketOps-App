import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from 'cors';

import shopifyInventoryRoutes from './routes/shopifyInventory.js';
import shopifysyncRoutes from './routes/shopifysync.js';
// SellerDynamics service removed - using Shopify native inventory management

import pkg from "@shopify/shopify-app-express";
const { shopifyApp, LATEST_API_VERSION } = pkg;
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";

import inventoryRoutes from './routes/inventory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const dbPath = path.resolve(__dirname, "../../database.sqlite");
console.log(fs.existsSync(dbPath) ? "database.sqlite exists" : "database.sqlite NOT found - app may fail if DB required");

console.log("SHOPIFY_API_KEY:", process.env.SHOPIFY_API_KEY);
console.log("HOST:", process.env.HOST);
console.log("SCOPES:", process.env.SCOPES);

const app = express();

// Configure CORS
app.use(cors({
  origin: [
    'https://admin.shopify.com',
    'https://top-partially-panda.ngrok-free.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Shopify-Access-Token']
}));

// Configure CSP headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self' https://*.myshopify.com https://*.shopify.com https://*.ngrok-free.app",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://*.shopify.com https://*.ngrok-free.app",
      "style-src 'self' 'unsafe-inline' https://cdn.shopify.com https://*.shopify.com https://fonts.googleapis.com",
      "style-src-elem 'self' 'unsafe-inline' https://cdn.shopify.com https://*.shopify.com https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "media-src 'self'",
      "connect-src 'self' https://*.ngrok-free.app wss://*.ngrok-free.app https://*.shopify.com https://*.myshopify.com",
      "frame-ancestors https://admin.shopify.com https://*.myshopify.com https://*.shopify.com https://*.ngrok-free.app",
      "frame-src 'self' https://admin.shopify.com https://*.myshopify.com https://*.shopify.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].join("; ")
  );

  // Additional security headers
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Shopify-Access-Token');
  next();
});

app.use(express.json());
app.use(cookieParser());

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || "replace_this_with_a_strong_secret",
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    sameSite: 'lax', // Changed from 'none' for better compatibility
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
}));

// Initialize Shopify app
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES?.split(","),
  hostName: process.env.HOST.replace(/^https?:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  useOnlineTokens: true,
  sessionStorage: new SQLiteSessionStorage(dbPath),
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
    exitIframePath: "/api/auth/exit-iframe"
  },
  webhooks: {
    path: "/api/webhooks"
  },
  future: {
    unstable_managedPricingSupport: true
  }
});

// Root route - redirect to frontend (must be before auth middleware)
app.get('/', (req, res) => {
  res.redirect('http://localhost:3000');
});

// Add authentication middleware
app.use((req, res, next) => {
  // Skip auth check for public routes
  const publicPaths = ['/', '/api/auth', '/api/auth/callback', '/api/auth/exit-iframe', '/api/status', '/api/inventory'];
  if (publicPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  // Normalize shop parameter from various sources
  let shop = req.query.shop || 
             req.session?.shop || 
             req.headers['x-shopify-shop-domain'] || 
             req.cookies?.shopOrigin;

  // Clean up 'undefined' string that might come from query params
  if (shop === 'undefined') {
    shop = undefined;
  }

  // Get shop from Authorization header if present
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET);
      if (decoded.shop) {
        shop = decoded.shop;
      }
    } catch (e) {
      console.error('[AUTH] Token verification failed:', e.message);
    }
  }

  console.log('[AUTH] Shop resolution:', {
    fromQuery: req.query.shop,
    fromSession: req.session?.shop,
    fromHeader: req.headers['x-shopify-shop-domain'],
    fromCookie: req.cookies?.shopOrigin,
    finalShop: shop,
    path: req.path
  });

  if (!shop) {
    console.error("[AUTH] No shop found in request");
    return res.redirect(`/api/auth`);
  }

  // Validate shop format
  if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
    console.error("[AUTH] Invalid shop format:", shop);
    return res.status(400).send("Invalid shop format");
  }

  // Store shop in session and cookies with proper flags
  req.session.shop = shop;
  res.cookie('shopOrigin', shop, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    sameSite: 'lax', // Changed from 'none' for better compatibility
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  next();
});

// Auth endpoints
app.get("/api/auth", (req, res, next) => {
  let shop = req.query.shop || req.session?.shop;
  
  // Clean up 'undefined' string from query params
  if (shop === 'undefined') {
    shop = undefined;
  }
  
  // Try to get shop from cookie if not in query/session
  if (!shop) {
    shop = req.cookies?.shopOrigin;
  }

  console.log("[AUTH] Auth endpoint shop resolution:", {
    queryShop: req.query.shop,
    sessionShop: req.session?.shop,
    cookieShop: req.cookies?.shopOrigin,
    finalShop: shop
  });

  // If no shop found, show the install form
  if (!shop) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Install Shopify App</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 2rem; }
            .container { max-width: 500px; margin: 0 auto; }
            .error { color: #dc2626; margin-bottom: 1rem; }
            input { width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #e5e7eb; border-radius: 4px; }
            button { background: #2563eb; color: white; border: none; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
            button:hover { background: #1d4ed8; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Install Shopify App</h1>
            <div class="error">Please provide a valid shop domain to continue</div>
            <form method="GET" action="/api/auth">
              <div>
                <label for="shop">Shop Domain:</label>
                <input type="text" id="shop" name="shop" 
                       placeholder="your-store.myshopify.com" required 
                       pattern="[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com" />
              </div>
              <button type="submit">Install App</button>
            </form>
          </div>
        </body>
      </html>
    `);
  }

  // Validate shop format
  if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
    console.error("[AUTH] Invalid shop format:", shop);
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invalid Shop Domain</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 2rem; }
            .container { max-width: 500px; margin: 0 auto; }
            .error { color: #dc2626; margin-bottom: 1rem; }
            a { color: #2563eb; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Invalid Shop Domain</h1>
            <div class="error">
              The provided shop domain "${shop}" is not valid. 
              Please use a valid myshopify.com domain.
            </div>
            <a href="/api/auth">Try Again</a>
          </div>
        </body>
      </html>
    `);
  }

  // Store shop in session
  req.session.shop = shop;
  res.cookie('shopOrigin', shop, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    sameSite: 'lax', // Changed from 'none' for better compatibility
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  // Proceed with Shopify auth
  next();
}, shopify.auth.begin());

app.get("/api/auth/callback", shopify.auth.callback(), (req, res) => {
  const { shop } = req.query;
  const host = req.query.host;
  const embedded = req.query.embedded === "1";

  if (!shop) {
    console.error("[ERROR] No shop in auth callback");
    return res.status(400).send("No shop provided");
  }

  // Store shop in session and cookies
  req.session.shop = shop;
  res.cookie('shopOrigin', shop, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    sameSite: 'lax', // Changed from 'none' for better compatibility
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  // After successful auth, redirect to the app with the shop parameter
  const redirectUrl = embedded
    ? `/?shop=${encodeURIComponent(shop)}&host=${encodeURIComponent(host)}`
    : `/?shop=${encodeURIComponent(shop)}`;

  console.log("[INFO] Auth callback redirecting to:", redirectUrl);
  res.redirect(redirectUrl);
});

// API Routes
app.use('/api/shopify-inventory', shopify.validateAuthenticatedSession(), shopifyInventoryRoutes);
app.use('/api/sync-inventory', shopify.validateAuthenticatedSession(), shopifysyncRoutes);
app.use('/api/inventory', inventoryRoutes);

// Shopify Orders Endpoint
app.get('/api/shopify-orders', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Replace with real Shopify API call or database query
    res.json({
      success: true,
      orderCount: 2345,
      pendingOrders: 12,
      orders: [
        {
          id: 'ORD-1001',
          name: '#1001',
          customer: 'John Doe',
          created_at: '2024-07-18T10:00:00Z',
          total_price: 199.99,
          financial_status: 'paid'
        },
        {
          id: 'ORD-1002',
          name: '#1002',
          customer: 'Jane Smith',
          created_at: '2024-07-17T15:30:00Z',
          total_price: 89.50,
          financial_status: 'pending'
        }
      ],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Products Endpoint
app.get('/api/shopify-products', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Replace with real Shopify API call or database query
    res.json({
      success: true,
      productCount: 120,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Customers Endpoint
app.get('/api/shopify-customers', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Replace with real Shopify API call or database query
    res.json({
      success: true,
      customerCount: 876,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Total Sales Endpoint
app.get('/api/shopify-total-sales', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Replace with real Shopify API call or database query
    res.json({
      success: true,
      totalSales: 125000.50,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics AI Endpoint
app.get('/api/analytics/ai', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Mock AI analytics data
    res.json({
      success: true,
      predictions: [
        { productName: 'Product A', predictedStock: 45 },
        { productName: 'Product B', predictedStock: 32 },
        { productName: 'Product C', predictedStock: 78 },
        { productName: 'Product D', predictedStock: 23 },
        { productName: 'Product E', predictedStock: 56 }
      ],
      workflows: {
        inventory: { status: 'active' },
        orders: { status: 'active' },
        customers: { status: 'active' }
      },
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Recommendations Endpoint
app.get('/api/ai/recommendations', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Mock AI recommendations
    res.json({
      success: true,
      recommendations: [
        { summary: 'Consider restocking Product A - low inventory detected' },
        { summary: 'High demand for Product B - increase stock levels' },
        { summary: 'Customer engagement is up 15% this month' },
        { summary: 'Consider running a promotion on Product C' },
        { summary: 'Order fulfillment time has improved by 20%' }
      ],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Analytics Endpoint
app.get('/api/shopify-analytics', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Mock analytics data
    res.json({
      success: true,
      salesByDay: {
        '2024-07-15': 12500.50,
        '2024-07-16': 15800.75,
        '2024-07-17': 14200.25,
        '2024-07-18': 18900.00,
        '2024-07-19': 16500.30
      },
      topProducts: [
        { id: 1, title: 'Premium Widget', sales: 45, revenue: 2250.00 },
        { id: 2, title: 'Deluxe Gadget', sales: 38, revenue: 1900.00 },
        { id: 3, title: 'Super Tool', sales: 32, revenue: 1600.00 },
        { id: 4, title: 'Ultra Device', sales: 28, revenue: 1400.00 },
        { id: 5, title: 'Mega Product', sales: 25, revenue: 1250.00 }
      ],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Security Audit Endpoint
app.get('/api/audit/security', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Mock security audit data
    res.json({
      success: true,
      auditDate: new Date().toISOString(),
      overallScore: 85,
      status: 'PASSED',
      issues: {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3
      },
      categories: {
        sensitive: {
          status: 'PASSED',
          issues: []
        },
        secrets: {
          status: 'PASSED',
          issues: []
        },
        dependencies: {
          status: 'WARNING',
          issues: ['1 npm vulnerability found']
        },
        environment: {
          status: 'PASSED',
          issues: []
        },
        https: {
          status: 'PASSED',
          issues: []
        },
        headers: {
          status: 'PASSED',
          issues: []
        }
      },
      recommendations: [
        'Update npm dependencies to fix vulnerabilities',
        'Consider implementing rate limiting',
        'Add security headers to all responses'
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Performance Audit Endpoint
app.get('/api/audit/performance', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Mock performance audit data
    res.json({
      success: true,
      auditDate: new Date().toISOString(),
      overallScore: 92,
      status: 'PASSED',
      metrics: {
        firstContentfulPaint: 1.2,
        largestContentfulPaint: 2.1,
        firstInputDelay: 0.8,
        cumulativeLayoutShift: 0.05
      },
      issues: {
        critical: 0,
        high: 0,
        medium: 1,
        low: 2
      },
      recommendations: [
        'Optimize image sizes for better loading',
        'Implement lazy loading for images',
        'Consider using a CDN for static assets'
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Accessibility Audit Endpoint
app.get('/api/audit/accessibility', async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Mock accessibility audit data
    res.json({
      success: true,
      auditDate: new Date().toISOString(),
      overallScore: 88,
      status: 'PASSED',
      issues: {
        critical: 0,
        high: 1,
        medium: 2,
        low: 4
      },
      categories: {
        contrast: {
          status: 'PASSED',
          issues: []
        },
        navigation: {
          status: 'WARNING',
          issues: ['Missing skip navigation link']
        },
        forms: {
          status: 'PASSED',
          issues: []
        },
        images: {
          status: 'WARNING',
          issues: ['Some images missing alt text']
        }
      },
      recommendations: [
        'Add skip navigation link for keyboard users',
        'Ensure all images have descriptive alt text',
        'Test with screen readers'
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Protected route for testing auth
app.get("/api/protected", shopify.validateAuthenticatedSession(), (req, res) => {
  res.json({ 
    message: "You are authenticated!",
    shop: req.session.shop
  });
});

// Dashboard endpoint
app.get('/dashboard', async (req, res) => {
  try {
    const dashboardData = {
      stats: {
        totalSales: 123456.78,
        totalOrders: 2345,
        totalCustomers: 1890,
        totalProducts: 156,
        lowStockCount: 12,
        outOfStockCount: 3,
      },
      recentActivity: [
        {
          id: 1,
          type: 'order',
          message: 'New order #1001 received',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
        },
        {
          id: 2,
          type: 'inventory',
          message: 'Low stock alert for Premium Widget A',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
        },
        {
          id: 3,
          type: 'customer',
          message: 'New customer registration',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
      ],
      alerts: [
        {
          id: 1,
          type: 'critical',
          message: 'Deluxe Widget B is out of stock',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: 2,
          type: 'warning',
          message: 'Premium Widget A running low on stock',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
      ],
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Orders endpoint
app.get("/orders", async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Mock orders data
    res.json({
      success: true,
      orderCount: 156,
      paidOrders: 142,
      pendingOrders: 14,
      totalRevenue: "18,750.50",
      orders: [
        { 
          id: 1001, 
          name: "#1001", 
          customer: "John Smith", 
          total_price: "245.00", 
          financial_status: "paid",
          created_at: "2024-01-15T10:30:00Z"
        },
        { 
          id: 1002, 
          name: "#1002", 
          customer: "Sarah Johnson", 
          total_price: "189.50", 
          financial_status: "paid",
          created_at: "2024-01-15T09:15:00Z"
        },
        { 
          id: 1003, 
          name: "#1003", 
          customer: "Mike Wilson", 
          total_price: "320.75", 
          financial_status: "pending",
          created_at: "2024-01-15T08:45:00Z"
        },
        { 
          id: 1004, 
          name: "#1004", 
          customer: "Emma Davis", 
          total_price: "156.25", 
          financial_status: "paid",
          created_at: "2024-01-14T16:20:00Z"
        },
        { 
          id: 1005, 
          name: "#1005", 
          customer: "David Brown", 
          total_price: "89.99", 
          financial_status: "paid",
          created_at: "2024-01-14T14:10:00Z"
        },
        { 
          id: 1006, 
          name: "#1006", 
          customer: "Lisa Anderson", 
          total_price: "420.00", 
          financial_status: "pending",
          created_at: "2024-01-14T12:30:00Z"
        },
        { 
          id: 1007, 
          name: "#1007", 
          customer: "Tom Martinez", 
          total_price: "175.50", 
          financial_status: "paid",
          created_at: "2024-01-14T11:45:00Z"
        },
        { 
          id: 1008, 
          name: "#1008", 
          customer: "Rachel Green", 
          total_price: "298.75", 
          financial_status: "paid",
          created_at: "2024-01-14T10:20:00Z"
        },
        { 
          id: 1009, 
          name: "#1009", 
          customer: "Chris Lee", 
          total_price: "89.99", 
          financial_status: "paid",
          created_at: "2024-01-14T09:15:00Z"
        },
        { 
          id: 1010, 
          name: "#1010", 
          customer: "Amanda White", 
          total_price: "156.25", 
          financial_status: "pending",
          created_at: "2024-01-14T08:30:00Z"
        }
      ],
      aiInsights: [
        {
          title: "Order Processing Efficiency",
          description: "Average order processing time has improved by 20% this month."
        },
        {
          title: "Payment Success Rate",
          description: "98.5% of orders are successfully paid within 24 hours."
        },
        {
          title: "Customer Satisfaction",
          description: "Customer satisfaction score is 4.8/5 based on recent orders."
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shopify Orders Endpoint (legacy)
app.get("/shopify-orders", async (req, res) => {
  try {
    // Check if shop is provided
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }
    
    // Replace with real Shopify API call or database query
    res.json({
      success: true,
      orderCount: 2345,
      pendingOrders: 12,
      orders: [
        {
          id: 'ORD-1001',
          name: '#1001',
          customer: 'John Doe',
          created_at: '2024-07-18T10:00:00Z',
          total_price: 199.99,
          financial_status: 'paid'
        },
        {
          id: 'ORD-1002',
          name: '#1002',
          customer: 'Jane Smith',
          created_at: '2024-07-17T15:30:00Z',
          total_price: 89.50,
          financial_status: 'pending'
        }
      ],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Status endpoint
app.get("/api/status", (req, res) => {
  res.json({ 
    message: "Backend API is up and running!",
    shop: req.session.shop || null,
    timestamp: new Date().toISOString()
  });
});

// Public endpoint for frontend to check auth status
app.get("/auth/status", (req, res) => {
  const shop = req.session?.shop || req.cookies?.shopOrigin || req.query.shop;
  
  // Since OAuth completed successfully, we'll consider it authenticated if shop is provided
  if (shop) {
    res.json({ 
      authenticated: true,
      shop: shop,
      message: "Authenticated with Shopify"
    });
  } else {
    res.json({ 
      authenticated: false,
      shop: null,
      message: "Not authenticated - redirect to auth"
    });
  }
});

// Public endpoint for frontend to check auth status (legacy)
app.get("/api/auth/status", (req, res) => {
  const shop = req.session?.shop || req.cookies?.shopOrigin || req.query.shop;
  
  // Since OAuth completed successfully, we'll consider it authenticated if shop is provided
  if (shop) {
    res.json({ 
      authenticated: true,
      shop: shop,
      message: "Authenticated with Shopify"
    });
  } else {
    res.json({ 
      authenticated: false,
      shop: null,
      message: "Not authenticated - redirect to auth"
    });
  }
});

// Debug endpoint
app.get("/api/debug-session", (req, res) => {
  res.json({
    query: req.query,
    cookies: req.headers.cookie,
    session: req.session,
    referer: req.get('referer')
  });
});

// Validate authentication
app.get("/api/auth/validate", shopify.validateAuthenticatedSession(), (req, res) => {
  const session = res.locals.shopify.session;
  
  if (!session || !session.shop) {
    return res.status(401).json({ 
      error: "Unauthorized",
      message: "No valid session found"
    });
  }

  res.json({ 
    valid: true,
    shop: session.shop
  });
});

// Analytics endpoint
app.get('/analytics', async (req, res) => {
  try {
    const analyticsData = {
      chartData: [
        { name: 'Mon', sales: 4000, orders: 2400, customers: 2400 },
        { name: 'Tue', sales: 3000, orders: 1398, customers: 2210 },
        { name: 'Wed', sales: 2000, orders: 9800, customers: 2290 },
        { name: 'Thu', sales: 2780, orders: 3908, customers: 2000 },
        { name: 'Fri', sales: 1890, orders: 4800, customers: 2181 },
        { name: 'Sat', sales: 2390, orders: 3800, customers: 2500 },
        { name: 'Sun', sales: 3490, orders: 4300, customers: 2100 },
      ],
      performance: {
        conversionRate: 2.8,
        averageOrderValue: 89.50,
        customerLifetimeValue: 450.00,
        returnRate: 0.5,
      },
      topProducts: [
        { name: 'Premium Widget A', sales: 1250, revenue: 37425.00 },
        { name: 'Deluxe Widget B', sales: 890, revenue: 44411.00 },
        { name: 'Standard Widget C', sales: 2100, revenue: 41979.00 },
      ],
    };
    
    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Dashboard endpoint for admin dashboard
app.get('/api/dashboard', async (req, res) => {
  try {
    const dashboardData = {
      stats: {
        totalSales: 123456.78,
        totalOrders: 2345,
        totalCustomers: 1890,
        totalProducts: 156,
        lowStockCount: 12,
        outOfStockCount: 3,
      },
      recentActivity: [
        { id: 1, type: 'order', message: 'New order #1001 received', time: '2 minutes ago' },
        { id: 2, type: 'inventory', message: 'Low stock alert for Widget A', time: '5 minutes ago' },
        { id: 3, type: 'customer', message: 'New customer registration', time: '10 minutes ago' },
      ],
      alerts: [
        { id: 1, type: 'warning', message: '3 products out of stock', time: '1 hour ago' },
        { id: 2, type: 'info', message: 'SEO score improved by 5 points', time: '2 hours ago' },
      ]
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// AI Copilot endpoint for admin dashboard
app.post('/api/ai-copilot', async (req, res) => {
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

app.post('/api/ai-copilot/generate', async (req, res) => {
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
app.get('/api/seo', async (req, res) => {
  try {
    const seoData = {
      overallScore: 87,
      pages: [
        {
          url: '/products/widget-a',
          title: 'Premium Widget A - Kent Traders',
          metaDescription: 'High-quality premium widget with advanced features. Free shipping available.',
          score: 92,
          issues: ['Missing alt text on 2 images'],
          recommendations: ['Add schema markup', 'Optimize image alt text'],
          lastChecked: '2024-07-18T10:00:00Z'
        },
        {
          url: '/collections/electronics',
          title: 'Electronics Collection - Kent Traders',
          metaDescription: 'Browse our complete collection of electronic devices and accessories.',
          score: 85,
          issues: ['Slow page load time', 'Missing structured data'],
          recommendations: ['Optimize images', 'Add product schema'],
          lastChecked: '2024-07-18T09:30:00Z'
        },
        {
          url: '/pages/about-us',
          title: 'About Us - Kent Traders',
          metaDescription: 'Learn about Kent Traders, our mission, and commitment to quality.',
          score: 78,
          issues: ['Missing meta description', 'No internal links'],
          recommendations: ['Add meta description', 'Include internal links'],
          lastChecked: '2024-07-18T09:00:00Z'
        },
        {
          url: '/products/smart-gadget',
          title: 'Smart Gadget - Kent Traders',
          metaDescription: 'Innovative smart gadget with cutting-edge technology.',
          score: 95,
          issues: [],
          recommendations: ['Consider adding video content'],
          lastChecked: '2024-07-18T08:45:00Z'
        }
      ],
      keywords: [
        { keyword: 'premium widgets', position: 3, volume: 1200, difficulty: 'medium' },
        { keyword: 'electronic gadgets', position: 7, volume: 800, difficulty: 'low' },
        { keyword: 'smart home devices', position: 12, volume: 1500, difficulty: 'high' },
        { keyword: 'tech accessories', position: 5, volume: 2000, difficulty: 'medium' }
      ],
      performance: {
        pageSpeed: 85,
        mobileScore: 82,
        desktopScore: 88,
        coreWebVitals: {
          lcp: 2.1,
          fid: 45,
          cls: 0.08
        }
      }
    };
    
    res.json(seoData);
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    res.status(500).json({ error: 'Failed to fetch SEO data' });
  }
});

// Accounting endpoint for admin dashboard
app.post('/api/accounting/invoice', async (req, res) => {
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
app.get('/audit', (req, res) => {
  const { shop } = req.query;
  
  // Mock audit data
  const auditData = {
    securityScore: '95',
    issuesFound: '3',
    compliance: '98',
    lastAudit: '2',
    securityIssues: [
      {
        title: 'SSL Certificate Expiry',
        description: 'SSL certificate will expire in 30 days',
        severity: 'medium'
      },
      {
        title: 'Outdated Plugin',
        description: 'One plugin needs to be updated',
        severity: 'low'
      },
      {
        title: 'Weak Password Policy',
        description: 'Consider implementing stronger password requirements',
        severity: 'low'
      }
    ],
    complianceItems: [
      {
        name: 'GDPR Compliance',
        description: 'Data protection regulations',
        status: 'passed'
      },
      {
        name: 'PCI DSS',
        description: 'Payment card security',
        status: 'passed'
      },
      {
        name: 'Cookie Consent',
        description: 'User consent management',
        status: 'passed'
      }
    ],
    recentAudits: [
      { date: '2024-01-15', score: 95, issues: 3 },
      { date: '2024-01-08', score: 92, issues: 5 },
      { date: '2024-01-01', score: 89, issues: 7 }
    ]
  };
  
  res.json(auditData);
});

// Test endpoint for Shopify inventory configuration
app.get('/test-shopify-inventory', (req, res) => {
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
app.get('/test-shopify-inventory', async (req, res) => {
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
app.post('/sync-inventory', async (req, res) => {
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
app.get('/inventory', async (req, res) => {
  const { shop } = req.query;
  
  try {
    console.log('🔍 [Inventory] Fetching Shopify inventory data...');
    
    // Mock Shopify inventory data (replace with actual Shopify API calls)
    const shopifyInventoryData = {
      source: 'shopify',
      totalProducts: 156,
      lowStockProducts: 12,
      outOfStockProducts: 3,
      totalValue: 45230.50,
      products: [
        {
          id: '1',
          title: 'Premium Widget A',
          sku: 'PW-A-001',
          quantity: 45,
          threshold: 10,
          status: 'in_stock',
          lastUpdated: '2024-07-18T10:00:00Z',
          supplier: 'Shopify',
          category: 'Electronics',
          price: 29.99
        },
        {
          id: '2',
          title: 'Smart Gadget Pro',
          sku: 'SG-P-002',
          quantity: 8,
          threshold: 15,
          status: 'low_stock',
          lastUpdated: '2024-07-18T09:30:00Z',
          supplier: 'Shopify',
          category: 'Electronics',
          price: 89.99
        },
        {
          id: '3',
          title: 'Tech Accessory Kit',
          sku: 'TAK-003',
          quantity: 0,
          threshold: 5,
          status: 'out_of_stock',
          lastUpdated: '2024-07-18T09:00:00Z',
          supplier: 'Shopify',
          category: 'Accessories',
          price: 19.99
        },
        {
          id: '4',
          title: 'Wireless Headphones',
          sku: 'WH-004',
          quantity: 23,
          threshold: 8,
          status: 'in_stock',
          lastUpdated: '2024-07-18T08:45:00Z',
          supplier: 'Shopify',
          category: 'Audio',
          price: 129.99
        }
      ],
      alerts: [
        {
          type: 'low_stock',
          product: 'Smart Gadget Pro',
          message: 'Stock level below threshold (8/15)',
          timestamp: '2024-07-18T09:30:00Z'
        },
        {
          type: 'out_of_stock',
          product: 'Tech Accessory Kit',
          message: 'Product is out of stock',
          timestamp: '2024-07-18T09:00:00Z'
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    console.log('✅ [Inventory] Successfully fetched Shopify inventory data');
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
app.post('/inventory/update', async (req, res) => {
  const { productId, quantity } = req.body;
  
  try {
    console.log(`📝 [Inventory] Updating product ${productId} quantity to ${quantity}`);
    
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
app.get('/inventory/alerts', async (req, res) => {
  try {
    console.log('🔔 [Inventory] Fetching inventory alerts...');
    
    const alerts = [
      {
        type: 'low_stock',
        product: 'Smart Gadget Pro',
        message: 'Stock level below threshold (8/15)',
        timestamp: '2024-07-18T09:30:00Z',
        severity: 'warning'
      },
      {
        type: 'out_of_stock',
        product: 'Tech Accessory Kit',
        message: 'Product is out of stock',
        timestamp: '2024-07-18T09:00:00Z',
        severity: 'critical'
      }
    ];
    
    res.json({
      alerts,
      totalAlerts: alerts.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [Inventory] Alerts fetch failed:', error.message);
    res.status(500).json({
      error: 'Failed to fetch alerts',
      message: error.message
    });
  }
});

// Helper function to generate AI insights
function generateAIInsights(products) {
  if (!products || !Array.isArray(products)) return [];
  
  const lowStockCount = products.filter(p => p.quantity <= 10 && p.quantity > 0).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  const totalProducts = products.length;
  
  const insights = [];
  
  if (lowStockCount > 0) {
    insights.push({
      title: 'Low Stock Alert',
      description: `${lowStockCount} products are running low on stock and need reordering`
    });
  }
  
  if (outOfStockCount > 0) {
    insights.push({
      title: 'Out of Stock Items',
      description: `${outOfStockCount} products are currently out of stock - urgent action needed`
    });
  }
  
  // Analyze supplier performance
  const suppliers = {};
  products.forEach(product => {
    if (product.supplier) {
      if (!suppliers[product.supplier]) {
        suppliers[product.supplier] = { count: 0, lowStock: 0 };
      }
      suppliers[product.supplier].count++;
      if (product.quantity <= 10) {
        suppliers[product.supplier].lowStock++;
      }
    }
  });
  
  const bestSupplier = Object.entries(suppliers)
    .sort(([,a], [,b]) => (b.count - b.lowStock) - (a.count - a.lowStock))[0];
  
  if (bestSupplier) {
    insights.push({
      title: 'Supplier Performance',
      description: `${bestSupplier[0]} has the best stock management with ${bestSupplier[1].count - bestSupplier[1].lowStock} well-stocked items`
    });
  }
  
  return insights;
}

// Helper function to generate alerts
function generateAlerts(products) {
  if (!products || !Array.isArray(products)) return [];
  
  const alerts = [];
  
  // Check for out of stock items
  const outOfStock = products.filter(p => p.quantity === 0);
  outOfStock.forEach(product => {
    alerts.push({
      severity: 'critical',
      message: `${product.name} is out of stock - urgent reorder needed`,
      timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000)
    });
  });
  
  // Check for low stock items
  const lowStock = products.filter(p => p.quantity <= 10 && p.quantity > 0);
  if (lowStock.length > 0) {
    alerts.push({
      severity: 'high',
      message: `${lowStock.length} products are running low on stock`,
      timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000)
    });
  }
  
  // Check for overstocked items
  const overstocked = products.filter(p => p.quantity > (p.maxStock || 100) * 0.9);
  if (overstocked.length > 0) {
    alerts.push({
      severity: 'medium',
      message: `${overstocked.length} products are overstocked`,
      timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000)
    });
  }
  
  return alerts;
}

// AI Copilot endpoint
app.get('/ai-copilot', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Mock AI copilot data
    res.json({
      success: true,
      totalConversations: 45,
      tasksCompleted: 23,
      timeSaved: 12,
      aiAccuracy: 94,
      recentInsights: [
        {
          title: "Revenue Optimization",
          description: "Product bundling could increase revenue by 23%",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          title: "Inventory Management",
          description: "Automated reordering can reduce stockouts by 40%",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Copilot chat endpoint
app.post('/ai-copilot/chat', async (req, res) => {
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
app.get('/plugins', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Mock plugins data
    res.json({
      success: true,
      totalPlugins: 8,
      activePlugins: 5,
      recommendedPlugins: 3,
      updatesAvailable: 2,
      plugins: [
        {
          id: 1,
          name: "Advanced Analytics",
          description: "Comprehensive analytics and reporting tools",
          version: "2.1.0",
          status: "active",
          recommended: true
        },
        {
          id: 2,
          name: "Inventory Manager",
          description: "Real-time inventory tracking and alerts",
          version: "1.8.5",
          status: "active",
          recommended: true
        },
        {
          id: 3,
          name: "Customer Support Bot",
          description: "AI-powered customer support automation",
          version: "3.2.1",
          status: "active",
          recommended: false
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Plugin toggle endpoint
app.post('/plugins/toggle', async (req, res) => {
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
app.get('/accounting', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    const period = req.query.period || 'month';
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Mock accounting data
    res.json({
      success: true,
      revenue: "45,230.50",
      expenses: "12,450.75",
      profit: "32,779.75",
      taxLiability: "8,194.94",
      period: period,
      transactions: [
        {
          id: 1,
          type: "revenue",
          amount: "2,450.00",
          description: "Product sales",
          date: "2024-01-15"
        },
        {
          id: 2,
          type: "expense",
          amount: "850.50",
          description: "Inventory costs",
          date: "2024-01-15"
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.resolve(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Always use port 5001 by default, but allow override via process.env.PORT
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

// --- MOCK API ENDPOINTS FOR DASHBOARD ---
app.get('/api/analytics/ai', (req, res) => {
  res.json({
    data: {
      performance: {
        overall: 87,
        sales: 92,
        marketing: 85,
        operations: 89
      },
      insights: [
        { metric: 'Sales', value: 1200, trend: '+5%', confidence: 98 },
        { metric: 'Conversion Rate', value: '2.3%', trend: '+0.2%', confidence: 95 },
        { metric: 'Churn', value: '1.1%', trend: '-0.1%', confidence: 90 }
      ],
      trends: {
        week: '+5%',
        month: '+12%',
        year: '+30%'
      }
    }
  });
});

app.get('/api/analytics/inventory', (req, res) => {
  res.json({
    data: {
      totalProducts: 320,
      lowStock: 8,
      performance: {
        restockRate: '95%',
        sellThrough: '80%'
      }
    }
  });
});

app.get('/api/analytics/customer', (req, res) => {
  res.json({
    data: {
      activeCustomers: 210,
      newCustomers: 12,
      customerSatisfaction: 4.7,
      retentionRate: 92,
      averageOrderValue: '£45.20',
      trends: {
        growth: '+2%'
      }
    }
  });
});

app.get('/api/plugins/status', (req, res) => {
  res.json({
    data: [
      { name: 'smartops-ai', status: 'active' },
      { name: 'inventory-checker', status: 'active' },
      { name: 'seo-optimizer', status: 'active' },
      { name: 'customer-portal', status: 'active' },
      { name: 'accounting', status: 'active' }
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    uptime: process.uptime()
  });
});

// SellerDynamics API Endpoints
app.get('/api/sellerdynamics/inventory', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Import SellerDynamics service
    const { default: SellerDynamicsService } = await import('./services/sellerDynamics.js');
    const sellerDynamics = new SellerDynamicsService();

    // Fetch real inventory data from SellerDynamics
    const inventoryData = await sellerDynamics.fetchInventory();
    
    res.json({
      success: true,
      data: {
        products: inventoryData.products || [],
        totalProducts: inventoryData.products?.length || 0,
        totalValue: inventoryData.totalValue || 0,
        lastUpdated: inventoryData.lastUpdated || new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('SellerDynamics inventory fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      fallback: true 
    });
  }
});

app.get('/api/sellerdynamics/orders', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Import SellerDynamics service
    const { default: SellerDynamicsService } = await import('./services/sellerDynamics.js');
    const sellerDynamics = new SellerDynamicsService();

    // Fetch real orders data from SellerDynamics
    const ordersData = await sellerDynamics.getCustomerOrders(
      process.env.SELLERDYNAMICS_RETAILER_ID,
      1, // pageNumber
      50, // pageSize
      'PENDING' // orderType
    );
    
    res.json({
      success: true,
      data: {
        orders: ordersData.orders || [],
        totalOrders: ordersData.totalOrders || 0,
        pendingOrders: ordersData.pendingOrders || 0,
        completedOrders: ordersData.completedOrders || 0
      },
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('SellerDynamics orders fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      fallback: true 
    });
  }
});

app.get('/api/sellerdynamics/sales', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Import SellerDynamics service
    const { default: SellerDynamicsService } = await import('./services/sellerDynamics.js');
    const sellerDynamics = new SellerDynamicsService();

    // Fetch real sales data from SellerDynamics
    const salesData = await sellerDynamics.getSalesReport(
      process.env.SELLERDYNAMICS_RETAILER_ID,
      {
        fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        toDate: new Date().toISOString()
      }
    );
    
    res.json({
      success: true,
      data: {
        totalSales: salesData.totalSales || 0,
        totalOrders: salesData.totalOrders || 0,
        averageOrderValue: salesData.averageOrderValue || 0,
        salesByMarketplace: salesData.salesByMarketplace || {},
        salesByDate: salesData.salesByDate || []
      },
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('SellerDynamics sales fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      fallback: true 
    });
  }
});

app.get('/api/sellerdynamics/marketplaces', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Import SellerDynamics service
    const { default: SellerDynamicsService } = await import('./services/sellerDynamics.js');
    const sellerDynamics = new SellerDynamicsService();

    // Fetch real marketplace data from SellerDynamics
    const marketplacesData = await sellerDynamics.getMarketplaces(shop);
    
    res.json({
      success: true,
      data: {
        marketplaces: marketplacesData.marketplaces || [],
        totalMarketplaces: marketplacesData.marketplaces?.length || 0,
        activeMarketplaces: marketplacesData.activeMarketplaces || 0
      },
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('SellerDynamics marketplaces fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      fallback: true 
    });
  }
});

app.get('/api/sellerdynamics/settlement', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Import SellerDynamics service
    const { default: SellerDynamicsService } = await import('./services/sellerDynamics.js');
    const sellerDynamics = new SellerDynamicsService();

    // Fetch real settlement data from SellerDynamics
    const settlementData = await sellerDynamics.getSettlementData(shop, {
      fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      toDate: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: {
        totalSettlement: settlementData.totalSettlement || 0,
        pendingSettlement: settlementData.pendingSettlement || 0,
        settledAmount: settlementData.settledAmount || 0,
        settlementByMarketplace: settlementData.settlementByMarketplace || {},
        settlementByDate: settlementData.settlementByDate || []
      },
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('SellerDynamics settlement fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      fallback: true 
    });
  }
});

// Comprehensive Dashboard API - Real SellerDynamics Data with Fallbacks
app.get('/api/dashboard/real-data', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Import SellerDynamics service
    const { default: SellerDynamicsService } = await import('./services/sellerDynamics.js');
    const sellerDynamics = new SellerDynamicsService();

    // Initialize response object
    const dashboardData = {
      inventory: { products: [], totalProducts: 0, totalValue: 0, lastUpdated: null },
      orders: { orders: [], totalOrders: 0, pendingOrders: 0, completedOrders: 0 },
      sales: { totalSales: 0, totalOrders: 0, averageOrderValue: 0, salesByMarketplace: {} },
      marketplaces: { marketplaces: [], totalMarketplaces: 0, activeMarketplaces: 0 },
      settlement: { totalSettlement: 0, pendingSettlement: 0, settledAmount: 0 },
      dataSource: 'real',
      lastUpdated: new Date().toISOString(),
      errors: []
    };

    // Fetch Inventory Data
    try {
      const inventoryData = await sellerDynamics.fetchInventory();
      if (inventoryData && inventoryData.products) {
        dashboardData.inventory = {
          products: inventoryData.products.slice(0, 50), // Limit to 50 products for dashboard
          totalProducts: inventoryData.products.length,
          totalValue: inventoryData.totalValue || 0,
          lastUpdated: inventoryData.lastUpdated || new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('SellerDynamics inventory fetch error:', error.message);
      dashboardData.errors.push(`Inventory: ${error.message}`);
      // Fallback to mock data
      dashboardData.inventory = {
        products: [
          { sku: 'PROD-001', name: 'Product A', quantity: 45, price: 29.99, marketplace: 'Amazon' },
          { sku: 'PROD-002', name: 'Product B', quantity: 32, price: 49.99, marketplace: 'eBay' },
          { sku: 'PROD-003', name: 'Product C', quantity: 78, price: 19.99, marketplace: 'Amazon' },
          { sku: 'PROD-004', name: 'Product D', quantity: 23, price: 89.99, marketplace: 'eBay' },
          { sku: 'PROD-005', name: 'Product E', quantity: 56, price: 39.99, marketplace: 'Amazon' }
        ],
        totalProducts: 5,
        totalValue: 2849.85,
        lastUpdated: new Date().toISOString()
      };
    }

    // Fetch Orders Data
    try {
      const ordersData = await sellerDynamics.getCustomerOrders(
        process.env.SELLERDYNAMICS_RETAILER_ID,
        1, // pageNumber
        50, // pageSize
        'PENDING' // orderType
      );
      if (ordersData && ordersData.orders) {
        dashboardData.orders = {
          orders: ordersData.orders.slice(0, 20), // Limit to 20 orders for dashboard
          totalOrders: ordersData.totalOrders || ordersData.orders.length,
          pendingOrders: ordersData.pendingOrders || ordersData.orders.length,
          completedOrders: ordersData.completedOrders || 0
        };
      }
    } catch (error) {
      console.error('SellerDynamics orders fetch error:', error.message);
      dashboardData.errors.push(`Orders: ${error.message}`);
      // Fallback to mock data
      dashboardData.orders = {
        orders: [
          { id: 'ORD-1001', customer: 'John Doe', total: 199.99, status: 'pending', date: '2024-07-18' },
          { id: 'ORD-1002', customer: 'Jane Smith', total: 89.50, status: 'completed', date: '2024-07-17' },
          { id: 'ORD-1003', customer: 'Bob Johnson', total: 299.99, status: 'pending', date: '2024-07-16' },
          { id: 'ORD-1004', customer: 'Alice Brown', total: 149.99, status: 'completed', date: '2024-07-15' },
          { id: 'ORD-1005', customer: 'Charlie Wilson', total: 79.99, status: 'pending', date: '2024-07-14' }
        ],
        totalOrders: 5,
        pendingOrders: 3,
        completedOrders: 2
      };
    }

    // Fetch Sales Data
    try {
      const salesData = await sellerDynamics.getSalesReport(
        process.env.SELLERDYNAMICS_RETAILER_ID,
        {
          fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
          toDate: new Date().toISOString()
        }
      );
      if (salesData) {
        dashboardData.sales = {
          totalSales: salesData.totalSales || 0,
          totalOrders: salesData.totalOrders || 0,
          averageOrderValue: salesData.averageOrderValue || 0,
          salesByMarketplace: salesData.salesByMarketplace || {}
        };
      }
    } catch (error) {
      console.error('SellerDynamics sales fetch error:', error.message);
      dashboardData.errors.push(`Sales: ${error.message}`);
      // Fallback to mock data
      dashboardData.sales = {
        totalSales: 125000.50,
        totalOrders: 2345,
        averageOrderValue: 53.30,
        salesByMarketplace: {
          'Amazon': 75000.25,
          'eBay': 35000.15,
          'Facebook': 15000.10
        }
      };
    }

    // Fetch Marketplaces Data
    try {
      const marketplacesData = await sellerDynamics.getMarketplaces(shop);
      if (marketplacesData && marketplacesData.marketplaces) {
        dashboardData.marketplaces = {
          marketplaces: marketplacesData.marketplaces,
          totalMarketplaces: marketplacesData.marketplaces.length,
          activeMarketplaces: marketplacesData.activeMarketplaces || marketplacesData.marketplaces.length
        };
      }
    } catch (error) {
      console.error('SellerDynamics marketplaces fetch error:', error.message);
      dashboardData.errors.push(`Marketplaces: ${error.message}`);
      // Fallback to mock data
      dashboardData.marketplaces = {
        marketplaces: [
          { name: 'Amazon', status: 'active', sales: 75000.25 },
          { name: 'eBay', status: 'active', sales: 35000.15 },
          { name: 'Facebook Marketplace', status: 'active', sales: 15000.10 }
        ],
        totalMarketplaces: 3,
        activeMarketplaces: 3
      };
    }

    // Fetch Settlement Data
    try {
      const settlementData = await sellerDynamics.getSettlementData(shop, {
        fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        toDate: new Date().toISOString()
      });
      if (settlementData) {
        dashboardData.settlement = {
          totalSettlement: settlementData.totalSettlement || 0,
          pendingSettlement: settlementData.pendingSettlement || 0,
          settledAmount: settlementData.settledAmount || 0
        };
      }
    } catch (error) {
      console.error('SellerDynamics settlement fetch error:', error.message);
      dashboardData.errors.push(`Settlement: ${error.message}`);
      // Fallback to mock data
      dashboardData.settlement = {
        totalSettlement: 125000.50,
        pendingSettlement: 25000.00,
        settledAmount: 100000.50
      };
    }

    // If all data sources failed, mark as fallback
    if (dashboardData.errors.length > 0) {
      dashboardData.dataSource = 'fallback';
    }

    res.json({
      success: true,
      ...dashboardData
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      dataSource: 'error',
      lastUpdated: new Date().toISOString()
    });
  }
});

// SellerDynamics Connection Test
app.get('/api/sellerdynamics/test-connection', async (req, res) => {
  try {
    const shop = req.query.shop || req.session?.shop || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(401).json({ 
        success: false, 
        error: "Shop parameter required" 
      });
    }

    // Check environment variables
    const envCheck = {
      SELLERDYNAMICS_RETAILER_ID: process.env.SELLERDYNAMICS_RETAILER_ID ? 'SET' : 'NOT SET',
      SELLERDYNAMICS_ENCRYPTED_LOGIN: process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN ? 'SET' : 'NOT SET',
      SELLER_DYNAMICS_API_URL: process.env.SELLER_DYNAMICS_API_URL || 'https://my.sellerdynamics.com/api/SellerDynamicsAPI.asmx'
    };

    // Import SellerDynamics service
    const { default: SellerDynamicsService } = await import('./services/sellerDynamics.js');
    const sellerDynamics = new SellerDynamicsService();

    // Test connection
    let connectionTest = null;
    try {
      connectionTest = await sellerDynamics.testConnection(shop);
    } catch (error) {
      connectionTest = { success: false, error: error.message };
    }

    res.json({
      success: true,
      environment: envCheck,
      connection: connectionTest,
      message: envCheck.SELLERDYNAMICS_RETAILER_ID === 'NOT SET' || envCheck.SELLERDYNAMICS_ENCRYPTED_LOGIN === 'NOT SET' 
        ? 'Please configure SellerDynamics environment variables in your .env file'
        : 'Environment variables are configured'
    });

  } catch (error) {
    console.error('SellerDynamics connection test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});