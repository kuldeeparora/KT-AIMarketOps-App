import "@testing-library/jest-dom";
import { expect, jest, describe, it, beforeAll, afterAll, beforeEach, afterEach } from "@jest/globals";

// Import types
import type { InventoryItem } from "../types/inventory";

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })
}));

// Mock environment variables
process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN = 'test-encrypted-login';
process.env.SELLERDYNAMICS_RETAILER_ID = 'test-retailer-id';
process.env.SELLERDYNAMICS_SOAP_ENDPOINT = 'https://test.sellerdynamics.com/';

// Define interface for stock level
interface StockLevel {
  id: string;
  sku: string;
  productName: string;
  currentStock: number;
  allocatedStock: number;
  availableStock: number;
  incomingStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  lastUpdated: string;
  location: string;
  status: string;
  [key: string]: unknown; // For any additional properties
}

// Global test helpers
global.createMockStockLevel = (overrides: Partial<InventoryItem> = {}): InventoryItem => {
  const quantity = overrides.quantity ?? Math.floor(Math.random() * 1000);
  
  return {
    id: overrides.id ?? Math.floor(Math.random() * 10000),
    name: overrides.name ?? `Product ${Math.floor(Math.random() * 1000)}`,
    quantity: quantity,
    price: overrides.price ?? Math.floor(Math.random() * 100) + 10,
    ...overrides
  };
};

// Create mock inventory data
global.createMockInventoryData = (count = 5): InventoryItem[] => {
  return Array.from({ length: count }, (_, index) => {
    const baseData: Partial<InventoryItem> = {
      id: index + 1,
      name: `Test Product ${index + 1}`,
      quantity: (index + 1) * 10,
      price: (index + 1) * 9.99
    };
    
    return global.createMockStockLevel(baseData);
  });
};