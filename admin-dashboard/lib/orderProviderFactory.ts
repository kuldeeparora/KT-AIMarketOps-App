/**
 * Order Provider Factory
 */

export interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
}

export interface OrderProviderConfig {
  apiKey?: string;
  shopDomain?: string;
  [key: string]: unknown;
  }

export interface OrderProvider {
  getOrders(): Promise<Order[]>;
  updateOrder(order: Order): Promise<boolean>;
  }

export class OrderProviderFactory {
  /**
   * Create order provider based on type
   * @param type - Provider type
   * @param config - Provider configuration
   * @returns Order provider instance
   */
  static createProvider(type: string, config: OrderProviderConfig): OrderProvider {
    switch (type.toLowerCase()) {
      case 'shopify':
        return new ShopifyOrderProvider(config);
      case 'sellerdynamics':
        return new SellerDynamicsOrderProvider(config);
      case 'mock': return new MockOrderProvider(config);
    default: throw new Error(`Unknown order provider type: ${type}`);
  }
  }
}

class ShopifyOrderProvider implements OrderProvider {
  constructor(private config: OrderProviderConfig) {}

  async getOrders(): Promise<Order[]> {
    // Mock implementation
    return [
      { id: 1, customer: 'John Doe', total: 99.99, status: 'pending' },
      { id: 2, customer: 'Jane Smith', total: 149.99, status: 'completed' }
    ];
  }

  async updateOrder(_order: Order): Promise<boolean> {
    // Mock implementation
    return true;
  }
}

class SellerDynamicsOrderProvider implements OrderProvider {
  constructor(private config: OrderProviderConfig) {}

  async getOrders(): Promise<Order[]> {
    // Mock implementation
    return [
      { id: 1, customer: 'John Doe', total: 99.99, status: 'pending' },
      { id: 2, customer: 'Jane Smith', total: 149.99, status: 'completed' }
    ];
  }

  async updateOrder(_order: Order): Promise<boolean> {
    // Mock implementation
    return true;
  }
}

class MockOrderProvider implements OrderProvider {
  constructor(private config: OrderProviderConfig) {}

  async getOrders(): Promise<Order[]> {
    // Mock implementation
    return [
      { id: 1, customer: 'John Doe', total: 99.99, status: 'pending' },
      { id: 2, customer: 'Jane Smith', total: 149.99, status: 'completed' }
    ];
  }

  async updateOrder(_order: Order): Promise<boolean> {
    // Mock implementation
    return true;
  }
}
