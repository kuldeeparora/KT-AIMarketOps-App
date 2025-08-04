/**
 * Inventory utility functions
 */

import {
  InventoryItem, InventoryQueryOptions, PaginatedResult
} from '../types/inventory';

export function calculateInventoryMetrics(items: InventoryItem[]): {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  averagePrice: number;
} {
  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity <= 10).length;
  const outOfStockItems = items.filter(item => item.quantity === 0).length;
  const totalValue = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;

  return {
    totalItems,
    lowStockItems,
    outOfStockItems,
    totalValue,
    averagePrice
  };
}

export function filterInventory(
  items: InventoryItem[],
  options: InventoryQueryOptions,
): InventoryItem[] {
  let filtered = [...items];

  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      item.sku?.toLowerCase().includes(searchLower) ||
      item.vendor?.toLowerCase().includes(searchLower)
    );
  }

  if (options.category) {
    filtered = filtered.filter(item => item.category === options.category);
  }

  if (options.vendor) {
    filtered = filtered.filter(item => item.vendor === options.vendor);
  }

  return filtered;
}

export function sortInventory(
  items: InventoryItem[],
  sortBy: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
): InventoryItem[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortBy as keyof InventoryItem];
    const bValue = b[sortBy as keyof InventoryItem];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

export function paginateInventory(
  items: InventoryItem[],
  page: number = 1,
  limit: number = 10,
): PaginatedResult<InventoryItem> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = items.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    page,
    totalPages: Math.ceil(items.length / limit),
    total: items.length,
    limit,
    hasNextPage: endIndex < items.length,
    hasPreviousPage: page > 1
  };
}
