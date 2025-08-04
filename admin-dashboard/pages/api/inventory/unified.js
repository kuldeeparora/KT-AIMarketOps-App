import SellerDynamicsIntegration from '../../../lib/services/sellerdynamics-integration.js';
import fs from 'fs';
import path from 'path';

// Cache configuration
const CACHE_DIR = path.join(process.cwd(), 'data', 'inventory-cache');
const CACHE_FILE = path.join(CACHE_DIR, 'unified-inventory.json');
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Ensure cache directory exists
function ensureCacheDirectory() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// Load from cache if fresh
function loadFromCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return null;
    }
    
    const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    const isExpired = Date.now() - new Date(cacheData.timestamp).getTime() > CACHE_DURATION;
    
    if (isExpired) {
      console.log('[Inventory Cache] Cache expired');
      return null;
    }
    
    console.log('[Inventory Cache] Using cached data');
    return cacheData.data;
  } catch (error) {
    console.error('[Inventory Cache] Error loading from cache:', error);
    return null;
  }
}

// Save to cache
function saveToCache(data) {
  try {
    ensureCacheDirectory();
    
    const cacheData = {
      timestamp: new Date().toISOString(),
      data: data
    };
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    console.log('[Inventory Cache] Data cached successfully');
  } catch (error) {
    console.error('[Inventory Cache] Error saving to cache:', error);
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      console.log('[Inventory Unified] Fetching unified inventory data...');
      
      // Get pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100; // Default to 100 items per page
      const offset = (page - 1) * limit;
      
      console.log(`[Inventory Unified] Pagination: page=${page}, limit=${limit}, offset=${offset}`);
      
      // Check cache first (unless force refresh is requested)
      const forceRefresh = req.query.refresh === 'true';
      let unifiedData = [];
      
      if (!forceRefresh) {
        const cachedData = loadFromCache();
        if (cachedData) {
          unifiedData = cachedData;
        }
      }
      
      // If no cached data or force refresh, fetch fresh data
      if (unifiedData.length === 0) {
        console.log('[Inventory Unified] Fetching fresh data from APIs...');
        
        // Initialize SellerDynamics integration
        const sellerDynamics = new SellerDynamicsIntegration();
      
      // Fetch from both sources
      let unifiedData = [];

      // Process SellerDynamics data using the integration service
      try {
        console.log('[Inventory Unified] Fetching SellerDynamics data...');
        
        // Fetch real data from SellerDynamics integration
        const sellerDynamicsResult = await sellerDynamics.fetchLiveInventory();
        
        if (sellerDynamicsResult.success && sellerDynamicsResult.data) {
          const enhancedSdData = sellerDynamicsResult.data.map((item, index) => ({
            id: item.id || `sd-${index}`,
            productName: item.productName,
            sku: item.sku,
            category: item.category,
            vendor: item.vendor,
            currentStock: item.currentStock,
            allocatedStock: item.allocatedStock,
            availableStock: item.availableStock,
            cost: item.cost,
            price: item.price,
            reorderPoint: item.reorderPoint,
            turnoverRate: item.turnoverRate || 0,
            daysInStock: item.daysInStock || 0,
            lastUpdated: item.lastUpdated,
            isMasterProduct: item.isMasterProduct,
            productType: item.productType,
            supplier: {
              id: `supplier-${item.vendor?.replace(/\s+/g, '-').toLowerCase()}`,
              name: item.vendor,
              contact: '+44 20 1234 5678', // Mock contact
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
              tags: ['premium', 'wireless', 'audio']
            },
            source: 'SellerDynamics',
            dataSource: sellerDynamicsResult.source || 'api'
          }));
          
          unifiedData.push(...enhancedSdData);
          console.log(`[Inventory Unified] Added ${enhancedSdData.length} SellerDynamics items (${sellerDynamicsResult.source})`);
        } else {
          console.log('[Inventory Unified] No SellerDynamics data available, using mock data');
          const mockSellerDynamicsData = generateMockSellerDynamicsData(100);
          const enhancedSdData = mockSellerDynamicsData.map((item, index) => ({
            id: item.id || `sd-${index}`,
            productName: item.productName,
            sku: item.sku,
            category: item.category,
            vendor: item.vendor,
            currentStock: item.currentStock,
            allocatedStock: item.allocatedStock,
            availableStock: item.availableStock,
            cost: item.cost,
            price: item.price,
            reorderPoint: item.reorderPoint,
            turnoverRate: item.turnoverRate || 0,
            daysInStock: item.daysInStock || 0,
            lastUpdated: item.lastUpdated,
            isMasterProduct: item.isMasterProduct,
            productType: item.productType,
            supplier: {
              id: `supplier-${item.vendor?.replace(/\s+/g, '-').toLowerCase()}`,
              name: item.vendor,
              contact: '+44 20 1234 5678',
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
              tags: ['premium', 'wireless', 'audio']
            },
            source: 'SellerDynamics',
            dataSource: 'mock'
          }));
          
          unifiedData.push(...enhancedSdData);
          console.log(`[Inventory Unified] Added ${enhancedSdData.length} SellerDynamics items (mock)`);
        }
      } catch (error) {
        console.error('[Inventory Unified] Error fetching SellerDynamics data:', error);
        // Fallback to mock data
        const mockSellerDynamicsData = generateMockSellerDynamicsData(100);
        const enhancedSdData = mockSellerDynamicsData.map((item, index) => ({
          id: item.id || `sd-${index}`,
          productName: item.productName,
          sku: item.sku,
          category: item.category,
          vendor: item.vendor,
          currentStock: item.currentStock,
          allocatedStock: item.allocatedStock,
          availableStock: item.availableStock,
          cost: item.cost,
          price: item.price,
          reorderPoint: item.reorderPoint,
          turnoverRate: item.turnoverRate || 0,
          daysInStock: item.daysInStock || 0,
          lastUpdated: item.lastUpdated,
          isMasterProduct: item.isMasterProduct,
          productType: item.productType,
          supplier: {
            id: `supplier-${item.vendor?.replace(/\s+/g, '-').toLowerCase()}`,
            name: item.vendor,
            contact: '+44 20 1234 5678',
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
            tags: ['premium', 'wireless', 'audio']
          },
          source: 'SellerDynamics',
          dataSource: 'mock'
        }));
        
        unifiedData.push(...enhancedSdData);
        console.log(`[Inventory Unified] Added ${enhancedSdData.length} SellerDynamics items (mock fallback)`);
      }

      // Process Shopify data
      try {
        console.log('[Inventory Unified] Fetching Shopify data...');
        const shopifyData = await getShopifyData();
        const enhancedShopData = (shopifyData.data?.products || []).map((item, index) => {
          const variant = item.variants?.[0] || {};
          const isMasterProduct = identifyMasterProduct(item.title, variant.sku);

          return {
            id: item.id,
            productName: item.title,
            sku: variant.sku || `SHOPIFY-${item.id}`,
            category: 'General', // Shopify data doesn't include product_type in current structure
            vendor: 'Shopify Store', // Use a default vendor for Shopify items
            currentStock: variant.inventory_quantity || 0,
            allocatedStock: 0,
            availableStock: variant.inventory_quantity || 0,
            cost: 0, // Cost not available in current Shopify response
            price: parseFloat(variant.price) || 0,
            reorderPoint: 10,
            turnoverRate: 0,
            daysInStock: 0,
            lastUpdated: new Date().toISOString(), // Use current timestamp since updated_at not available
            isMasterProduct: isMasterProduct,
            productType: isMasterProduct ? 'Master Product' : 'Kit Product',
            supplier: {
              id: 'supplier-shopify',
              name: 'Shopify Store',
              contact: 'N/A'
            },
            location: {
              warehouse: 'Shopify Inventory',
              aisle: 'N/A',
              shelf: 'N/A'
            },
            metadata: {
              weight: 'N/A',
              dimensions: 'N/A',
              barcode: 'N/A',
              tags: []
            },
            source: 'Shopify',
            dataSource: 'live'
          };
        });
        
        unifiedData.push(...enhancedShopData);
        console.log(`[Inventory Unified] Added ${enhancedShopData.length} Shopify items`);
      } catch (error) {
        console.error('[Inventory Unified] Error fetching Shopify data:', error);
      }
      
      // Save fetched data to cache
      saveToCache(unifiedData);
    }

      // Apply pagination
      const totalItems = unifiedData.length;
      
      // Apply source filtering if specified in query
      const sourceFilter = req.query.source;
      let filteredData = unifiedData;
      
      if (sourceFilter && sourceFilter !== 'all') {
        filteredData = unifiedData.filter(item => item.source === sourceFilter);
        console.log(`[Inventory Unified] Filtered by source '${sourceFilter}': ${filteredData.length} items`);
      } else {
        // Mix SellerDynamics and Shopify items for better distribution only when not filtering
        const sellerDynamicsItems = unifiedData.filter(item => item.source === 'SellerDynamics');
        const shopifyItems = unifiedData.filter(item => item.source === 'Shopify');
        
        // Improved mixing: every 5th item is Shopify for better visibility
        const mixedData = [];
        let sdIndex = 0;
        let shopifyIndex = 0;
        
        while (sdIndex < sellerDynamicsItems.length || shopifyIndex < shopifyItems.length) {
          // Add 4 SD items
          for (let i = 0; i < 4 && sdIndex < sellerDynamicsItems.length; i++) {
            mixedData.push(sellerDynamicsItems[sdIndex++]);
          }
          
          // Add 1 Shopify item every 5th position
          if (shopifyIndex < shopifyItems.length) {
            mixedData.push(shopifyItems[shopifyIndex++]);
          }
        }
        
        filteredData = mixedData;
      }
      
      const paginatedData = filteredData.slice(offset, offset + limit);
      
      console.log(`[Inventory Unified] Pagination applied: ${paginatedData.length} items returned out of ${totalItems} total`);

      return res.status(200).json({
        success: true,
        data: paginatedData,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          hasNextPage: offset + limit < totalItems,
          hasPrevPage: page > 1
        },
        meta: {
          totalItems,
          sellerdynamicsCount: unifiedData.filter(item => item.source === 'SellerDynamics').length,
          shopifyCount: unifiedData.filter(item => item.source === 'Shopify').length,
          lastUpdated: new Date().toISOString(),
          integrationStatus: {
            endpoint: process.env.SELLERDYNAMICS_SOAP_ENDPOINT ? 'Configured' : 'Not Configured',
            encryptedLogin: process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN ? 'Configured' : 'Not Configured',
            retailerId: process.env.SELLERDYNAMICS_RETAILER_ID ? 'Configured' : 'Not Configured',
            useMock: process.env.USE_MOCK_SELLERDYNAMICS !== 'false',
            status: 'Live Mode'
          }
        }
      });
    } catch (error) {
      console.error('[Inventory Unified] Error fetching unified inventory:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { sku, updates } = req.body;

      if (!sku) {
        return res.status(400).json({ error: 'SKU is required' });
      }

      console.log(`[Inventory Unified] Updating inventory for SKU: ${sku}`);

      // Initialize SellerDynamics integration
      const sellerDynamics = new SellerDynamicsIntegration();

      // Update both SellerDynamics and Shopify
      const updatePromises = [];

      // Update SellerDynamics using the integration service
      updatePromises.push(
        sellerDynamics.updateInventoryItem(sku, {
          currentStock: updates.currentStock,
          allocatedStock: updates.allocatedStock,
          availableStock: updates.availableStock,
          price: updates.price,
          cost: updates.cost,
          lastUpdated: new Date().toISOString()
        })
      );

      // Update Shopify (if we have product ID)
      if (updates.productId) {
        updatePromises.push(
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/shopify-inventory/update`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: updates.productId,
                variantId: updates.variantId,
                inventory_quantity: updates.currentStock,
                price: updates.price
              })
            }
          )
        );
      }

      const results = await Promise.allSettled(updatePromises);
      const successfulUpdates = results.filter(result => result.status === 'fulfilled');

      return res.status(200).json({
        success: true,
        message: `Updated ${successfulUpdates.length} systems successfully`,
        data: {
          sku,
          updates,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('[Inventory Unified] Error updating inventory:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Function to get Shopify data
async function getShopifyData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/shopify-inventory`);
    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[Inventory Unified] Error fetching Shopify data:', error);
    return {
      data: {
        products: []
      }
    };
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

// Function to generate mock SellerDynamics data
function generateMockSellerDynamicsData(count = 100) {
  const categories = ['Electrical', 'Lighting', 'Security', 'HVAC', 'Plumbing', 'General'];
  const vendors = ['BG-EVOLVE', 'BG-NEXUS', 'WAGO', 'Astroflame', 'Aqualisa', 'Masterplug'];
  const mockData = [];

  for (let i = 0; i < count; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const isMasterProduct = Math.random() > 0.3; // 70% master products, 30% kit products
    
    const mockItem = {
      id: `sd-${i}`,
      productName: `${vendor} ${category} Product ${i + 1}`,
      sku: `${vendor}-${category.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      category: category,
      vendor: vendor,
      currentStock: Math.floor(Math.random() * 100),
      allocatedStock: Math.floor(Math.random() * 10),
      availableStock: Math.floor(Math.random() * 90),
      cost: Math.floor(Math.random() * 50) + 10,
      price: Math.floor(Math.random() * 100) + 20,
      reorderPoint: 10,
      turnoverRate: Math.floor(Math.random() * 10),
      daysInStock: Math.floor(Math.random() * 30),
      lastUpdated: new Date().toISOString(),
      isMasterProduct: isMasterProduct,
      productType: isMasterProduct ? 'Master Product' : 'Kit Product'
    };

    mockData.push(mockItem);
  }

  return mockData;
}
