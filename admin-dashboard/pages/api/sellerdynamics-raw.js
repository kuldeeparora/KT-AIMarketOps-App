export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status,(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Mock SellerDynamics API response - this is what the real API would return
      const rawSellerDynamicsData = {
        apiVersion: 'v1.0',
        timestamp: new Date().toISOString(),
        totalRecords: 5000,
        page: 1,
        pageSize: 100,
        stockLevels: [
          {
            id: 'SD-001',
            productName: 'Premium Wireless Headphones',
            sku: 'PWH-001',
            category: 'Electronics',
            vendor: 'Tech Supplies Ltd',
            currentStock: 45,
            allocatedStock: 5,
            availableStock: 40,
            cost: 45.0,
            price: 159.99,
            reorderPoint: 10,
            turnoverRate: 0.85,
            daysInStock: 15,
            lastUpdated: '2024-01-15T14:30:00Z',
            supplier: {
    id: 'supplier-001',
              name: 'Tech Supplies Ltd',
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
              tags: ['premium', 'wireless', 'audio']
            }
          },
          {
            id: 'SD-002',
            productName: 'Bluetooth Speaker Pro',
            sku: 'BSP-002',
            category: 'Electronics',
            vendor: 'Global Electronics',
            currentStock: 23,
            allocatedStock: 2,
            availableStock: 21,
            cost: 35.0,
            price: 89.99,
            reorderPoint: 15,
            turnoverRate: 0.72,
            daysInStock: 22,
            lastUpdated: '2024-01-15T13:45:00Z',
            supplier: {
    id: 'supplier-002',
              name: 'Global Electronics',
              contact: '+44 161 987 6543'
  },
            location: {
    warehouse: 'North Distribution Center',
              aisle: 'B-08',
              shelf: 'S-12'
  },
            metadata: {
    weight: '1.2kg',
              dimensions: '25x18x12cm',
              barcode: '1234567890124',
              tags: ['bluetooth', 'portable', 'audio']
            }
          },
          {
            id: 'SD-003',
            productName: 'USB-C Cable 6ft',
            sku: 'UCC-003',
            category: 'Electronics',
            vendor: 'Premium Components',
            currentStock: 5,
            allocatedStock: 0,
            availableStock: 5,
            cost: 8.0,
            price: 12.99,
            reorderPoint: 20,
            turnoverRate: 0.95,
            daysInStock: 8,
            lastUpdated: '2024-01-15T12:15:00Z',
            supplier: {
    id: 'supplier-003',
              name: 'Premium Components',
              contact: '+44 121 234 5678'
  },
            location: {
    warehouse: 'South Storage Facility',
              aisle: 'C-03',
              shelf: 'S-18'
  },
            metadata: {
    weight: '0.1kg',
              dimensions: '5x2x1cm',
              barcode: '1234567890125',
              tags: ['cable', 'usb-c', 'charging']
            }
          },
          {
            id: 'SD-004',
            productName: 'Gourmet Coffee Beans',
            sku: 'GCB-004',
            category: 'Food & Beverage',
            vendor: 'Coffee Masters Ltd',
            currentStock: 150,
            allocatedStock: 25,
            availableStock: 125,
            cost: 8.5,
            price: 12.99,
            reorderPoint: 50,
            turnoverRate: 0.88,
            daysInStock: 12,
            lastUpdated: '2024-01-15T11:30:00Z',
            supplier: {
    id: 'supplier-004',
              name: 'Coffee Masters Ltd',
              contact: '+44 20 4567 8901'
  },
            location: {
    warehouse: 'Main Warehouse',
              aisle: 'D-15',
              shelf: 'S-22'
  },
            metadata: {
    weight: '1kg',
              dimensions: '15x10x8cm',
              barcode: '1234567890126',
              tags: ['coffee', 'gourmet', 'organic']
            }
          },
          {
            id: 'SD-005',
            productName: 'Smart Fitness Watch',
            sku: 'SFW-005',
            category: 'Electronics',
            vendor: 'Tech Supplies Ltd',
            currentStock: 12,
            allocatedStock: 3,
            availableStock: 9,
            cost: 85.0,
            price: 249.99,
            reorderPoint: 8,
            turnoverRate: 0.65,
            daysInStock: 28,
            lastUpdated: '2024-01-15T10:45:00Z',
            supplier: {
    id: 'supplier-001',
              name: 'Tech Supplies Ltd',
              contact: '+44 20 1234 5678'
  },
            location: {
    warehouse: 'Main Warehouse',
              aisle: 'A-15',
              shelf: 'S-08'
  },
            metadata: {
    weight: '0.3kg',
              dimensions: '12x8x2cm',
              barcode: '1234567890127',
              tags: ['fitness', 'smartwatch', 'health']
            }
          }
        ],
        summary: {
    totalValue: 450000,
          averageCost: 35.5,
          averagePrice: 104.99,
          lowStockItems: 45,
          outOfStockItems: 12,
          categories: {
    Electronics: 3500,
            'Food & Beverage': 800,
            'Home & Garden': 400,
            Clothing: 300
  }
        }
      };

      return res.status,(200).json({
        success: true,
        message: 'Raw SellerDynamics API Data',
        data: rawSellerDynamicsData,
        apiInfo: {
    endpoint: '/api/sellerdynamics',
          method: 'GET',
          description:
            'This is the complete raw data structure that SellerDynamics API would return',
          note: 'In production, this would be fetched from the actual SellerDynamics API'
        }
      });
    } catch (error) {
      console.error('Error fetching raw SellerDynamics data:', error);
      return res.status,(500).json({
        error: 'Failed to fetch raw SellerDynamics data',
        details: error.message
  });
    }
  }

  return res.status,(405).json({ error: 'Method not allowed' });
  }
