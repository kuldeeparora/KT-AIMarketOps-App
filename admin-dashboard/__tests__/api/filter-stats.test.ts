/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import handler from "../../pages/api/inventory/filter-stats";

// Mock the SellerDynamicsProvider
jest.mock('../../lib/sellerdynamicsProvider', () => ({
  SellerDynamicsProvider: jest.fn().mockImplementation(() => ({
    getFilterStats: jest.fn()
  }))
}));

import { SellerDynamicsProvider } from "../../lib/sellerdynamicsProvider";

describe('/api/inventory/filter-stats', () => {
  let mockProvider: jest.Mocked<SellerDynamicsProvider>;
  
  beforeEach(() => {
    mockProvider = new SellerDynamicsProvider() as jest.Mocked<SellerDynamicsProvider>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return filter statistics successfully', async () => {
    const mockStats = {
      totalProducts: 150,
      filteredProducts: 150,
      vendors: [
        'Vendor A', 'Vendor B', 'Vendor C'
      ],
      productTypes: [
        'Electronics', 'Tools', 'Hardware'
      ],
      locations: [
        'Warehouse 1', 'Warehouse 2'
      ],
      quantityRange: {
        min: 1, max: 500 
      },
      priceRange: {
        min: 9.99, max: 299.99 
      }
    };

    mockProvider.getFilterStats.mockResolvedValue(mockStats);

    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    
    expect(responseData.totalProducts).toBe(150);
    expect(responseData.vendors).toEqual([
      'Vendor A', 'Vendor B', 'Vendor C'
    ]);
    expect(responseData.productTypes).toEqual([
      'Electronics', 'Tools', 'Hardware'
    ]);
    expect(responseData.locations).toEqual([
      'Warehouse 1', 'Warehouse 2'
    ]);
    expect(responseData.quantityRange.min).toBe(1);
    expect(responseData.quantityRange.max).toBe(500);
    expect(responseData.priceRange.min).toBe(9.99);
    expect(responseData.priceRange.max).toBe(299.99);
    expect(responseData.generatedAt).toBeDefined();
  });

  it('should handle POST request with method not allowed', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const responseData = JSON.parse(res._getData());
    expect(responseData.error).toBe('Method not allowed. Use GET.');
  });

  it('should handle provider errors gracefully', async () => {
    mockProvider.getFilterStats.mockRejectedValue(new Error('Provider connection failed'));

    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const responseData = JSON.parse(res._getData());
    expect(responseData.error).toBe('Provider connection failed');
    expect(responseData.totalProducts).toBe(0);
    expect(responseData.vendors).toEqual([]);
    expect(responseData.generatedAt).toBeDefined();
  });

  it('should return empty stats when no data available', async () => {
    const emptyStats = {
      totalProducts: 0,
      filteredProducts: 0,
      vendors: [],
      productTypes: [],
      locations: [],
      quantityRange: {
        min: 0, max: 0 
      },
      priceRange: {
        min: 0, max: 0 
      }
    };

    mockProvider.getFilterStats.mockResolvedValue(emptyStats);

    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    
    expect(responseData.totalProducts).toBe(0);
    expect(responseData.vendors).toEqual([]);
    expect(responseData.productTypes).toEqual([]);
    expect(responseData.quantityRange.min).toBe(0);
    expect(responseData.quantityRange.max).toBe(0);
  });
});