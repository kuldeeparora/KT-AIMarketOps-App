/**
 * @jest-environment node
 */
import { SellerDynamicsProvider } from "../../lib/sellerdynamicsProvider";

// Mock the getStockLevels module
jest.mock('../../packages/sellerdynamics-api/getStockLevels.js', () => ({
  getAllStockLevels: jest.fn()
}));

describe('SellerDynamicsProvider', () => {
  let provider: SellerDynamicsProvider;
  let mockGetAllStockLevels: any;
  
  beforeEach(() => {
    provider = new SellerDynamicsProvider();
    
    // Import the mocked function after Jest has set up the mock
    mockGetAllStockLevels = require("../../packages/sellerdynamics-api/getStockLevels.js").getAllStockLevels;
    
    // Set up environment variables
    process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN = 'test-encrypted-login';
    process.env.SELLERDYNAMICS_RETAILER_ID = 'test-retailer-id';
    process.env.SELLERDYNAMICS_SOAP_ENDPOINT = 'https://test.sellerdynamics.com/';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStockLevels', () => {
    it('should return paginated results with valid data', async () => {
      const mockRawData = [
        {
          SKU: 'TEST-001',
          ProductName: 'Test Product 1',
          Quantity: 50,
          Vendor: 'Test Vendor'
        },
        {
          SKU: 'TEST-002',
          ProductName: 'Test Product 2',
          Quantity: 25,
          Vendor: 'Another Vendor'
        }
      ];

      mockGetAllStockLevels.mockResolvedValue(mockRawData);

      const result = await provider.getStockLevels({
        page: 1,
        limit: 10
      });

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.error).toBeUndefined();
    });

    it('should apply search filter', async () => {
      const mockRawData = [
        {
          SKU: 'WIDGET-001',
          ProductName: 'Blue Widget',
          Quantity: 50,
          Vendor: 'Widget Co'
        },
        {
          SKU: 'GADGET-001',
          ProductName: 'Red Gadget',
          Quantity: 25,
          Vendor: 'Gadget Inc'
        }
      ];

      mockGetAllStockLevels.mockResolvedValue(mockRawData);

      const result = await provider.getStockLevels({
        search: 'widget',
        page: 1,
        limit: 10
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].ProductName).toBe('Blue Widget');
      expect(result.total).toBe(1);
    });

    it('should apply sorting', async () => {
      const mockRawData = [
        {
          SKU: 'B-PRODUCT',
          ProductName: 'B Product',
          Quantity: 100,
          Vendor: 'Test Vendor'
        },
        {
          SKU: 'A-PRODUCT',
          ProductName: 'A Product',
          Quantity: 50,
          Vendor: 'Test Vendor'
        }
      ];

      mockGetAllStockLevels.mockResolvedValue(mockRawData);

      const result = await provider.getStockLevels({
        sortBy: 'ProductName',
        sortOrder: 'asc',
        page: 1,
        limit: 10
      });

      expect(result.data[0].ProductName).toBe('A Product');
      expect(result.data[1].ProductName).toBe('B Product');
    });

    it('should apply quantity filters', async () => {
      const mockRawData = [
        {
          SKU: 'HIGH-STOCK',
          ProductName: 'High Stock Product',
          Quantity: 100,
          Vendor: 'Test Vendor'
        },
        {
          SKU: 'LOW-STOCK',
          ProductName: 'Low Stock Product',
          Quantity: 5,
          Vendor: 'Test Vendor'
        }
      ];

      mockGetAllStockLevels.mockResolvedValue(mockRawData);

      const result = await provider.getStockLevels({
        minQuantity: 50,
        page: 1,
        limit: 10
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].SKU).toBe('HIGH-STOCK');
      expect(result.total).toBe(1);
    });

    it('should handle pagination correctly', async () => {
      const mockRawData = Array.from({ length: 25 }, (_, index) => ({
        SKU: `PROD-${String(index + 1).padStart(3, '0')}`,
        ProductName: `Product ${index + 1}`,
        Quantity: (index + 1) * 10,
        Vendor: 'Test Vendor'
      }));

      mockGetAllStockLevels.mockResolvedValue(mockRawData);

      const result = await provider.getStockLevels({
        page: 2,
        limit: 10
      });

      expect(result.data).toHaveLength(10);
      expect(result.data[0].SKU).toBe('PROD-011'); // Second page starts with item 11
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
    });

    it('should normalize data structure correctly', async () => {
      const mockRawData = [
        {
          SKU: 'TEST-001',
          ProductName: 'Test Product',
          Quantity: 50,
          Vendor: 'Test Vendor',
          Price: '29.99',
          Cost: '19.99',
          IsActive: true
        }
      ];

      mockGetAllStockLevels.mockResolvedValue(mockRawData);

      const result = await provider.getStockLevels({});

      const item = result.data[0];
      expect(item.SKU).toBe('TEST-001');
      expect(item.ProductName).toBe('Test Product');
      expect(item.Quantity).toBe(50);
      expect(item.Price).toBe(29.99); // Should be converted to number
      expect(item.Cost).toBe(19.99);
      expect(item.QuantityAllocated).toBe(0); // Should have default
      expect(item.IsActive).toBe(true);
      expect(item.Location).toBe('Main Warehouse'); // Should have default
    });

    it('should handle missing environment variables', async () => {
      delete process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN;

      const result = await provider.getStockLevels({});

      expect(result.data).toHaveLength(0);
      expect(result.error).toContain('Missing environment variables');
      expect(result.error).toContain('SELLERDYNAMICS_ENCRYPTED_LOGIN');
    });

    it('should handle API errors', async () => {
      mockGetAllStockLevels.mockResolvedValue({
        IsError: true,
        ErrorMessage: 'Authentication failed'
      });

      const result = await provider.getStockLevels({});

      expect(result.data).toHaveLength(0);
      expect(result.error).toBe('Authentication failed');
    });

    it('should handle network/connection errors', async () => {
      mockGetAllStockLevels.mockRejectedValue(new Error('Network connection failed'));

      const result = await provider.getStockLevels({});

      expect(result.data).toHaveLength(0);
      expect(result.error).toBe('Network connection failed');
    });

    it('should enforce minimum page size for SellerDynamics API', async () => {
      mockGetAllStockLevels.mockResolvedValue([]);

      await provider.getStockLevels({ limit: 100 });
      expect(mockGetAllStockLevels).toHaveBeenCalledWith(
        expect.objectContaining({
          pageSize: 5000 // Should be corrected to minimum
        })
      );
    });
  });

  describe('getFilterStats', () => {
    it('should return correct filter statistics', async () => {
      const mockRawData = [
        {
          SKU: 'PROD-001',
          ProductName: 'Product 1',
          Vendor: 'Vendor A',
          ProductType: 'Electronics',
          Quantity: 50,
          Price: 29.99,
          Location: 'Warehouse 1'
        },
        {
          SKU: 'PROD-002',
          ProductName: 'Product 2',
          Vendor: 'Vendor B',
          ProductType: 'Tools',
          Quantity: 25,
          Price: 19.99,
          Location: 'Warehouse 2'
        },
        {
          SKU: 'PROD-003',
          ProductName: 'Product 3',
          Vendor: 'Vendor A',
          ProductType: 'Electronics',
          Quantity: 75,
          Price: 49.99,
          Location: 'Warehouse 1'
        }
      ];

      mockGetAllStockLevels.mockResolvedValue(mockRawData);

      const stats = await provider.getFilterStats();

      expect(stats.totalProducts).toBe(3);
      expect(stats.vendors).toEqual(['Vendor A', 'Vendor B']);
      expect(stats.productTypes).toEqual(['Electronics', 'Tools']);
      expect(stats.locations).toEqual(['Warehouse 1', 'Warehouse 2']);
      expect(stats.quantityRange.min).toBe(25);
      expect(stats.quantityRange.max).toBe(75);
      expect(stats.priceRange.min).toBe(19.99);
      expect(stats.priceRange.max).toBe(49.99);
    });

    it('should handle empty data', async () => {
      mockGetAllStockLevels.mockResolvedValue([]);

      const stats = await provider.getFilterStats();

      expect(stats.totalProducts).toBe(0);
      expect(stats.vendors).toEqual([]);
      expect(stats.productTypes).toEqual([]);
      expect(stats.locations).toEqual([]);
      expect(stats.quantityRange.min).toBe(0);
      expect(stats.quantityRange.max).toBe(0);
      expect(stats.priceRange.min).toBe(0);
      expect(stats.priceRange.max).toBe(0);
    });

    it('should handle provider errors', async () => {
      mockGetAllStockLevels.mockRejectedValue(new Error('Provider error'));

      const stats = await provider.getFilterStats();

      expect(stats.totalProducts).toBe(0);
      expect(stats.vendors).toEqual([]);
    });
  });
});