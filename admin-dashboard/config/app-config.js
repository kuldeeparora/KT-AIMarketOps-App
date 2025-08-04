// Application Configuration
export const APP_CONFIG = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    timeout: 30000,
    retryAttempts: 3
  },

  // Data Refresh Configuration
  dataRefresh: {
    interval: 5 * 60 * 1000, // 5 minutes
    enabled: true
  },

  // Notification Configuration
  notifications: {
    enabled: true,
    maxNotifications: 10,
    autoDismiss: 5000 // 5 seconds
  },

  // Email Configuration
  email: {
    enabled: true,
    templates: {
      orderConfirmation: 'order_confirmation',
      lowStockAlert: 'low_stock_alert',
      dailyReport: 'daily_report',
      customerWelcome: 'customer_welcome'
    }
  },

  // Chart Configuration
  charts: {
    colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'],
    animation: true,
    responsive: true
  },

  // User Management
  userManagement: {
    roles: [
      { id: 'admin', name: 'Administrator', permissions: ['*'] },
      { id: 'manager', name: 'Manager', permissions: ['dashboard', 'inventory', 'orders', 'customers', 'analytics'] },
      { id: 'staff', name: 'Staff', permissions: ['dashboard', 'inventory', 'orders'] },
      { id: 'viewer', name: 'Viewer', permissions: ['dashboard'] }
    ]
  },

  // Feature Flags
  features: {
    realTimeNotifications: true,
    emailAutomation: true,
    advancedAnalytics: true,
    userManagement: true,
    dualDataSource: true,
    aiCopilot: true
  },

  // System Health
  health: {
    checkInterval: 30000, // 30 seconds
    endpoints: [
      '/api/shopify-inventory',
      '/api/orders',
      '/api/sellerdynamics'
    ]
  }
};

// Environment-specific configurations
export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      ...APP_CONFIG,
      debug: true,
      logLevel: 'debug'
    },
    production: {
      ...APP_CONFIG,
      debug: false,
      logLevel: 'error',
      dataRefresh: {
        ...APP_CONFIG.dataRefresh,
        interval: 10 * 60 * 1000 // 10 minutes in production
      }
    },
    test: {
      ...APP_CONFIG,
      debug: true,
      logLevel: 'warn',
      dataRefresh: {
        ...APP_CONFIG.dataRefresh,
        enabled: false
      }
    }
  };

  return configs[env] || configs.development;
};

export default getConfig(); 