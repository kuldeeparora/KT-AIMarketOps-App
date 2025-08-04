/**
 * Advanced Enterprise Data Service
 * Provides comprehensive interlinking across all business modules
 * Handles complex business relationships and analytics
 */

const { PrismaClient } = require('@prisma/client');
const { validateWithZod } = require('../admin-dashboard/utils/validation');
const { z } = require('zod');

class EnterpriseDataService {
  constructor() {
    this.prisma = new PrismaClient();
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // =============================================================================
  // CUSTOMER 360 DEGREE VIEW
  // =============================================================================

  async getCustomer360(customerId) {
    const cacheKey = `customer360:${customerId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        invoices: {
          include: {
            items: {
              include: {
                product: true
              }
            },
            payments: true
          },
          orderBy: { createdAt: 'desc' }
        },
        estimates: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        loyaltyCard: true,
        payments: {
          orderBy: { paidAt: 'desc' },
          take: 10
        }
      }
    });

    if (!customer) return null;

    // Calculate comprehensive analytics
    const analytics = await this.calculateCustomerAnalytics(customer);
    const behaviorInsights = await this.getCustomerBehaviorInsights(customerId);
    const riskAssessment = await this.assessCustomerRisk(customer);
    const recommendations = await this.generateCustomerRecommendations(customer);

    const result = {
      customer,
      analytics,
      behaviorInsights,
      riskAssessment,
      recommendations,
      summary: {
        totalOrders: customer.orders.length,
        totalInvoices: customer.invoices.length,
        totalEstimates: customer.estimates.length,
        totalInteractions: customer.interactions.length,
        loyaltyPoints: customer.loyaltyCard?.points || 0,
        lastOrderDate: customer.orders[0]?.orderDate || null,
        lastInteraction: customer.interactions[0]?.createdAt || null
      }
    };

    this.setCache(cacheKey, result);
    return result;
  }

  async calculateCustomerAnalytics(customer) {
    const totalSpent = customer.invoices
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const totalOrders = customer.orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    const monthlySpending = this.calculateMonthlySpending(customer.invoices);
    const productPreferences = this.analyzeProductPreferences(customer.orders);
    const paymentBehavior = this.analyzePaymentBehavior(customer.payments, customer.invoices);

    return {
      totalSpent,
      totalOrders,
      averageOrderValue,
      monthlySpending,
      productPreferences,
      paymentBehavior,
      customerLifetimeValue: this.calculateCLV(customer),
      profitability: await this.calculateCustomerProfitability(customer)
    };
  }

  // =============================================================================
  // PRODUCT INTELLIGENCE
  // =============================================================================

  async getProductIntelligence(productId) {
    const cacheKey = `productIntel:${productId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        supplier: true,
        inventoryMovements: {
          orderBy: { movementDate: 'desc' },
          take: 50
        },
        orderItems: {
          include: {
            order: {
              include: {
                customer: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        stockAlerts: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) return null;

    const analytics = await this.calculateProductAnalytics(product);
    const demandForecast = await this.generateDemandForecast(product);
    const supplierPerformance = await this.analyzeSupplierPerformance(product.supplier);
    const competitorAnalysis = await this.getCompetitorAnalysis(product);
    const recommendations = await this.generateProductRecommendations(product, analytics);

    const result = {
      product,
      analytics,
      demandForecast,
      supplierPerformance,
      competitorAnalysis,
      recommendations,
      realTimeStatus: {
        currentStock: product.currentStock,
        reservedStock: product.reservedStock,
        availableStock: product.availableStock,
        reorderNeeded: product.currentStock <= product.reorderPoint,
        stockStatus: this.getStockStatus(product),
        lastMovement: product.inventoryMovements[0]?.movementDate || null
      }
    };

    this.setCache(cacheKey, result);
    return result;
  }

  async calculateProductAnalytics(product) {
    const salesHistory = product.orderItems;
    const totalSold = salesHistory.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = salesHistory.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalCost = salesHistory.reduce((sum, item) => sum + (item.costPrice || 0) * item.quantity, 0);
    
    const salesVelocity = this.calculateSalesVelocity(salesHistory);
    const seasonalTrends = this.analyzeSeasonalTrends(salesHistory);
    const customerSegments = this.analyzeCustomerSegments(salesHistory);
    const priceElasticity = this.calculatePriceElasticity(salesHistory);

    return {
      totalSold,
      totalRevenue,
      totalCost,
      profitMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
      salesVelocity,
      seasonalTrends,
      customerSegments,
      priceElasticity,
      turnoverRate: this.calculateTurnoverRate(product),
      stockoutFrequency: this.calculateStockoutFrequency(product.inventoryMovements),
      averageOrderQuantity: salesHistory.length > 0 ? totalSold / salesHistory.length : 0
    };
  }

  // =============================================================================
  // INVENTORY OPTIMIZATION
  // =============================================================================

  async getInventoryOptimization() {
    const products = await this.prisma.product.findMany({
      include: {
        supplier: true,
        inventoryMovements: {
          where: {
            movementDate: {
              gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
            }
          }
        },
        orderItems: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            }
          }
        },
        stockAlerts: {
          where: { isActive: true }
        }
      }
    });

    const optimization = {
      overallHealth: this.calculateInventoryHealth(products),
      reorderRecommendations: await this.generateReorderRecommendations(products),
      slowMovingItems: this.identifySlowMovingItems(products),
      fastMovingItems: this.identifyFastMovingItems(products),
      deadStock: this.identifyDeadStock(products),
      overstockItems: this.identifyOverstockItems(products),
      stockoutRisk: this.assessStockoutRisk(products),
      costOptimization: await this.analyzeCostOptimization(products),
      supplierPerformance: await this.analyzeAllSuppliersPerformance(products),
      abcAnalysis: this.performABCAnalysis(products),
      seasonalAdjustments: this.calculateSeasonalAdjustments(products)
    };

    return optimization;
  }

  async generateReorderRecommendations(products) {
    const recommendations = [];

    for (const product of products) {
      const salesVelocity = this.calculateSalesVelocity(product.orderItems);
      const leadTime = product.supplier?.leadTime || 7;
      const safetyStock = Math.ceil(salesVelocity.daily * leadTime * 1.5);
      const reorderPoint = Math.ceil(salesVelocity.daily * leadTime + safetyStock);
      const economicOrderQuantity = this.calculateEOQ(product, salesVelocity);

      if (product.currentStock <= reorderPoint) {
        recommendations.push({
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          currentStock: product.currentStock,
          reorderPoint,
          recommendedQuantity: economicOrderQuantity,
          urgency: this.calculateUrgency(product.currentStock, salesVelocity.daily),
          supplier: product.supplier,
          estimatedCost: economicOrderQuantity * product.costPrice,
          daysUntilStockout: Math.floor(product.currentStock / (salesVelocity.daily || 1)),
          reasoning: [
            `Current stock (${product.currentStock}) below reorder point (${reorderPoint})`,
            `Daily sales velocity: ${salesVelocity.daily.toFixed(2)} units`,
            `Supplier lead time: ${leadTime} days`,
            `Economic order quantity: ${economicOrderQuantity} units`
          ]
        });
      }
    }

    return recommendations.sort((a, b) => b.urgency - a.urgency);
  }

  // =============================================================================
  // FINANCIAL ANALYTICS
  // =============================================================================

  async getFinancialAnalytics(dateRange = {}) {
    const startDate = dateRange.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const endDate = dateRange.endDate || new Date();

    const [invoices, payments, orders, customers] = await Promise.all([
      this.prisma.invoice.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        },
        include: { customer: true, items: { include: { product: true } }, payments: true }
      }),
      this.prisma.payment.findMany({
        where: {
          paidAt: { gte: startDate, lte: endDate }
        },
        include: { customer: true, invoice: true }
      }),
      this.prisma.order.findMany({
        where: {
          orderDate: { gte: startDate, lte: endDate }
        },
        include: { customer: true, items: { include: { product: true } } }
      }),
      this.prisma.customer.findMany({
        include: { invoices: true, orders: true }
      })
    ]);

    return {
      revenue: this.calculateRevenueMetrics(invoices, payments),
      profitability: await this.calculateProfitabilityMetrics(orders),
      cashFlow: this.analyzeCashFlow(payments, invoices),
      customerMetrics: this.calculateCustomerFinancialMetrics(customers),
      productProfitability: await this.analyzeProductProfitability(orders),
      trends: this.analyzeTrends(invoices, payments, orders),
      forecasting: await this.generateFinancialForecast(invoices, payments),
      kpis: this.calculateFinancialKPIs(invoices, payments, customers)
    };
  }

  calculateRevenueMetrics(invoices, payments) {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
    const outstandingAmount = totalInvoiced - totalPaid;
    const overdueInvoices = invoices.filter(inv => 
      inv.status !== 'PAID' && new Date(inv.dueDate) < new Date()
    );

    return {
      totalInvoiced,
      totalPaid,
      outstandingAmount,
      overdueAmount: overdueInvoices.reduce((sum, inv) => sum + inv.balanceAmount, 0),
      collectionRate: totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0,
      averageInvoiceValue: invoices.length > 0 ? totalInvoiced / invoices.length : 0,
      averagePaymentTime: this.calculateAveragePaymentTime(payments, invoices)
    };
  }

  // =============================================================================
  // BUSINESS INTELLIGENCE & REPORTING
  // =============================================================================

  async generateExecutiveDashboard(dateRange = {}) {
    const startDate = dateRange.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = dateRange.endDate || new Date();

    const [
      salesMetrics,
      inventoryMetrics,
      customerMetrics,
      financialMetrics,
      operationalMetrics
    ] = await Promise.all([
      this.getSalesMetrics(startDate, endDate),
      this.getInventoryMetrics(),
      this.getCustomerMetrics(startDate, endDate),
      this.getFinancialAnalytics({ startDate, endDate }),
      this.getOperationalMetrics(startDate, endDate)
    ]);

    const insights = await this.generateBusinessInsights({
      salesMetrics,
      inventoryMetrics,
      customerMetrics,
      financialMetrics,
      operationalMetrics
    });

    return {
      period: { startDate, endDate },
      salesMetrics,
      inventoryMetrics,
      customerMetrics,
      financialMetrics,
      operationalMetrics,
      insights,
      alerts: await this.generateExecutiveAlerts(),
      recommendations: await this.generateExecutiveRecommendations()
    };
  }

  async generateBusinessInsights(metrics) {
    const insights = [];

    // Sales insights
    if (metrics.salesMetrics.growth > 20) {
      insights.push({
        type: 'POSITIVE',
        category: 'SALES',
        message: `Sales growth of ${metrics.salesMetrics.growth.toFixed(1)}% indicates strong performance`,
        impact: 'HIGH',
        action: 'Consider increasing inventory levels for top-selling products'
      });
    }

    // Inventory insights
    if (metrics.inventoryMetrics.turnoverRate < 2) {
      insights.push({
        type: 'WARNING',
        category: 'INVENTORY',
        message: 'Low inventory turnover rate detected',
        impact: 'MEDIUM',
        action: 'Review slow-moving items and consider promotional activities'
      });
    }

    // Customer insights
    if (metrics.customerMetrics.churnRate > 15) {
      insights.push({
        type: 'ALERT',
        category: 'CUSTOMER',
        message: `Customer churn rate of ${metrics.customerMetrics.churnRate.toFixed(1)}% is above optimal`,
        impact: 'HIGH',
        action: 'Implement customer retention strategy and improve engagement'
      });
    }

    return insights;
  }

  // =============================================================================
  // ADVANCED SEARCH AND RECOMMENDATIONS
  // =============================================================================

  async intelligentSearch(query, filters = {}) {
    const searchResults = {
      customers: [],
      products: [],
      orders: [],
      invoices: [],
      suppliers: []
    };

    // Multi-entity search with relevance scoring
    if (query) {
      const searchTerm = `%${query}%`;
      
      // Search customers
      searchResults.customers = await this.prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          orders: { take: 3, orderBy: { createdAt: 'desc' } },
          invoices: { take: 3, orderBy: { createdAt: 'desc' } }
        },
        take: 10
      });

      // Search products
      searchResults.products = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { brand: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          supplier: true
        },
        take: 10
      });

      // Continue with other entities...
    }

    // Apply filters
    if (filters.category) {
      searchResults.products = searchResults.products.filter(p => p.category === filters.category);
    }

    if (filters.dateRange) {
      // Apply date filters to relevant entities
    }

    return {
      query,
      filters,
      results: searchResults,
      totalResults: Object.values(searchResults).reduce((sum, arr) => sum + arr.length, 0),
      suggestions: await this.generateSearchSuggestions(query, searchResults)
    };
  }

  async generateRecommendations(context) {
    const recommendations = [];

    switch (context.type) {
      case 'CUSTOMER':
        recommendations.push(...await this.generateCustomerRecommendations(context.data));
        break;
      case 'PRODUCT':
        recommendations.push(...await this.generateProductRecommendations(context.data));
        break;
      case 'INVENTORY':
        recommendations.push(...await this.generateInventoryRecommendations(context.data));
        break;
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  calculateSalesVelocity(orderItems) {
    if (orderItems.length === 0) return { daily: 0, weekly: 0, monthly: 0 };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentItems = orderItems.filter(item => 
      new Date(item.createdAt) >= thirtyDaysAgo
    );
    const weeklyItems = orderItems.filter(item => 
      new Date(item.createdAt) >= sevenDaysAgo
    );

    const monthlyQuantity = recentItems.reduce((sum, item) => sum + item.quantity, 0);
    const weeklyQuantity = weeklyItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      daily: monthlyQuantity / 30,
      weekly: weeklyQuantity,
      monthly: monthlyQuantity
    };
  }

  calculateEOQ(product, velocity) {
    const demandRate = velocity.monthly || 1;
    const orderingCost = 50; // Assumed ordering cost
    const holdingCost = product.costPrice * 0.2; // 20% holding cost
    
    if (holdingCost === 0) return product.reorderQuantity;
    
    const eoq = Math.sqrt((2 * demandRate * orderingCost) / holdingCost);
    return Math.max(1, Math.ceil(eoq));
  }

  getStockStatus(product) {
    if (product.currentStock === 0) return 'OUT_OF_STOCK';
    if (product.currentStock <= product.reorderPoint) return 'REORDER_NEEDED';
    if (product.currentStock <= product.minStockLevel) return 'LOW_STOCK';
    if (product.currentStock >= product.maxStockLevel) return 'OVERSTOCK';
    return 'HEALTHY';
  }

  calculateUrgency(currentStock, dailyVelocity) {
    if (currentStock === 0) return 100;
    if (dailyVelocity === 0) return 0;
    
    const daysRemaining = currentStock / dailyVelocity;
    if (daysRemaining <= 1) return 95;
    if (daysRemaining <= 3) return 80;
    if (daysRemaining <= 7) return 60;
    if (daysRemaining <= 14) return 40;
    return 20;
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Database connection cleanup
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

// Export singleton instance
const enterpriseDataService = new EnterpriseDataService();

module.exports = {
  EnterpriseDataService,
  enterpriseDataService
};
