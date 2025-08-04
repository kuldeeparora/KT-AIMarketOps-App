import { getEbayCredentials } from './credentials';

// Mock eBay API functions
async function fetchEbayInventory() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { sku: 'EBAY-001', name: 'iPhone 13 Pro', quantity: 15, price: 899.99 },
    { sku: 'EBAY-002', name: 'Samsung Galaxy S21', quantity: 22, price: 699.99 },
    { sku: 'EBAY-003', name: 'MacBook Air M1', quantity: 8, price: 999.99 }
  ];
}

async function getRealEbayProducts() {
  try {
    const credentials = await getEbayCredentials();
    
    // This would be a real eBay API call
    // const response = await ebayApi.getProducts(credentials);
    
    // For now, return mock data
    return [
      {
        sku: 'EBAY-001',
        name: 'iPhone 13 Pro (128GB)',
        description: 'Unlocked smartphone with A15 Bionic chip',
        price: 899.99,
        quantity: 15,
        category: 'Electronics',
        brand: 'Apple',
        rating: 4.7,
        reviews: 8900,
        image: 'https://m.media-amazon.com/images/I/61j02iMhZ9L._AC_SL1500_.jpg',
        features: [
          'A15 Bionic chip',
          'Pro camera system',
          '5G capable',
          'Face ID'
        ],
        specifications: {
    dimensions: '5.78" x 2.82" x 0.30"',
          weight: '7.19 oz',
          storage: '128GB',
          color: 'Sierra Blue'
  }
      },
      {
        sku: 'EBAY-002',
        name: 'Samsung Galaxy S21 Ultra',
        description: '5G smartphone with S Pen support',
        price: 699.99,
        quantity: 22,
        category: 'Electronics',
        brand: 'Samsung',
        rating: 4.5,
        reviews: 6700,
        image: 'https://m.media-amazon.com/images/I/71LJJrKbezL._AC_SL1500_.jpg',
        features: [
          'Exynos 2100 processor',
          '108MP camera',
          'S Pen support',
          '5G connectivity'
        ],
        specifications: {
    dimensions: '6.5" x 2.98" x 0.35"',
          weight: '8.96 oz',
          storage: '256GB',
          color: 'Phantom Black'
  }
      },
      {
        sku: 'EBAY-003',
        name: 'MacBook Air M1',
        description: '13-inch laptop with Apple M1 chip',
        price: 999.99,
        quantity: 8,
        category: 'Computers',
        brand: 'Apple',
        rating: 4.8,
        reviews: 12300,
        image: 'https://m.media-amazon.com/images/I/71vFKBpKakL._AC_SL1500_.jpg',
        features: [
          'Apple M1 chip',
          '13.3-inch Retina display',
          'Up to 18 hours battery',
          'Magic Keyboard'
        ],
        specifications: {
    dimensions: '11.97" x 8.36" x 0.63"',
          weight: '2.8 lbs',
          storage: '256GB SSD',
          memory: '8GB unified memory'
  }
      }
    ];
  } catch (error) {
    console.error('Error fetching eBay products:', error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    const products = await getRealEbayProducts();
    
    // Add marketplace-specific data
    return products.map(product => ({
      ...product,
      marketplace: 'eBay',
      marketplaceId: product.sku,
      fulfillmentType: 'FBM', // Fulfilled by Merchant
      sellerRating: 4.9,
      competitivePricing: {
    lowestPrice: product.price * 0.90,
        highestPrice: product.price * 1.20,
        averagePrice: product.price
  },
      performance: {
    salesRank: Math.floor(Math.random() * 500) + 1,
        conversionRate: (Math.random() * 0.08 + 0.03).toFixed(3),
        clickThroughRate: (Math.random() * 0.04 + 0.015).toFixed(3)
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
      orderId: 'ORD-EBAY-001',
      sku: 'EBAY-001',
      quantity: 1,
      date: '2025-01-27',
      status: 'Shipped',
      customer: 'Alex Johnson',
      total: 899.99,
      marketplace: 'eBay'
  },
    { 
      orderId: 'ORD-EBAY-002',
      sku: 'EBAY-002',
      quantity: 1,
      date: '2025-01-26',
      status: 'Delivered',
      customer: 'Maria Garcia',
      total: 699.99,
      marketplace: 'eBay'
  },
    { 
      orderId: 'ORD-EBAY-003',
      sku: 'EBAY-003',
      quantity: 1,
      date: '2025-01-25',
      status: 'Processing',
      customer: 'David Chen',
      total: 999.99,
      marketplace: 'eBay'
  },
    { 
      orderId: 'ORD-EBAY-004',
      sku: 'EBAY-001',
      quantity: 2,
      date: '2025-01-24',
      status: 'Shipped',
      customer: 'Sarah Wilson',
      total: 1799.98,
      marketplace: 'eBay'
  }
  ];
}

export async function getReviews() {
  // Enhanced review data with sentiment analysis
  return [
    {
      id: 1,
      sku: 'EBAY-001',
      rating: 5,
      comment: 'Excellent condition, fast shipping! iPhone works perfectly.',
      date: '2025-01-27',
      customer: 'Alex Johnson',
      sentiment: 'positive',
      helpful: 8
  },
    {
      id: 2,
      sku: 'EBAY-002',
      rating: 4,
      comment: 'Great phone, good price. Minor scratch on screen protector.',
      date: '2025-01-26',
      customer: 'Maria Garcia',
      sentiment: 'positive',
      helpful: 12
  },
    {
      id: 3,
      sku: 'EBAY-003',
      rating: 5,
      comment: 'Perfect MacBook! M1 chip is incredibly fast.',
      date: '2025-01-25',
      customer: 'David Chen',
      sentiment: 'positive',
      helpful: 18
  },
    {
      id: 4,
      sku: 'EBAY-001',
      rating: 4,
      comment: 'Good deal, phone as described. Would buy again.',
      date: '2025-01-24',
      customer: 'Sarah Wilson',
      sentiment: 'positive',
      helpful: 6
  },
    {
      id: 5,
      sku: 'EBAY-002',
      rating: 3,
      comment: 'Phone works but battery life could be better.',
      date: '2025-01-23',
      customer: 'Mike Brown',
      sentiment: 'neutral',
      helpful: 4
  }
  ];
}
