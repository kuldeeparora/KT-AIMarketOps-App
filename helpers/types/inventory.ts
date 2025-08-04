export interface StockLevel {
  SKU: string;
  ProductName: string;
  Vendor: string;
  Quantity: number;
  QuantityAllocated: number;
  SupplierStockLevel: number;
  ProductType: string;
  Price?: number;
  Cost?: number;
  Weight?: number;
  LastUpdated?: string;
  IsActive?: boolean;
  Location?: string;
  [key: string]: any;
}

export interface InventoryQueryOptions {
  // Sorting
  sortBy?: 'SKU' | 'ProductName' | 'Vendor' | 'Quantity' | 'QuantityAllocated' | 'SupplierStockLevel' | 'ProductType' | 'Price' | 'LastUpdated';
  sortOrder?: 'asc' | 'desc';
  
  // Filtering
  search?: string;
  vendor?: string;
  productType?: string;
  location?: string;
  isActive?: boolean;
  
  // Numeric filters
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  minCost?: number;
  maxCost?: number;
  
  // Pagination
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  error?: string;
}

export interface InventoryFilterStats {
  totalProducts: number;
  filteredProducts: number;
  vendors: string[];
  productTypes: string[];
  locations: string[];
  quantityRange: { min: number; max: number };
  priceRange: { min: number; max: number };
}

export interface InventoryProvider {
  getStockLevels(options: InventoryQueryOptions): Promise<PaginatedResult<StockLevel>>;
  getFilterStats(): Promise<InventoryFilterStats>;
}

// Validation schema for API parameters
export const VALID_SORT_FIELDS = [
  'SKU', 'ProductName', 'Vendor', 'Quantity', 'QuantityAllocated', 
  'SupplierStockLevel', 'ProductType', 'Price', 'LastUpdated'
] as const;

export const VALID_SORT_ORDERS = ['asc', 'desc'] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 50,
  maxLimit: 1000
} as const;

// Additional interfaces for enhanced provider system
export interface FilterStats {
  totalProducts: number;
  categories: { name: string; count: number }[];
  vendors: { name: string; count: number }[];
  locations: { name: string; count: number }[];
  stockStatus: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
}

export interface InventoryResponse {
  success: boolean;
  data: StockLevel[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters?: any;
  error?: string;
  metadata?: {
    provider: string;
    timestamp: string;
    queryOptions?: InventoryQueryOptions;
    [key: string]: any;
  };
}
