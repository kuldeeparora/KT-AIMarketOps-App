/**
 * Inventory type definitions
 */

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  price?: number;
  vendor?: string;
  category?: string;
  sku?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
  vendor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface InventoryProvider {
  getInventory(): Promise<InventoryItem[]>;
  updateInventory(item: InventoryItem): Promise<boolean>;
  getStockLevels(options?: InventoryQueryOptions): Promise<PaginatedResult<InventoryItem>>;
}

export interface AlertThreshold {
  id: string;
  name: string;
  condition: string;
  value: number;
  action: string;
  enabled: boolean;
}

export interface InventoryMetrics {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  averagePrice: number;
  topVendors: Array<{
    name: string;
    count: number;
    value: number;
  }>;
}
