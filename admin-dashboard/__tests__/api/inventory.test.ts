/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/inventory/index";

// Mock the SellerDynamicsProvider
jest.mock('../../lib/sellerdynamicsProvider', () => ({
  SellerDynamicsProvider: jest.fn().mockImplementation(() => ({
    getStockLevels: jest.fn()
  }))
}));

import { SellerDynamicsProvider } from "../../lib/sellerdynamicsProvider";

describe('/api/inventory', () => {
  let mockProvider: jest.Mocked<SellerDynamicsProvider>;
  
  beforeEach(() => {
    mockProvider = new SellerDynamicsProvider() as jest.Mocked<SellerDynamicsProvider>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle GET request with basic parameters', async () => {
    const mockData = [
      {
        SKU: 'TEST-001',
        ProductName: 'Test Product',
        Vendor: 'Test Vendor',
        Quantity: 50,
        QuantityAllocated: 5,
        SupplierStockLevel: 55,
        ProductType: 'Test'
      }
    ];

    mockProvider.getStockLevels.mockResolvedValue({
      data: mockData,
      page: 1,
      totalPages: 1,
      total: 1,
      limit: 50,
      hasNextPage: false,
      hasPreviousPage: false
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        page: '1',
        limit: '50'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData.data).toHaveLength(1);
    expect(responseData.total).toBe(1);
    expect(responseData.page).toBe(1);
    expect(responseData.hasNextPage).toBe(false);
  });

  it('should handle GET request with advanced filters', async () => {
    const mockData = [
      {
        SKU: 'FILTERED-001',
        ProductName: 'Filtered Product',
        Vendor: 'Test Vendor',
        Quantity: 100,
        QuantityAllocated: 10,
        SupplierStockLevel: 110,
        ProductType: 'Electronics'
      }
    ];

    mockProvider.getStockLevels.mockResolvedValue({
      data: mockData,
      page: 1,
      totalPages: 1,
      total: 1,
      limit: 25,
      hasNextPage: false,
      hasPreviousPage: false
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        search: 'filtered',
        vendor: 'Test Vendor',
        productType: 'Electronics',
        minQuantity: '50',
        maxPrice: '100',
        sortBy: 'ProductName',
        sortOrder: 'asc',
        page: '1',
        limit: '25'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    
    expect(responseData.data).toHaveLength(1);
    expect(responseData.queryOptions).toBeDefined();
    expect(responseData.queryOptions.search).toBe('filtered');
    expect(responseData.queryOptions.vendor).toBe('Test Vendor');
    expect(responseData.queryOptions.minQuantity).toBe(50);
    expect(responseData.queryOptions.sortBy).toBe('ProductName');
    expect(responseData.processingStats).toBeDefined();
    expect(responseData.processingStats.appliedFilters).toContain('search: "filtered"');
    expect(responseData.processingStats.appliedFilters).toContain('vendor: "Test Vendor"');
  });

  it('should handle POST request with method not allowed', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const responseData = JSON.parse(res._getData());
    expect(responseData.error).toBe('Method not allowed. Use GET.');
  });

  it('should handle provider errors gracefully', async () => {
    mockProvider.getStockLevels.mockRejectedValue(new Error('Provider connection failed'));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const responseData = JSON.parse(res._getData());
    expect(responseData.error).toBe('Provider connection failed');
    expect(responseData.data).toEqual([]);
    expect(responseData.queryOptions).toBeDefined();
  });

  it('should handle provider returning error in response', async () => {
    mockProvider.getStockLevels.mockResolvedValue({
      data: [],
      page: 1,
      totalPages: 1,
      total: 0,
      limit: 50,
      hasNextPage: false,
      hasPreviousPage: false,
      error: 'API authentication failed'
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200); // Still 200 because we got a response
    const responseData = JSON.parse(res._getData());
    expect(responseData.error).toBe('API authentication failed');
    expect(responseData.data).toEqual([]);
  });

  it('should validate and sanitize query parameters', async () => {
    mockProvider.getStockLevels.mockResolvedValue({
      data: [],
      page: 1,
      totalPages: 1,
      total: 0,
      limit: 50,
      hasNextPage: false,
      hasPreviousPage: false
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        sortBy: 'InvalidField',
        sortOrder: 'invalid',
        page: '0',
        limit: '5000',
        minQuantity: 'not-a-number',
        isActive: 'maybe'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    
    // Check that invalid values were sanitized
    expect(responseData.queryOptions.sortBy).toBeUndefined();
    expect(responseData.queryOptions.sortOrder).toBe('asc');
    expect(responseData.queryOptions.page).toBe(1);
    expect(responseData.queryOptions.limit).toBe(1000); // Capped at max
    expect(responseData.queryOptions.minQuantity).toBeUndefined();
    expect(responseData.queryOptions.isActive).toBe(false); // 'maybe' -> false
  });

  it('should include processing stats in response', async () => {
    mockProvider.getStockLevels.mockResolvedValue({
      data: [
        {
          SKU: 'TEST-001'
        }
      ],
      page: 1,
      totalPages: 1,
      total: 1,
      limit: 50,
      hasNextPage: false,
      hasPreviousPage: false
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        search: 'test',
        vendor: 'TestVendor',
        minQuantity: '10',
        isActive: 'true'
      }
    });

    await handler(req, res);

    const responseData = JSON.parse(res._getData());
    expect(responseData.processingStats).toBeDefined();
    expect(responseData.processingStats.appliedFilters).toContain('search: "test"');
    expect(responseData.processingStats.appliedFilters).toContain('vendor: "TestVendor"');
    expect(responseData.processingStats.appliedFilters).toContain('minQuantity: 10');
    expect(responseData.processingStats.appliedFilters).toContain('isActive: true');
  });
});