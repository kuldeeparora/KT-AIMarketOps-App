
export const shopifyOrders = {
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
};

export const shopifyProducts = {
  success: true,
  productCount: 120,
  updatedAt: new Date().toISOString()
};

export const shopifyCustomers = {
  success: true,
  customerCount: 876,
  updatedAt: new Date().toISOString()
};

export const shopifyTotalSales = {
  success: true,
  totalSales: 125000.50,
  updatedAt: new Date().toISOString()
};

export const analyticsAI = {
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
};

export const aiRecommendations = {
  success: true,
  recommendations: [
    { summary: 'Consider restocking Product A - low inventory detected' },
    { summary: 'High demand for Product B - increase stock levels' },
    { summary: 'Customer engagement is up 15% this month' },
    { summary: 'Consider running a promotion on Product C' },
    { summary: 'Order fulfillment time has improved by 20%' }
  ],
  updatedAt: new Date().toISOString()
};

export const shopifyAnalytics = {
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
};

export const securityAudit = {
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
};

export const performanceAudit = {
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
};

export const accessibilityAudit = {
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
};

export const dashboard = {
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

export const orders = {
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
};

export const legacyShopifyOrders = {
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
};

export const analytics = {
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

export const apiDashboard = {
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

export const seo = {
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

export const audit = {
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

export const shopifyInventoryData = {
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

export const inventoryAlerts = [
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

export const aiCopilot = {
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
};

export const plugins = {
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
};

export const accounting = {
  success: true,
  revenue: "45,230.50",
  expenses: "12,450.75",
  profit: "32,779.75",
  taxLiability: "8,194.94",
  period: "month",
  transactions: [
    {
      id: 1,
      type: "revenue",
      amount: "2,450.00",
      description: "Product sales",
      date: "2024-01-15"
    },
    {
      id: to handle all the mock data of the API endpoints.2,
      type: "expense",
      amount: "850.50",
      description: "Inventory costs",
      date: "2024-01-15"
    }
  ]
};

export const analyticsAIResponse = {
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
};

export const analyticsInventoryResponse = {
  data: {
    totalProducts: 320,
    lowStock: 8,
    performance: {
      restockRate: '95%',
      sellThrough: '80%'
    }
  }
};

export const analyticsCustomerResponse = {
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
};

export const pluginsStatusResponse = {
  data: [
    { name: 'smartops-ai', status: 'active' },
    { name: 'inventory-checker', status: 'active' },
    { name: 'seo-optimizer', status: 'active' },
    { name: 'customer-portal', status: 'active' },
    { name: 'accounting', status: 'active' }
  ]
};
