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
      const { locationId } = req.query;

      if (locationId) {
        // Get specific location
        const location = await getLocation(locationId);
        return res.status(200).json(location);
      } else {
        // Get all locations
        const locations = await getAllLocations();
        return res.status(200).json(locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      return res.status(500).json({ error: 'Failed to fetch locations' });
  }
  }

  if (req.method === 'POST') {
    try {
      const { action, data } = req.body;

      let result;
      switch (action) {
        case 'transfer_stock':
          result = await transferStock(data);
          break;
        case 'update_location':
          result = await updateLocation(data);
          break;
        case 'get_location_inventory':
          result = await getLocationInventory(data.locationId);
          break;
        case 'allocate_stock':
          result = await allocateStock(data);
          break;
        default: return res.status(400).json({ error: 'Invalid action' });
  }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error with location management:', error);
      return res.status(500).json({ error: 'Failed to process location action' });
  }
  }

  return res.status(405).json({ error: 'Method not allowed' });
  }

// Mock location management functions
async function getAllLocations() {
  const locations = [
    {
      id: 'warehouse-001',
      name: 'Main Warehouse',
      address: '123 Industrial Estate, London, UK',
      type: 'warehouse',
      capacity: 10000,
      usedCapacity: 7500,
      status: 'active',
      manager: 'John Smith',
      contact: '+44 20 1234 5678',
      lastUpdated: '2024-01-15T14:30:00Z',
      inventory: {
        totalProducts: 850,
        totalValue: 320000,
        lowStockItems: 25,
        outOfStockItems: 5
      }
    },
    {
      id: 'warehouse-002',
      name: 'North Distribution Center',
      address: '456 Business Park, Manchester, UK',
      type: 'distribution',
      capacity: 5000,
      usedCapacity: 3200,
      status: 'active',
      manager: 'Sarah Johnson',
      contact: '+44 161 987 6543',
      lastUpdated: '2024-01-15T13:45:00Z',
      inventory: {
        totalProducts: 420,
        totalValue: 180000,
        lowStockItems: 15,
        outOfStockItems: 3
      }
    },
    {
      id: 'store-001',
      name: 'London Retail Store',
      address: '789 High Street, London, UK',
      type: 'retail',
      capacity: 1000,
      usedCapacity: 850,
      status: 'active',
      manager: 'Mike Wilson',
      contact: '+44 20 4567 8901',
      lastUpdated: '2024-01-15T12:15:00Z',
      inventory: {
        totalProducts: 150,
        totalValue: 45000,
        lowStockItems: 8,
        outOfStockItems: 2
      }
    },
    {
      id: 'warehouse-003',
      name: 'South Storage Facility',
      address: '321 Logistics Way, Birmingham, UK',
      type: 'storage',
      capacity: 8000,
      usedCapacity: 4800,
      status: 'active',
      manager: 'Emma Davis',
      contact: '+44 121 234 5678',
      lastUpdated: '2024-01-15T11:30:00Z',
      inventory: {
        totalProducts: 680,
        totalValue: 250000,
        lowStockItems: 20,
        outOfStockItems: 4
      }
    }
  ];

  return {
    locations,
    summary: {
      totalLocations: locations.length,
      totalCapacity: locations.reduce((sum, loc) => sum + loc.capacity, 0),
      usedCapacity: locations.reduce((sum, loc) => sum + loc.usedCapacity, 0),
      utilizationRate:
        locations.reduce((sum, loc) => sum + loc.usedCapacity / loc.capacity, 0) / locations.length,
      totalInventoryValue: locations.reduce((sum, loc) => sum + loc.inventory.totalValue, 0)
    }
  };
}

async function getLocation(locationId) {
  const locations = await getAllLocations();
  const location = locations.locations.find(loc => loc.id === locationId);

  if (!location) {
    return { error: 'Location not found' };
  }

  // Get detailed inventory for this location
  const detailedInventory = await getLocationInventory(locationId);

  return {
    ...location,
    detailedInventory,
    transfers: await getLocationTransfers(locationId),
    performance: await getLocationPerformance(locationId)
  };
}

async function getLocationInventory(locationId) {
  // Mock detailed inventory for location
  const products = [
    {
      productId: 'SD-001',
      productName: 'Premium Wireless Headphones',
      sku: 'PWH-001',
      quantity: 45,
      allocated: 5,
      available: 40,
      costPrice: 45.0,
      sellingPrice: 159.99,
      lastUpdated: '2024-01-15T14:30:00Z'
  },
    {
      productId: 'SD-002',
      productName: 'Bluetooth Speaker Pro',
      sku: 'BSP-002',
      quantity: 23,
      allocated: 2,
      available: 21,
      costPrice: 35.0,
      sellingPrice: 89.99,
      lastUpdated: '2024-01-15T14:30:00Z'
  },
    {
      productId: 'SD-003',
      productName: 'USB-C Cable 6ft',
      sku: 'UCC-003',
      quantity: 5,
      allocated: 0,
      available: 5,
      costPrice: 8.0,
      sellingPrice: 12.99,
      lastUpdated: '2024-01-15T14:30:00Z'
  }
  ];

  return {
    products,
    summary: {
    totalProducts: products.length,
      totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
      totalAllocated: products.reduce((sum, p) => sum + p.allocated, 0),
      totalAvailable: products.reduce((sum, p) => sum + p.available, 0),
      totalValue: products.reduce((sum, p) => sum + p.quantity * p.costPrice, 0)
    }
  };
}

async function transferStock(transferData) {
  const { fromLocation, toLocation, products, reason } = transferData;

  // Mock stock transfer
  const transfer = {
    id: `TRF-${Date.now()}`,
    fromLocation,
    toLocation,
    products: products.map(p => ({
      ...p,
      transferQuantity: p.quantity,
      status: 'in_transit'
  })),
    reason,
    status: 'pending',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };

  return {
    success: true,
    transfer,
    message: 'Stock transfer initiated successfully',
    estimatedDelivery: transfer.estimatedDelivery
  };
}

async function updateLocation(locationData) {
  const { locationId, updates } = locationData;

  // Mock location update
  const updatedLocation = {
    id: locationId,
    ...updates,
    lastUpdated: new Date().toISOString()
  };

  return {
    success: true,
    location: updatedLocation,
    message: 'Location updated successfully'
  };
}

async function allocateStock(allocationData) {
  const { locationId, productId, quantity, purpose } = allocationData;

  // Mock stock allocation
  const allocation = {
    id: `ALL-${Date.now()}`,
    locationId,
    productId,
    quantity,
    purpose,
    status: 'allocated',
    allocatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  return {
    success: true,
    allocation,
    message: 'Stock allocated successfully'
  };
}

async function getLocationTransfers(locationId) {
  // Mock transfer history
  return [
    {
      id: 'TRF-001',
      type: 'inbound',
      fromLocation: 'warehouse-002',
      toLocation: locationId,
      products: [{ productId: 'SD-001', quantity: 25 }],
      status: 'completed',
      createdAt: '2024-01-14T10:00:00Z',
      completedAt: '2024-01-15T14:30:00Z'
  },
    {
      id: 'TRF-002',
      type: 'outbound',
      fromLocation: locationId,
      toLocation: 'store-001',
      products: [{ productId: 'SD-002', quantity: 10 }],
      status: 'in_transit',
      createdAt: '2024-01-15T09:00:00Z',
      estimatedDelivery: '2024-01-17T14:00:00Z'
  }
  ];
}

async function getLocationPerformance(locationId) {
  // Mock performance metrics
  return {
    efficiency: 0.92,
    accuracy: 0.98,
    throughput: 150, // items per day
    utilization: 0.75,
    lastMonth: {
    ordersProcessed: 1250,
      itemsShipped: 8500,
      averageOrderValue: 450.0,
      customerSatisfaction: 4.8
  },
    trends: [
      { month: 'Jan', efficiency: 0.92, throughput: 150 },
      { month: 'Dec', efficiency: 0.89, throughput: 145 },
      { month: 'Nov', efficiency: 0.91, throughput: 148 }
    ]
  };
}
