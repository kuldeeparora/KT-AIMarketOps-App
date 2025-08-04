import {
  validateQueryOptions,
  applySearch,
  applyFilters,
  applySorting,
  applyPagination,
  processInventoryData
} from "../utils/inventory";
import { InventoryQueryOptions, StockLevel } from "../types/inventory";

describe('Inventory Utility Functions', () => {
  let mockData: StockLevel[];
  
  beforeEach(() => {
    mockData = [
      {
        SKU: 'PROD-001',
        ProductName: 'Widget A',
        Vendor: 'Vendor Alpha',
        Quantity: 50,
        QuantityAllocated: 5,
        SupplierStockLevel: 55,
        ProductType: 'Electronics',
        Price: 29.99,
        Cost: 19.99,
        IsActive: true,
        Location: 'Warehouse A'
      },
      {
        SKU: 'PROD-002',
        ProductName: 'Gadget B',
        Vendor: 'Vendor Beta',
        Quantity: 100,
        QuantityAllocated: 10,
        SupplierStockLevel: 110,
        ProductType: 'Electronics',
        Price: 49.99,
        Cost: 29.99,
        IsActive: true,
        Location: 'Warehouse B'
      },
      {
        SKU: 'PROD-003',
        ProductName: 'Tool C',
        Vendor: 'Vendor Alpha',
        Quantity: 25,
        QuantityAllocated: 2,
        SupplierStockLevel: 27,
        ProductType: 'Tools',
        Price: 19.99,
        Cost: 9.99,
        IsActive: false,
        Location: 'Warehouse A'
      }
    ];
  });

  describe('validateQueryOptions', () => {
    it('should validate and set defaults for valid options', () => {
      const input = {
        sortBy: 'ProductName',
        sortOrder: 'desc',
        search: 'widget',
        page: '2',
        limit: '25'
      };

      const result = validateQueryOptions(input);

      expect(result.sortBy).toBe('ProductName');
      expect(result.sortOrder).toBe('desc');
      expect(result.search).toBe('widget');
      expect(result.page).toBe(2);
      expect(result.limit).toBe(25);
    });

    it('should reject invalid sort fields and use defaults', () => {
      const input = {
        sortBy: 'InvalidField',
        sortOrder: 'invalid',
        page: '0',
        limit: '-5'
      };

      const result = validateQueryOptions(input);

      expect(result.sortBy).toBeUndefined();
      expect(result.sortOrder).toBe('asc');
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
    });

    it('should handle numeric filters correctly', () => {
      const input = {
        minQuantity: '10',
        maxQuantity: '100',
        minPrice: '20.5',
        maxPrice: '50.99'
      };

      const result = validateQueryOptions(input);

      expect(result.minQuantity).toBe(10);
      expect(result.maxQuantity).toBe(100);
      expect(result.minPrice).toBe(20.5);
      expect(result.maxPrice).toBe(50.99);
    });

    it('should enforce maximum limit', () => {
      const input = {
        limit: '5000'
      };
      const result = validateQueryOptions(input);
      expect(result.limit).toBe(1000);
    });

    it('should handle boolean isActive filter', () => {
      expect(validateQueryOptions({ isActive: true }).isActive).toBe(true);
      expect(validateQueryOptions({ isActive: 'true' }).isActive).toBe(true);
      expect(validateQueryOptions({ isActive: 'false' }).isActive).toBe(false);
      expect(validateQueryOptions({ isActive: 'invalid' }).isActive).toBe(false);
    });
  });

  describe('applySearch', () => {
    it('should return all data when no search term provided', () => {
      const result = applySearch(mockData, '');
      expect(result).toHaveLength(3);
    });

    it('should filter by product name', () => {
      const result = applySearch(mockData, 'widget');
      expect(result).toHaveLength(1);
      expect(result[0].ProductName).toBe('Widget A');
    });

    it('should filter by SKU', () => {
      const result = applySearch(mockData, 'PROD-002');
      expect(result).toHaveLength(1);
      expect(result[0].SKU).toBe('PROD-002');
    });

    it('should filter by vendor (case insensitive)', () => {
      const result = applySearch(mockData, 'alpha');
      expect(result).toHaveLength(2);
    });

    it('should return empty array for no matches', () => {
      const result = applySearch(mockData, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('applyFilters', () => {
    it('should apply vendor filter', () => {
      const options: InventoryQueryOptions = {
        vendor: 'Vendor Alpha'
      };
      const result = applyFilters(mockData, options);
      expect(result).toHaveLength(2);
      expect(result.every(item => item.Vendor === 'Vendor Alpha')).toBe(true);
    });

    it('should apply product type filter', () => {
      const options: InventoryQueryOptions = {
        productType: 'Electronics'
      };
      const result = applyFilters(mockData, options);
      expect(result).toHaveLength(2);
    });

    it('should apply quantity range filters', () => {
      const options: InventoryQueryOptions = {
        minQuantity: 30,
        maxQuantity: 80
      };
      const result = applyFilters(mockData, options);
      expect(result).toHaveLength(1);
      expect(result[0].Quantity).toBe(50);
    });

    it('should apply price range filters', () => {
      const options: InventoryQueryOptions = {
        minPrice: 25,
        maxPrice: 45
      };
      const result = applyFilters(mockData, options);
      expect(result).toHaveLength(1);
      expect(result[0].Price).toBe(29.99);
    });

    it('should apply isActive filter', () => {
      const options: InventoryQueryOptions = {
        isActive: false
      };
      const result = applyFilters(mockData, options);
      expect(result).toHaveLength(1);
      expect(result[0].IsActive).toBe(false);
    });

    it('should apply multiple filters simultaneously', () => {
      const options: InventoryQueryOptions = {
        vendor: 'Vendor Alpha',
        isActive: true,
        minQuantity: 40
      };
      const result = applyFilters(mockData, options);
      expect(result).toHaveLength(1);
      expect(result[0].SKU).toBe('PROD-001');
    });
  });

  describe('applySorting', () => {
    it('should sort by product name ascending', () => {
      const options: InventoryQueryOptions = {
        sortBy: 'ProductName',
        sortOrder: 'asc'
      };
      const result = applySorting(mockData, options);
      expect(result[0].ProductName).toBe('Gadget B');
      expect(result[1].ProductName).toBe('Tool C');
      expect(result[2].ProductName).toBe('Widget A');
    });

    it('should sort by quantity descending', () => {
      const options: InventoryQueryOptions = {
        sortBy: 'Quantity',
        sortOrder: 'desc'
      };
      const result = applySorting(mockData, options);
      expect(result[0].Quantity).toBe(100);
      expect(result[1].Quantity).toBe(50);
      expect(result[2].Quantity).toBe(25);
    });

    it('should handle null values in sorting', () => {
      const dataWithNulls = [
        ...mockData,
        {
          ...mockData[0],
          SKU: 'NULL-PRICE',
          Price: undefined as any
        }
      ];

      const options: InventoryQueryOptions = {
        sortBy: 'Price',
        sortOrder: 'asc'
      };
      const result = applySorting(dataWithNulls, options);
      expect(result[result.length - 1].SKU).toBe('NULL-PRICE');
    });

    it('should return unchanged data when no sort option provided', () => {
      const result = applySorting(mockData, {});
      expect(result).toEqual(mockData);
    });
  });

  describe('applyPagination', () => {
    it('should paginate data correctly', () => {
      const options: InventoryQueryOptions = {
        page: 1, limit: 2
      };
      const result = applyPagination(mockData, options);
      
      expect(result.paginatedData).toHaveLength(2);
      expect(result.totalPages).toBe(2);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(false);
    });

    it('should handle last page correctly', () => {
      const options: InventoryQueryOptions = {
        page: 2, limit: 2
      };
      const result = applyPagination(mockData, options);
      
      expect(result.paginatedData).toHaveLength(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
    });

    it('should handle offset-based pagination', () => {
      const options: InventoryQueryOptions = {
        offset: 1, limit: 2
      };
      const result = applyPagination(mockData, options);
      
      expect(result.paginatedData).toHaveLength(2);
      expect(result.paginatedData[0].SKU).toBe('PROD-002');
    });

    it('should handle empty data', () => {
      const options: InventoryQueryOptions = {
        page: 1, limit: 10
      };
      const result = applyPagination([], options);
      
      expect(result.paginatedData).toHaveLength(0);
      expect(result.totalPages).toBe(0);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });
  });

  describe('processInventoryData', () => {
    it('should process data with all operations', () => {
      const options: InventoryQueryOptions = {
        search: 'Vendor Alpha',
        sortBy: 'Quantity',
        sortOrder: 'desc',
        page: 1,
        limit: 10
      };

      const result = processInventoryData(mockData, options);

      expect(result.processedData).toHaveLength(2);
      expect(result.totalFiltered).toBe(2);
      expect(result.processedData[0].Quantity).toBe(50); // Higher quantity first
      expect(result.processedData[1].Quantity).toBe(25);
    });

    it('should handle complex filtering and pagination', () => {
      const options: InventoryQueryOptions = {
        isActive: true,
        minQuantity: 30,
        sortBy: 'Price',
        sortOrder: 'asc',
        page: 1,
        limit: 1
      };

      const result = processInventoryData(mockData, options);

      expect(result.processedData).toHaveLength(1);
      expect(result.totalFiltered).toBe(2); // Two items match filter
      expect(result.hasNextPage).toBe(true); // But only showing 1
      expect(result.processedData[0].Price).toBe(29.99); // Lowest price first
    });

    it('should handle no results', () => {
      const options: InventoryQueryOptions = {
        search: 'nonexistent',
        page: 1,
        limit: 10
      };

      const result = processInventoryData(mockData, options);

      expect(result.processedData).toHaveLength(0);
      expect(result.totalFiltered).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.hasNextPage).toBe(false);
    });
  });
});