import axios from 'axios';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { getInMemoryDatabase } from './shared-database.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const endpoint = process.env.SELLERDYNAMICS_SOAP_ENDPOINT;
    const encryptedLogin = process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN;
    const retailerId = process.env.SELLERDYNAMICS_RETAILER_ID;
    const pageSize = process.env.SELLERDYNAMICS_PAGE_SIZE
      ? parseInt(process.env.SELLERDYNAMICS_PAGE_SIZE)
      : 1000;
    const maxPages = process.env.SELLERDYNAMICS_MAX_PAGES
      ? parseInt(process.env.SELLERDYNAMICS_MAX_PAGES)
      : 100;
    const useMock = process.env.USE_MOCK_SELLERDYNAMICS !== 'false';

    // If mock data is enabled or credentials are missing, return enhanced mock data
    if (useMock || !endpoint || !encryptedLogin || !retailerId) {
      console.log('[SellerDynamics] Using enhanced mock data');
      const mockData = getEnhancedMockSellerDynamicsData();
      return res.status(200).json({
        stockLevels: mockData,
        meta: {
          hasData: true,
          isArray: true,
          length: mockData.length,
          type: 'array',
          firstItem:
            mockData.length > 0
              ? { sku: mockData[0].sku, productName: mockData[0].productName }
              : null,
          dataSource: 'mock',
          lastUpdated: new Date().toISOString(),
          note: useMock ? 'Mock data enabled' : 'Missing SellerDynamics credentials'
        }
      });
    }

    // Fetch real data from SellerDynamics API
    console.log('[SellerDynamics] Fetching real data from API...');
    let allStockLevels = [];
    let currentPage = 1;
    let hasMoreData = true;
    const headers = {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'https://my.sellerdynamics.com/GetStockLevels'
    };

    console.log(
      `[SellerDynamics] Starting to fetch all products (max ${maxPages} pages, ${pageSize} per page)`
    );

    while (hasMoreData && currentPage <= maxPages) {
      try {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetStockLevels xmlns="https://my.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
      <pageNumber>${currentPage}</pageNumber>
      <pageSize>${pageSize}</pageSize>
    </GetStockLevels>
  </soap:Body>
</soap:Envelope>`;

        console.log(`[SellerDynamics] Fetching page ${currentPage}...`);

        const response = await axios.post(endpoint, xml, {
          headers,
          timeout: 60000
        });

        const pageStockLevels = await parseSellerDynamicsResponse(response.data);

        if (pageStockLevels && pageStockLevels.length > 0) {
          allStockLevels = allStockLevels.concat(pageStockLevels);
          console.log(
            `[SellerDynamics] Page ${currentPage}: ${pageStockLevels.length} products (Total: ${allStockLevels.length})`
          );

          if (pageStockLevels.length < pageSize) {
            hasMoreData = false;
            console.log(
              `[SellerDynamics] Reached end of data (page ${currentPage} had ${pageStockLevels.length} items, less than pageSize ${pageSize})`
            );
          }
        } else {
          hasMoreData = false;
          console.log(`[SellerDynamics] Page ${currentPage} returned no data, stopping`);
        }

        currentPage++;

        if (hasMoreData) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (err) {
        console.error(
          `[SellerDynamics] Error fetching page ${currentPage}:`,
          err?.response?.data || err.message
        );

        if (currentPage === 1) {
          console.log('[SellerDynamics] First page failed, falling back to enhanced mock data');
          const fallbackData = getEnhancedMockSellerDynamicsData();
          return res.status(200).json({
            stockLevels: fallbackData,
            meta: {
              hasData: true,
              isArray: true,
              length: fallbackData.length,
              type: 'array',
              firstItem:
                fallbackData.length > 0
                  ? { sku: fallbackData[0].sku, productName: fallbackData[0].productName }
                  : null,
              dataSource: 'fallback',
              error: 'SOAP request failed, using enhanced mock data',
              details: err?.response?.data || err.message
            }
          });
        } else {
          console.log(`[SellerDynamics] Stopping pagination due to error on page ${currentPage}`);
          break;
        }
      }
    }

    console.log(
      `[SellerDynamics] Completed fetching: ${allStockLevels.length} total products from ${currentPage - 1} pages`
    );

    const meta = {
      hasData: !!allStockLevels.length,
      isArray: Array.isArray(allStockLevels),
      length: allStockLevels.length,
      type: typeof allStockLevels,
      firstItem: allStockLevels[0],
      dataSource: 'real',
      lastUpdated: new Date().toISOString(),
      pagesFetched: currentPage - 1
    };

    res.status(200).json({ stockLevels: allStockLevels, meta });
  } catch (error) {
    console.error('[SellerDynamics] Handler error:', error.message);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

async function parseSellerDynamicsResponse(xmlString) {
  try {
    // Parse the XML response using xml2js approach
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser({ explicitArray: false });

    let result;
    try {
      result = await parser.parseStringPromise(xmlString);
    } catch (parseError) {
      console.error('XML parsing failed:', parseError.message);
      return [];
    }

    // Extract and normalize response
    let body;
    try {
      body = result['soap:Envelope']['soap:Body']['GetStockLevelsResponse']['GetStockLevelsResult'];
    } catch (e) {
      console.error('Error parsing SOAP response structure:', e);
      return [];
    }

    if (body.IsError === 'true') {
      console.log('SellerDynamics API returned error:', body.ErrorMessage || 'Unknown error');
      return [];
    }

    let stockLevels = [];
    if (body.StockLevels && (body.StockLevels.StockLevel || body.StockLevels.StockLevelItem)) {
      // Handle both StockLevel and StockLevelItem structures
      const stockLevelData = body.StockLevels.StockLevelItem || body.StockLevels.StockLevel;
      const stockLevelArray = Array.isArray(stockLevelData) ? stockLevelData : [stockLevelData];

      stockLevels = stockLevelArray.map((s, index) => {
        const productName = (s.ProductName || s.ProductTitle || s.Title || s.SKU).trim();
        const sku = s.SKU;

        // Identify master products based on patterns
        const isMasterProduct = identifyMasterProduct(productName, sku);

        return {
          sku: sku,
          currentStock: Number(s.Quantity) || 0,
          productName: productName,
          vendor: s.Vendor || s.Supplier || s.Brand || 'Unknown Vendor',
          price: Number(s.Price) || Number(s.UnitPrice) || 0,
          cost: Number(s.Cost) || Number(s.UnitCost) || 0,
          category: s.ProductType || s.Category || s.Type || 'General',
          lastUpdated: s.CreatedAt || s.DateCreated || new Date().toISOString(),
          allocatedStock: Number(s.QuantityAllocated) || Number(s.AllocatedQuantity) || 0,
          availableStock:
            (Number(s.Quantity) || 0) -
            (Number(s.QuantityAllocated) || Number(s.AllocatedQuantity) || 0),
          reorderPoint: 10, // Default value
          isMasterProduct: isMasterProduct,
          productType: isMasterProduct ? 'Master Product' : 'Kit Product'
        };
      });
    }

    return stockLevels;
  } catch (error) {
    console.error('Error parsing SellerDynamics response:', error);
    return [];
  }
}

// Function to identify master products based on patterns
function identifyMasterProduct(productName, sku) {
  if (!productName || !sku) return false;

  const name = productName.toLowerCase();
  const skuLower = sku.toLowerCase();

  // Master product indicators
  const masterProductPatterns = [
    // BG-EVOLVE series (master products)
    /bg-evolve/i,
    // BG-NEXUS series (master products)
    /bg-nexus/i,
    // Custom appliance switches (master products)
    /custom-appliance/i,
    // WAGO connectors (master products)
    /wago.*connector/i,
    // Grid switches (master products)
    /grid-switch/i,
    // Base products without quantity indicators
    /^[a-z]+-[a-z]+-[a-z]+$/i,
    // Products without "X" quantity indicators
    /^(?!.*\dx).*$/i
  ];

  // Kit product indicators (products that are NOT master products)
  const kitProductPatterns = [
    // Products with quantity indicators like "10X", "25X"
    /\d+x/i,
    // Products with specific quantity patterns
    /^\d+x.*$/i,
    // Products with quantity indicators after dash (like "51253135-10", "51253135-2")
    // But exclude base products like "Wago-51253135"
    /^(?!.*wago).*-\d+$/i,
    // Products that are clearly kits
    /kit/i,
    /bundle/i,
    /pack/i
  ];

  // Check if it matches kit patterns first
  for (const pattern of kitProductPatterns) {
    if (pattern.test(name) || pattern.test(skuLower)) {
      return false; // This is a kit product
    }
  }

  // Check if it matches master product patterns
  for (const pattern of masterProductPatterns) {
    if (pattern.test(name) || pattern.test(skuLower)) {
      return true; // This is a master product
    }
  }

  // Default logic: if product name doesn't contain quantity indicators, it's likely a master product
  const hasQuantityIndicator = /\d+x/i.test(name) || /\d+x/i.test(skuLower);
  return !hasQuantityIndicator;
}

// Enhanced function to identify master products using SellerDynamics data structure
function identifyMasterProductFromSD(productName, sku, isKit, goodId) {
  // If we have explicit IsKit flag from SellerDynamics, use it
  if (isKit !== undefined) {
    return !isKit; // Master product = !IsKit
  }

  // Fallback to pattern-based identification
  return identifyMasterProduct(productName, sku);
}

async function getDatabaseSellerDynamicsData() {
  try {
    console.log('Fetching data from SellerDynamics database...');

    // In a real implementation, this would be:
    // - Connect to SellerDynamics database
    // - Execute SELECT query
    // - Return formatted data

    // Simulate database query
    const dbQuery = `
      SELECT 
        sku,
        product_name,
        stock_level,
        cost_price,
        is_kit,
        good_id,
        category,
        vendor,
        reorder_point,
        last_updated
      FROM products 
      WHERE active = true
      ORDER BY product_name
      LIMIT 1000
    `;

    console.log('Simulated Database Query:', dbQuery);

    // In-memory database simulation
    // In a real implementation, this would be a persistent database
    const dbProducts = getInMemoryDatabase();

    return dbProducts.map(product => {
      const isMasterProduct = identifyMasterProductFromSD(
        product.product_name,
        product.sku,
        product.is_kit,
        product.good_id
      );

      return {
        id: `SD-${product.sku}`,
        productName: product.product_name,
        sku: product.sku,
        category: product.category,
        vendor: product.vendor,
        currentStock: product.stock_level,
        allocatedStock: 0,
        availableStock: product.stock_level,
        cost: product.cost_price,
        price: product.cost_price * 1.5, // 50% markup
        reorderPoint: product.reorder_point,
        turnoverRate: 0.85,
        daysInStock: 15,
        lastUpdated: product.last_updated,
        supplier: {
          id: `supplier-${product.vendor.toLowerCase()}`,
          name: product.vendor,
          contact: '+44 20 1234 5678'
        },
        location: {
          warehouse: 'Main Warehouse',
          aisle: 'A-12',
          shelf: 'S-05'
        },
        metadata: {
          weight: '0.5kg',
          dimensions: '20x15x8cm',
          barcode: '1234567890123',
          tags: ['general']
        },
        isMasterProduct,
        productType: isMasterProduct ? 'Master Product' : 'Kit Product',
        isKit: product.is_kit,
        goodId: product.good_id
      };
    });
  } catch (error) {
    console.error('Error reading database data:', error);
    return getMockSellerDynamicsData();
  }
}

function getMockSellerDynamicsData() {
  const mockProducts = [
    {
      sku: 'SD-001',
      productName: 'Premium Wireless Headphones',
      currentStock: 45,
      allocatedStock: 5,
      availableStock: 40,
      reorderPoint: 10,
      lastUpdated: new Date().toISOString(),
      price: 159.99,
      cost: 89.5,
      vendor: 'AudioTech Ltd',
      category: 'Electronics'
    },
    {
      sku: 'SD-002',
      productName: 'Bluetooth Speaker Pro',
      currentStock: 23,
      allocatedStock: 2,
      availableStock: 21,
      reorderPoint: 15,
      lastUpdated: new Date().toISOString(),
      price: 89.99,
      cost: 45.25,
      vendor: 'SoundMaster Inc',
      category: 'Electronics'
    },
    {
      sku: 'SD-003',
      productName: 'USB-C Cable 6ft',
      currentStock: 5,
      allocatedStock: 0,
      availableStock: 5,
      reorderPoint: 25,
      lastUpdated: new Date().toISOString(),
      price: 12.99,
      cost: 6.5,
      vendor: 'CableCo',
      category: 'Accessories'
    },
    {
      sku: 'SD-004',
      productName: 'Gourmet Coffee Beans',
      currentStock: 0,
      allocatedStock: 0,
      availableStock: 0,
      reorderPoint: 15,
      lastUpdated: new Date().toISOString(),
      price: 24.99,
      cost: 12.75,
      vendor: 'CoffeeCorp',
      category: 'Food & Beverage'
    },
    {
      sku: 'SD-005',
      productName: 'Organic Tea Selection',
      currentStock: 12,
      allocatedStock: 1,
      availableStock: 11,
      reorderPoint: 8,
      lastUpdated: new Date().toISOString(),
      price: 18.99,
      cost: 9.5,
      vendor: 'TeaTime Ltd',
      category: 'Food & Beverage'
    },
    {
      sku: 'SD-006',
      productName: 'Smartphone Case Premium',
      currentStock: 67,
      allocatedStock: 3,
      availableStock: 64,
      reorderPoint: 20,
      lastUpdated: new Date().toISOString(),
      price: 29.99,
      cost: 15.0,
      vendor: 'CasePro Inc',
      category: 'Accessories'
    },
    {
      sku: 'SD-007',
      productName: 'Wireless Charging Pad',
      currentStock: 34,
      allocatedStock: 1,
      availableStock: 33,
      reorderPoint: 12,
      lastUpdated: new Date().toISOString(),
      price: 49.99,
      cost: 25.0,
      vendor: 'ChargeTech',
      category: 'Electronics'
    },
    {
      sku: 'SD-008',
      productName: 'Portable Power Bank 10000mAh',
      currentStock: 28,
      allocatedStock: 2,
      availableStock: 26,
      reorderPoint: 15,
      lastUpdated: new Date().toISOString(),
      price: 39.99,
      cost: 20.0,
      vendor: 'PowerSolutions',
      category: 'Electronics'
    },
    {
      sku: 'SD-009',
      productName: 'Mechanical Keyboard RGB',
      currentStock: 15,
      allocatedStock: 0,
      availableStock: 15,
      reorderPoint: 10,
      lastUpdated: new Date().toISOString(),
      price: 129.99,
      cost: 65.0,
      vendor: 'KeyboardPro',
      category: 'Electronics'
    },
    {
      sku: 'SD-010',
      productName: 'Gaming Mouse Wireless',
      currentStock: 42,
      allocatedStock: 4,
      availableStock: 38,
      reorderPoint: 18,
      lastUpdated: new Date().toISOString(),
      price: 79.99,
      cost: 40.0,
      vendor: 'GamingGear Ltd',
      category: 'Electronics'
    },
    {
      sku: 'SD-011',
      productName: '4K Webcam Pro',
      currentStock: 8,
      allocatedStock: 1,
      availableStock: 7,
      reorderPoint: 12,
      lastUpdated: new Date().toISOString(),
      price: 199.99,
      cost: 100.0,
      vendor: 'VideoTech',
      category: 'Electronics'
    },
    {
      sku: 'SD-012',
      productName: 'Ergonomic Office Chair',
      currentStock: 0,
      allocatedStock: 0,
      availableStock: 0,
      reorderPoint: 5,
      lastUpdated: new Date().toISOString(),
      price: 299.99,
      cost: 150.0,
      vendor: 'OfficeFurniture Co',
      category: 'Furniture'
    },
    {
      sku: 'SD-013',
      productName: 'Standing Desk Converter',
      currentStock: 19,
      allocatedStock: 2,
      availableStock: 17,
      reorderPoint: 8,
      lastUpdated: new Date().toISOString(),
      price: 149.99,
      cost: 75.0,
      vendor: 'DeskSolutions',
      category: 'Furniture'
    },
    {
      sku: 'SD-014',
      productName: 'LED Desk Lamp USB-C',
      currentStock: 31,
      allocatedStock: 1,
      availableStock: 30,
      reorderPoint: 15,
      lastUpdated: new Date().toISOString(),
      price: 59.99,
      cost: 30.0,
      vendor: 'LightingPro',
      category: 'Home & Office'
    },
    {
      sku: 'SD-015',
      productName: 'Noise Cancelling Earbuds',
      currentStock: 55,
      allocatedStock: 3,
      availableStock: 52,
      reorderPoint: 20,
      lastUpdated: new Date().toISOString(),
      price: 179.99,
      cost: 90.0,
      vendor: 'AudioTech Ltd',
      category: 'Electronics'
    }
  ];

  // Generate additional mock products to simulate a larger dataset
  const additionalProducts = [];
  const productNames = {
    Electronics: [
      'Smartphone',
      'Laptop',
      'Tablet',
      'Smartwatch',
      'Headphones',
      'Speaker',
      'Camera',
      'Monitor',
      'Keyboard',
      'Mouse',
      'Webcam',
      'Microphone',
      'Printer',
      'Scanner',
      'Router'
    ],
    Accessories: [
      'Phone Case',
      'Laptop Bag',
      'Charging Cable',
      'Power Bank',
      'Screen Protector',
      'Stylus Pen',
      'USB Hub',
      'Memory Card',
      'External Drive',
      'Bluetooth Adapter',
      'Car Charger',
      'Desk Organizer'
    ],
    'Home & Office': [
      'Desk Lamp',
      'Office Chair',
      'Filing Cabinet',
      'Whiteboard',
      'Stapler',
      'Paper Shredder',
      'Calculator',
      'Notebook',
      'Pen Set',
      'Desk Calendar',
      'Plant Pot',
      'Wall Clock'
    ],
    Furniture: [
      'Coffee Table',
      'Bookshelf',
      'Dining Chair',
      'Bed Frame',
      'Wardrobe',
      'Sofa',
      'Dresser',
      'Nightstand',
      'TV Stand',
      'Bar Stool',
      'Folding Table',
      'Storage Cabinet'
    ],
    'Food & Beverage': [
      'Coffee Beans',
      'Tea Leaves',
      'Organic Honey',
      'Olive Oil',
      'Spice Set',
      'Chocolate Bar',
      'Nuts Mix',
      'Dried Fruits',
      'Herbal Tea',
      'Maple Syrup',
      'Balsamic Vinegar',
      'Sea Salt'
    ],
    Clothing: [
      'T-Shirt',
      'Jeans',
      'Hoodie',
      'Dress Shirt',
      'Sweater',
      'Jacket',
      'Pants',
      'Skirt',
      'Socks',
      'Underwear',
      'Scarf',
      'Hat',
      'Belt',
      'Tie',
      'Gloves'
    ],
    Sports: [
      'Running Shoes',
      'Yoga Mat',
      'Dumbbells',
      'Tennis Racket',
      'Basketball',
      'Soccer Ball',
      'Gym Bag',
      'Water Bottle',
      'Resistance Bands',
      'Jump Rope',
      'Foam Roller',
      'Sports Watch'
    ],
    Books: [
      'Novel',
      'Textbook',
      'Cookbook',
      'Biography',
      'Self-Help',
      'Travel Guide',
      'Poetry',
      'History Book',
      'Science Fiction',
      'Mystery',
      'Romance',
      "Children's Book"
    ]
  };

  for (let i = 16; i <= 100; i++) {
    const categories = [
      'Electronics',
      'Accessories',
      'Home & Office',
      'Furniture',
      'Food & Beverage',
      'Clothing',
      'Sports',
      'Books'
    ];
    const vendors = [
      'TechCorp',
      'HomeGoods',
      'SportsPro',
      'FashionCo',
      'BookWorld',
      'KitchenEssentials',
      'GardenSupplies',
      'PetCare'
    ];

    const category = categories[Math.floor(Math.random() * categories.length)];
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const price = Math.floor(Math.random() * 200) + 10;
    const cost = price * 0.5;
    const stock = Math.floor(Math.random() * 100);
    const allocated = Math.floor(Math.random() * 10);

    // Get a random product name from the category
    const categoryProducts = productNames[category] || ['Item'];
    const productName = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];

    const isMasterProduct = identifyMasterProduct(
      `${productName} ${i}`,
      `SD-${i.toString().padStart(3, '0')}`
    );

    additionalProducts.push({
      sku: `SD-${i.toString().padStart(3, '0')}`,
      productName: `${productName} ${i}`,
      currentStock: stock,
      allocatedStock: allocated,
      availableStock: stock - allocated,
      reorderPoint: Math.floor(Math.random() * 20) + 5,
      lastUpdated: new Date().toISOString(),
      price: price,
      cost: cost,
      vendor: vendor,
      category: category,
      isMasterProduct: isMasterProduct,
      productType: isMasterProduct ? 'Master Product' : 'Kit Product'
    });
  }

  // Add master product identification to existing mock products
  const mockProductsWithTypes = mockProducts.map(product => {
    const isMasterProduct = identifyMasterProduct(product.productName, product.sku);
    return {
      ...product,
      isMasterProduct: isMasterProduct,
      productType: isMasterProduct ? 'Master Product' : 'Kit Product'
    };
  });

  return [...mockProductsWithTypes, ...additionalProducts];
}

// Enhanced mock data with more realistic SellerDynamics products
function getEnhancedMockSellerDynamicsData() {
  const baseProducts = [
    // BG Electrical Products (Master Products)
    {
      sku: 'BG-NAB12',
      productName: 'BG Electrical 1-Gang 2-Way Metal Antique Brass Light Switch',
      currentStock: 96,
      allocatedStock: 5,
      availableStock: 91,
      reorderPoint: 10,
      lastUpdated: new Date().toISOString(),
      price: 3.1,
      cost: 1.55,
      vendor: 'BG Electrical',
      category: 'Lighting Controls',
      isMasterProduct: true,
      productType: 'Master Product',
      goodId: '98781de8-591c-412d-89dd-fc43b01cdfe7'
    },
    {
      sku: 'BG-NBN12',
      productName: 'BG Nexus Metal Black Nickel Switches and Sockets Full Range',
      currentStock: 62,
      allocatedStock: 3,
      availableStock: 59,
      reorderPoint: 15,
      lastUpdated: new Date().toISOString(),
      price: 3.1,
      cost: 1.55,
      vendor: 'BG Electrical',
      category: 'Lighting Controls',
      isMasterProduct: true,
      productType: 'Master Product',
      goodId: '12345678-1234-1234-1234-123456789012'
    },
    {
      sku: 'BG-NBS12',
      productName: 'BG Brushed Steel Light Switches & Sockets Full Range',
      currentStock: 60,
      allocatedStock: 2,
      availableStock: 58,
      reorderPoint: 12,
      lastUpdated: new Date().toISOString(),
      price: 3.1,
      cost: 1.55,
      vendor: 'BG Electrical',
      category: 'Lighting Controls',
      isMasterProduct: true,
      productType: 'Master Product',
      goodId: '87654321-4321-4321-4321-210987654321'
    },
    // Kit Products
    {
      sku: 'BG-NAB12_1',
      productName: 'BG Electrical 1-Gang 2-Way Metal Antique Brass Light Switch',
      currentStock: 96,
      allocatedStock: 5,
      availableStock: 91,
      reorderPoint: 10,
      lastUpdated: new Date().toISOString(),
      price: 3.1,
      cost: 1.55,
      vendor: 'BG Electrical',
      category: 'Lighting Controls',
      isMasterProduct: false,
      productType: 'Kit Product',
      goodId: 'cd4ce63c-bafd-43ef-9b95-05432fe3b037'
    },
    {
      sku: 'BG-NBN12_1',
      productName: 'BG Nexus Metal Black Nickel Switches and Sockets Full Range',
      currentStock: 62,
      allocatedStock: 3,
      availableStock: 59,
      reorderPoint: 15,
      lastUpdated: new Date().toISOString(),
      price: 3.1,
      cost: 1.55,
      vendor: 'BG Electrical',
      category: 'Lighting Controls',
      isMasterProduct: false,
      productType: 'Kit Product',
      goodId: '11111111-1111-1111-1111-111111111111'
    },
    {
      sku: 'BG-NBS12-4',
      productName: 'BG NBS12 Brushed Steel/Satin Chrome Single Light Switch x 4',
      currentStock: 13,
      allocatedStock: 1,
      availableStock: 12,
      reorderPoint: 5,
      lastUpdated: new Date().toISOString(),
      price: 12.4,
      cost: 6.2,
      vendor: 'BG Electrical',
      category: 'Lighting Controls',
      isMasterProduct: false,
      productType: 'Kit Product',
      goodId: '55555555-5555-5555-5555-555555555555'
    },
    {
      sku: 'BG-NBS12-8',
      productName:
        'Pack of 8 x BG NBS12 Brushed Steel/Satin Chrome Single Light Switch -10amp 1 or 2 Way',
      currentStock: 6,
      allocatedStock: 0,
      availableStock: 6,
      reorderPoint: 3,
      lastUpdated: new Date().toISOString(),
      price: 24.8,
      cost: 12.4,
      vendor: 'BG Electrical',
      category: 'Lighting Controls',
      isMasterProduct: false,
      productType: 'Kit Product',
      goodId: '77777777-7777-7777-7777-777777777777'
    },
    // WAGO Products
    {
      sku: 'WAGO-51253135',
      productName: 'WAGO 512-53135 3-Way Terminal Block',
      currentStock: 150,
      allocatedStock: 10,
      availableStock: 140,
      reorderPoint: 25,
      lastUpdated: new Date().toISOString(),
      price: 2.5,
      cost: 1.25,
      vendor: 'WAGO',
      category: 'Terminal Blocks',
      isMasterProduct: true,
      productType: 'Master Product',
      goodId: 'wago-51253135-master'
    },
    {
      sku: 'WAGO-51253135-10',
      productName: 'WAGO 512-53135 3-Way Terminal Block Pack of 10',
      currentStock: 15,
      allocatedStock: 2,
      availableStock: 13,
      reorderPoint: 5,
      lastUpdated: new Date().toISOString(),
      price: 20.0,
      cost: 10.0,
      vendor: 'WAGO',
      category: 'Terminal Blocks',
      isMasterProduct: false,
      productType: 'Kit Product',
      goodId: 'wago-51253135-10'
    },
    {
      sku: 'WAGO-51253135-25',
      productName: 'WAGO 512-53135 3-Way Terminal Block Pack of 25',
      currentStock: 8,
      allocatedStock: 1,
      availableStock: 7,
      reorderPoint: 3,
      lastUpdated: new Date().toISOString(),
      price: 45.0,
      cost: 22.5,
      vendor: 'WAGO',
      category: 'Terminal Blocks',
      isMasterProduct: false,
      productType: 'Kit Product',
      goodId: 'wago-51253135-25'
    },
    // Grid Switch Products
    {
      sku: 'GRID-SWITCH-1G',
      productName: 'Grid Switch 1-Gang 2-Way White',
      currentStock: 85,
      allocatedStock: 8,
      availableStock: 77,
      reorderPoint: 15,
      lastUpdated: new Date().toISOString(),
      price: 4.5,
      cost: 2.25,
      vendor: 'Grid Systems',
      category: 'Grid Switches',
      isMasterProduct: true,
      productType: 'Master Product',
      goodId: 'grid-switch-1g-master'
    },
    {
      sku: 'GRID-SWITCH-2G',
      productName: 'Grid Switch 2-Gang 2-Way White',
      currentStock: 72,
      allocatedStock: 6,
      availableStock: 66,
      reorderPoint: 12,
      lastUpdated: new Date().toISOString(),
      price: 6.8,
      cost: 3.4,
      vendor: 'Grid Systems',
      category: 'Grid Switches',
      isMasterProduct: true,
      productType: 'Master Product',
      goodId: 'grid-switch-2g-master'
    },
    {
      sku: 'GRID-SWITCH-1G-10',
      productName: 'Grid Switch 1-Gang 2-Way White Pack of 10',
      currentStock: 12,
      allocatedStock: 1,
      availableStock: 11,
      reorderPoint: 4,
      lastUpdated: new Date().toISOString(),
      price: 40.0,
      cost: 20.0,
      vendor: 'Grid Systems',
      category: 'Grid Switches',
      isMasterProduct: false,
      productType: 'Kit Product',
      goodId: 'grid-switch-1g-10'
    }
  ];

  // Generate additional realistic products
  const additionalProducts = [];
  const productTypes = [
    {
      name: 'Light Switch',
      category: 'Lighting Controls',
      vendor: 'BG Electrical',
      basePrice: 3.1
    },
    { name: 'Socket Outlet', category: 'Power Outlets', vendor: 'BG Electrical', basePrice: 4.2 },
    { name: 'Terminal Block', category: 'Terminal Blocks', vendor: 'WAGO', basePrice: 2.5 },
    { name: 'Grid Switch', category: 'Grid Switches', vendor: 'Grid Systems', basePrice: 4.5 },
    {
      name: 'Circuit Breaker',
      category: 'Circuit Protection',
      vendor: 'Schneider Electric',
      basePrice: 8.75
    },
    {
      name: 'Cable Gland',
      category: 'Cable Management',
      vendor: 'Hawke International',
      basePrice: 1.85
    },
    { name: 'Junction Box', category: 'Enclosures', vendor: 'Marshall Tufflex', basePrice: 3.95 },
    {
      name: 'Cable Tray',
      category: 'Cable Management',
      vendor: 'Cable Tray Systems',
      basePrice: 12.5
    }
  ];

  for (let i = 1; i <= 200; i++) {
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const isKit = Math.random() > 0.7; // 30% chance of being a kit
    const kitSize = isKit
      ? [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25][Math.floor(Math.random() * 11)]
      : 1;

    const baseSku = `${productType.vendor.split(' ')[0].toUpperCase()}-${i.toString().padStart(3, '0')}`;
    const sku = isKit ? `${baseSku}-${kitSize}` : baseSku;
    const productName = isKit
      ? `${productType.name} Pack of ${kitSize}`
      : `${productType.name} ${i}`;

    const basePrice = productType.basePrice;
    const price = isKit ? basePrice * kitSize * 0.9 : basePrice; // Kit discount
    const cost = price * 0.5;
    const stock = Math.floor(Math.random() * 100) + 5;
    const allocated = Math.floor(Math.random() * 10);

    additionalProducts.push({
      sku: sku,
      productName: productName,
      currentStock: stock,
      allocatedStock: allocated,
      availableStock: stock - allocated,
      reorderPoint: Math.floor(stock * 0.2),
      lastUpdated: new Date().toISOString(),
      price: price,
      cost: cost,
      vendor: productType.vendor,
      category: productType.category,
      isMasterProduct: !isKit,
      productType: isKit ? 'Kit Product' : 'Master Product',
      goodId: `${sku.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}`
    });
  }

  return [...baseProducts, ...additionalProducts];
}
