/**
 * Mock Inventory Provider for testing
 */

import {
  InventoryProvider, InventoryItem, PaginatedResult
} from '../types/inventory';

export class MockInventoryProvider implements InventoryProvider {
  private mockData: InventoryItem[] = [
    { id: 1, name: 'Test Product 1', quantity: 10, price: 29.99 },
    { id: 2, name: 'Test Product 2', quantity: 5, price: 49.99 },
    { id: 3, name: 'Test Product 3', quantity: 15, price: 19.99 }
  ];

  async getInventory(): Promise<InventoryItem[]> {
    return this.mockData;
  }

  async updateInventory(_item: InventoryItem): Promise<boolean> {
    const index = this.mockData.findIndex(product => product.id === _item.id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ..._item };
      return true;
    }
    return false;
  }

  async getStockLevels(): Promise<PaginatedResult<InventoryItem>> {
    return {
      data: this.mockData,
      page: 1,
      totalPages: 1,
      total: this.mockData.length,
      limit: this.mockData.length,
      hasNextPage: false,
      hasPreviousPage: false
  };
  }

  async getFilterStats(): Promise<{
    categories: string[];
    brands: string[];
    priceRanges: string[];
  }> {
    return {
      categories: ['Electronics', 'Clothing', 'Books'],
      brands: ['Brand A', 'Brand B', 'Brand C'],
      priceRanges: ['0-10', '10-50', '50+']
    };
  }
}
