/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import inventoryHandler from "../../pages/api/inventory/index";
import filterStatsHandler from "../../pages/api/inventory/filter-stats";

// Integration test that doesn't mock the provider to test real flow
describe('Inventory API Integration Tests', () => {
  // Test with real provider but mocked external API calls
  beforeAll(() => {
    // Set up environment variables for testing
    process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN = 'test-encrypted-login';
    process.env.SELLERDYNAMICS_RETAILER_ID = 'test-retailer-id';
    process.env.SELLERDYNAMICS_SOAP_ENDPOINT = 'https://test.sellerdynamics.com/';
  });

  describe('Real-world usage scenarios', () => {
    it('should handle complex filtering and pagination scenario', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          search: 'electronics',
          vendor: 'premium',
          minQuantity: '10',
          maxPrice: '100',
          sortBy: 'ProductName',
          sortOrder: 'asc',
          page: '1',
          limit: '20',
          isActive: 'true'
        }
      });

      await inventoryHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      
      // Should have proper structure regardless of data availability
      expect(responseData).toHaveProperty('data');
      expect(responseData).toHaveProperty('total');
      expect(responseData).toHaveProperty('page', 1);
      expect(responseData).toHaveProperty('limit', 20);
      expect(responseData).toHaveProperty('hasNextPage');
      expect(responseData).toHaveProperty('hasPreviousPage', false);
      expect(responseData).toHaveProperty('queryOptions');
      expect(responseData).toHaveProperty('processingStats');
      
      // Validate query options were properly processed
      expect(responseData.queryOptions.search).toBe('electronics');
      expect(responseData.queryOptions.vendor).toBe('premium');
      expect(responseData.queryOptions.minQuantity).toBe(10);
      expect(responseData.queryOptions.maxPrice).toBe(100);
      expect(responseData.queryOptions.sortBy).toBe('ProductName');
      expect(responseData.queryOptions.sortOrder).toBe('asc');
      expect(responseData.queryOptions.isActive).toBe(true);
      
      // Check processing stats
      expect(responseData.processingStats.appliedFilters).toContain('search: "electronics"');
      expect(responseData.processingStats.appliedFilters).toContain('vendor: "premium"');
      expect(responseData.processingStats.appliedFilters).toContain('minQuantity: 10');
      expect(responseData.processingStats.sortBy).toBe('ProductName');
      expect(responseData.processingStats.sortOrder).toBe('asc');
    });

    it('should handle invalid parameters gracefully', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          sortBy: 'InvalidField',
          sortOrder: 'invalidOrder',
          page: 'notANumber',
          limit: '-5',
          minQuantity: 'notANumber',
          maxPrice: 'alsoNotANumber',
          isActive: 'maybe'
        }
      });

      await inventoryHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      
      // Should sanitize invalid values
      expect(responseData.queryOptions.sortBy).toBeUndefined();
      expect(responseData.queryOptions.sortOrder).toBe('asc');
      expect(responseData.queryOptions.page).toBe(1);
      expect(responseData.queryOptions.limit).toBe(50);
      expect(responseData.queryOptions.minQuantity).toBeUndefined();
      expect(responseData.queryOptions.maxPrice).toBeUndefined();
      expect(responseData.queryOptions.isActive).toBe(false); // 'maybe' -> false
    });

    it('should handle high limit values by capping them', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          limit: '99999' // Very high limit
        }
      });

      await inventoryHandler(req, res);

      const responseData = JSON.parse(res._getData());
      expect(responseData.queryOptions.limit).toBe(1000); // Should be capped
    });

    it('should work with minimal query parameters', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {} // Empty query
      });

      await inventoryHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      
      // Should use defaults
      expect(responseData.queryOptions.page).toBe(1);
      expect(responseData.queryOptions.limit).toBe(50);
      expect(responseData.queryOptions.sortOrder).toBe('asc');
    });

    it('should support offset-based pagination', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          offset: '25',
          limit: '10'
        }
      });

      await inventoryHandler(req, res);

      const responseData = JSON.parse(res._getData());
      expect(responseData.queryOptions.offset).toBe(25);
      expect(responseData.queryOptions.limit).toBe(10);
    });
  });

  describe('Error handling scenarios', () => {
    it('should reject non-GET methods', async () => {
      const { req, res } = createMocks({
        method: 'POST'
      });

      await inventoryHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const responseData = JSON.parse(res._getData());
      expect(responseData.error).toBe('Method not allowed. Use GET.');
    });

    it('should handle missing environment variables', async () => {
      // Temporarily remove env vars
      const originalLogin = process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN;
      delete process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN;

      const { req, res } = createMocks({
        method: 'GET'
      });

      await inventoryHandler(req, res);

      expect(res._getStatusCode()).toBe(200); // Still returns 200 with error in response
      const responseData = JSON.parse(res._getData());
      expect(responseData.error).toContain('Missing environment variables');
      
      // Restore env var
      process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN = originalLogin;
    });
  });

  describe('Filter Stats API Integration', () => {
    it('should return filter statistics structure', async () => {
      const { req, res } = createMocks({
        method: 'GET'
      });

      await filterStatsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      
      // Should have all required properties
      expect(responseData).toHaveProperty('totalProducts');
      expect(responseData).toHaveProperty('vendors');
      expect(responseData).toHaveProperty('productTypes');
      expect(responseData).toHaveProperty('locations');
      expect(responseData).toHaveProperty('quantityRange');
      expect(responseData).toHaveProperty('priceRange');
      expect(responseData).toHaveProperty('generatedAt');
      
      expect(Array.isArray(responseData.vendors)).toBe(true);
      expect(Array.isArray(responseData.productTypes)).toBe(true);
      expect(Array.isArray(responseData.locations)).toBe(true);
      expect(typeof responseData.quantityRange.min).toBe('number');
      expect(typeof responseData.quantityRange.max).toBe('number');
      expect(typeof responseData.priceRange.min).toBe('number');
      expect(typeof responseData.priceRange.max).toBe('number');
    });

    it('should reject non-GET methods for filter stats', async () => {
      const { req, res } = createMocks({
        method: 'DELETE'
      });

      await filterStatsHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const responseData = JSON.parse(res._getData());
      expect(responseData.error).toBe('Method not allowed. Use GET.');
    });
  });

  describe('API consistency tests', () => {
    it('should maintain consistent response structure across different queries', async () => {
      const queries = [
        { search: 'test' },
        { vendor: 'TestVendor' },
        { minQuantity: '10', maxQuantity: '100' },
        { sortBy: 'ProductName', sortOrder: 'desc' },
        { page: '2', limit: '25' }
      ];

      for (const query of queries) {
        const { req, res } = createMocks({
          method: 'GET',
          query
        });

        await inventoryHandler(req, res);

        const responseData = JSON.parse(res._getData());
        
        // All responses should have the same structure
        expect(responseData).toHaveProperty('data');
        expect(responseData).toHaveProperty('total');
        expect(responseData).toHaveProperty('page');
        expect(responseData).toHaveProperty('totalPages');
        expect(responseData).toHaveProperty('limit');
        expect(responseData).toHaveProperty('hasNextPage');
        expect(responseData).toHaveProperty('hasPreviousPage');
        expect(responseData).toHaveProperty('queryOptions');
        expect(responseData).toHaveProperty('processingStats');
        
        expect(Array.isArray(responseData.data)).toBe(true);
        expect(typeof responseData.total).toBe('number');
        expect(typeof responseData.page).toBe('number');
        expect(typeof responseData.totalPages).toBe('number');
        expect(typeof responseData.limit).toBe('number');
        expect(typeof responseData.hasNextPage).toBe('boolean');
        expect(typeof responseData.hasPreviousPage).toBe('boolean');
      }
    });
  });
});