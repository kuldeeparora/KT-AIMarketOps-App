import { getAmazonCredentials } from './credentials';

// Mock Amazon API functions
async function fetchAmazonInventory() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { sku: 'AMZ-001', name: 'Amazon Echo Dot', quantity: 45, price: 49.99 },
    { sku: 'AMZ-002', name: 'Fire TV Stick', quantity: 32, price: 39.99 },
    { sku: 'AMZ-003', name: 'Kindle Paperwhite', quantity: 28, price: 129.99 }
  ];
}

async function getRealAmazonProducts() {
  try {
    const credentials = await getAmazonCredentials();
    
    // This would be a real Amazon API call
    // const response = await amazonApi.getProducts(credentials);
    
    // For now, return mock data
    return [
      {
        sku: 'AMZ-001',
        name: 'Amazon Echo Dot (4th Gen)',
        description: 'Smart speaker with Alexa | Charcoal',
        price: 49.99,
        quantity: 45,
        category: 'Electronics',
        brand: 'Amazon',
        rating: 4.5,
        reviews: 12500,
        image: 'https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL1000_.jpg',
        features: [
          'Voice control your music',
          'Ask questions',
          'Set alarms and timers',
          'Control compatible smart home devices'
        ],
        specifications: {
    dimensions: '3.9" x 3.9" x 3.5"',
          weight: '12.1 oz',
          connectivity: 'Wi-Fi, Bluetooth',
          power: '15W power adapter'
  }
      },
      {
        sku: 'AMZ-002',
        name: 'Fire TV Stick 4K Max',
        description: 'Streaming device with Alexa Voice Remote',
        price: 39.99,
        quantity: 32,
        category: 'Electronics',
        brand: 'Amazon',
        rating: 4.3,
        reviews: 8900,
        image: 'https://m.media-amazon.com/images/I/51CgKGfMelL._AC_SL1000_.jpg',
        features: [
          '4K Ultra HD streaming',
          'Alexa Voice Remote',
          'Dolby Vision',
          'HDR10+ support'
        ],
        specifications: {
    dimensions: '3.7" x 1.5" x 0.5"',
          weight: '1.4 oz',
          connectivity: 'Wi-Fi 6, Bluetooth 5.0',
          storage: '8GB'
  }
      },
      {
        sku: 'AMZ-003',
        name: 'Kindle Paperwhite',
        description: '8GB, 6.8" display, adjustable warm light',
        price: 129.99,
        quantity: 28,
        category: 'Electronics',
        brand: 'Amazon',
        rating: 4.6,
        reviews: 15600,
        image: 'https://m.media-amazon.com/images/I/61eAq6gg-VL._AC_SL1500_.jpg',
        features: [
          '6.8" glare-free display',
          'Adjustable warm light',
          'Waterproof',
          'Weeks of battery life'
        ],
        specifications: {
    dimensions: '6.8" x 4.9" x 0.32"',
          weight: '7.23 oz',
          storage: '8GB',
          battery: 'Up to 10 weeks'
  }
      }
    ];
  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    const products = await getRealAmazonProducts();
    
    // Add marketplace-specific data
    return products.map(product => ({
      ...product,
      marketplace: 'Amazon',
      marketplaceId: product.sku,
      fulfillmentType: 'FBA', // Fulfilled by Amazon
      sellerRating: 4.8,
      competitivePricing: {
    lowestPrice: product.price * 0.95,
        highestPrice: product.price * 1.15,
        averagePrice: product.price
  },
      performance: {
    salesRank: Math.floor(Math.random() * 1000) + 1,
        conversionRate: (Math.random() * 0.1 + 0.05).toFixed(3),
        clickThroughRate: (Math.random() * 0.05 + 0.02).toFixed(3)
  }
    }));
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return [];
  }
}

export async function getOrders() {
  // Mock order data
  return [
    { 
      orderId: 'ORD-AMZ-001',
      sku: 'AMZ-001',
      quantity: 2,
      date: '2025-01-27',
      status: 'Shipped',
      customer: 'John Doe',
      total: 99.98,
      marketplace: 'Amazon'
  },
    { 
      orderId: 'ORD-AMZ-002',
      sku: 'AMZ-002',
      quantity: 1,
      date: '2025-01-26',
      status: 'Delivered',
      customer: 'Jane Smith',
      total: 39.99,
      marketplace: 'Amazon'
  },
    { 
      orderId: 'ORD-AMZ-003',
      sku: 'AMZ-003',
      quantity: 1,
      date: '2025-01-25',
      status: 'Processing',
      customer: 'Mike Johnson',
      total: 129.99,
      marketplace: 'Amazon'
  },
    { 
      orderId: 'ORD-AMZ-004',
      sku: 'AMZ-001',
      quantity: 3,
      date: '2025-01-24',
      status: 'Shipped',
      customer: 'Sarah Wilson',
      total: 149.97,
      marketplace: 'Amazon'
  }
  ];
}

export async function getReviews() {
  // Enhanced review data with sentiment analysis
  return [
    {
      id: 1,
      sku: 'AMZ-001',
      rating: 5,
      comment: 'Great product, excellent sound quality! Alexa works perfectly.',
      date: '2025-01-27',
      customer: 'John Doe',
      sentiment: 'positive',
      helpful: 12
  },
    {
      id: 2,
      sku: 'AMZ-001',
      rating: 4,
      comment: 'Good value for money, easy to set up. Minor connectivity issues.',
      date: '2025-01-26',
      customer: 'Jane Smith',
      sentiment: 'positive',
      helpful: 8
  },
    {
      id: 3,
      sku: 'AMZ-002',
      rating: 4,
      comment: 'Works perfectly with my TV. Great streaming quality.',
      date: '2025-01-25',
      customer: 'Mike Johnson',
      sentiment: 'positive',
      helpful: 15
  },
    {
      id: 4,
      sku: 'AMZ-003',
      rating: 5,
      comment: 'Love my Kindle! Battery life is amazing, screen is perfect for reading.',
      date: '2025-01-24',
      customer: 'Sarah Wilson',
      sentiment: 'positive',
      helpful: 23
  },
    {
      id: 5,
      sku: 'AMZ-002',
      rating: 3,
      comment: 'Decent product but remote could be better designed.',
      date: '2025-01-23',
      customer: 'David Brown',
      sentiment: 'neutral',
      helpful: 5
  }
  ];
}
