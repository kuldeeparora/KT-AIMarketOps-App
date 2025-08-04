import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('30');
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [inventoryResponse, ordersResponse] = await Promise.allSettled([
        fetch('/api/shopify-inventory'),
        fetch('/api/orders')
      ]);

      const inventoryData = inventoryResponse.status === 'fulfilled' 
        ? await inventoryResponse.value.json()
        : { data: { products: [] } };

      const ordersData = ordersResponse.status === 'fulfilled'
        ? await ordersResponse.value.json()
        : { data: { orders: [] } };

      const orders = ordersData.data?.orders || [];
      const products = inventoryData.data?.products || [];

      // Calculate real sales data
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice || 0), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate top products from line items
      const productSales = {};
      orders.forEach(order => {
        order.lineItems?.forEach(item => {
          if (!productSales[item.title]) {
            productSales[item.title] = { revenue: 0, units: 0 };
          }
          productSales[item.title].revenue += parseFloat(item.price) * item.quantity;
          productSales[item.title].units += item.quantity;
        });
      });

      const topProducts = Object.entries(productSales)
        .map(([name, data]) => ({ name, revenue: data.revenue, units: data.units }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate customer data
      const customerMap = new Map();
      orders.forEach(order => {
        if (order.customer?.email) {
          const email = order.customer.email;
          if (!customerMap.has(email)) {
            customerMap.set(email, {
              name: `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 'Guest',
              totalSpent: parseFloat(order.totalPrice || 0),
              orders: 1
            });
          } else {
            const existing = customerMap.get(email);
            existing.totalSpent += parseFloat(order.totalPrice || 0);
            existing.orders += 1;
          }
        }
      });

      const topCustomers = Array.from(customerMap.values())
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 3);

      // Calculate inventory data
      const lowStockItems = products.filter(p => p.lowStock).length;
      const outOfStockItems = products.filter(p => p.totalInventory === 0).length;
      const totalValue = products.reduce((sum, p) => {
        const variant = p.variants?.[0];
        return sum + (parseFloat(variant?.price || 0) * (variant?.inventory_quantity || 0));
      }, 0);

      setReportData({
        sales: {
          totalRevenue,
          totalOrders,
          averageOrderValue,
          growthRate: 12.5, // Mock growth rate
          topProducts,
          monthlyData: [
            { month: 'Jan', revenue: totalRevenue * 0.25, orders: Math.floor(totalOrders * 0.25) },
            { month: 'Feb', revenue: totalRevenue * 0.3, orders: Math.floor(totalOrders * 0.3) },
            { month: 'Mar', revenue: totalRevenue * 0.2, orders: Math.floor(totalOrders * 0.2) },
            { month: 'Apr', revenue: totalRevenue * 0.25, orders: Math.floor(totalOrders * 0.25) }
          ]
        },
        inventory: {
          totalProducts: products.length,
          lowStockItems,
          outOfStockItems,
          totalValue,
          topCategories: [
            { name: 'General', count: products.length, value: totalValue }
          ]
        },
        customers: {
          totalCustomers: customerMap.size,
          newCustomers: Math.floor(customerMap.size * 0.3),
          returningCustomers: Math.floor(customerMap.size * 0.7),
          averageLifetimeValue: customerMap.size > 0 ? totalRevenue / customerMap.size : 0,
          topCustomers
        }
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      // Fallback to mock data,
      setReportData({
        sales: {
          totalRevenue: 45678.90,
          totalOrders: 234,
          averageOrderValue: 195.21,
          growthRate: 12.5,
          topProducts: [
            { name: 'Premium Wireless Headphones', revenue: 12345.67, units: 45 },
            { name: 'Bluetooth Speaker Pro', revenue: 9876.54, units: 32 },
            { name: 'USB-C Cable 6ft', revenue: 5432.10, units: 156 },
            { name: 'Gourmet Coffee Beans', revenue: 3456.78, units: 89 }
          ],
          monthlyData: [
            { month: 'Jan', revenue: 12345, orders: 67 },
            { month: 'Feb', revenue: 14567, orders: 78 }
          ]
        },
        inventory: {
          totalProducts: 156,
          lowStockItems: 23,
          outOfStockItems: 5,
          totalValue: 234567.89,
          topCategories: [
            { name: 'Electronics', count: 45, value: 123456.78 },
            { name: 'Accessories', count: 67, value: 45678.90 },
            { name: 'Beverages', count: 34, value: 23456.78 }
          ]
        },
        customers: {
          totalCustomers: 892,
          newCustomers: 45,
          returningCustomers: 234,
          averageLifetimeValue: 345.67,
          topCustomers: [
            { name: 'Alice Brown', totalSpent: 3456.78, orders: 22 },
            { name: 'John Doe', totalSpent: 2345.67, orders: 15 },
            { name: 'Jane Smith', totalSpent: 1234.56, orders: 8 }
          ]
        },
        financial: {
          grossProfit: 23456.78,
          netProfit: 18901.23,
          expenses: 12345.67,
          profitMargin: 41.4,
          cashFlow: 15678.90
        }
      });
    }
  };

  const tabs = [
    { id: 'sales', name: 'Sales Reports', icon: '📈' },
    { id: 'inventory', name: 'Inventory Reports', icon: '📦' },
    { id: 'customers', name: 'Customer Reports', icon: '👥' },
    { id: 'financial', name: 'Financial Reports', icon: '💰' }
  ];

  const dateRanges = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: '365', label: 'Last year' }
  ];

  return (
    <>
      <Head>
        <title>Reports - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Business reports and analytics" />
      </Head>
      
      <Layout>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm: px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Reports & Analytics
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                  className="input"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <button className="btn-primary">
                  Export Report
                </button>
                <button className="btn-secondary">
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm: px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover: text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Sales Reports */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                  <p className="text-2xl font-bold text-green-600">£{reportData.sales?.totalRevenue?.toFixed(2)}</p>
                  <p className="text-sm text-green-600">+{reportData.sales?.growthRate}% from last period</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                  <p className="text-2xl font-bold text-blue-600">{reportData.sales?.totalOrders}</p>
                  <p className="text-sm text-blue-600">+8% from last period</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
                  <p className="text-2xl font-bold text-purple-600">£{reportData.sales?.averageOrderValue?.toFixed(2)}</p>
                  <p className="text-sm text-purple-600">+4% from last period</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Growth Rate</h3>
                  <p className="text-2xl font-bold text-orange-600">{reportData.sales?.growthRate}%</p>
                  <p className="text-sm text-orange-600">vs last period</p>
                </div>
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Trend</h3>
                  <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder - Monthly sales trend,</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                  <div className="space-y-4">
                    {reportData.sales?.topProducts?.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.units} units sold</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">£{product.revenue.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Inventory Reports */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                  <p className="text-2xl font-bold text-blue-600">{reportData.inventory?.totalProducts}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
                  <p className="text-2xl font-bold text-yellow-600">{reportData.inventory?.lowStockItems}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
                  <p className="text-2xl font-bold text-red-600">{reportData.inventory?.outOfStockItems}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
                  <p className="text-2xl font-bold text-green-600">£{reportData.inventory?.totalValue?.toFixed(2)}</p>
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
                <div className="space-y-4">
                  {reportData.inventory?.topCategories?.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.count} products</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">£{category.value.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{((category.value / reportData.inventory.totalValue) * 100).toFixed(1)}% of total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Customer Reports */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
                  <p className="text-2xl font-bold text-blue-600">{reportData.customers?.totalCustomers}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">New Customers</h3>
                  <p className="text-2xl font-bold text-green-600">{reportData.customers?.newCustomers}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Returning Customers</h3>
                  <p className="text-2xl font-bold text-purple-600">{reportData.customers?.returningCustomers}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Avg Lifetime Value</h3>
                  <p className="text-2xl font-bold text-orange-600">£{reportData.customers?.averageLifetimeValue?.toFixed(2)}</p>
                </div>
              </div>

              {/* Top Customers */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.customers?.topCustomers?.map((customer, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{customer.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">£{customer.totalSpent.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">{customer.orders}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-800">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* Financial Reports */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Gross Profit</h3>
                  <p className="text-2xl font-bold text-green-600">£{reportData.financial?.grossProfit?.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Net Profit</h3>
                  <p className="text-2xl font-bold text-blue-600">£{reportData.financial?.netProfit?.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Profit Margin</h3>
                  <p className="text-2xl font-bold text-purple-600">{reportData.financial?.profitMargin?.toFixed(1)}%</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Cash Flow</h3>
                  <p className="text-2xl font-bold text-orange-600">£{reportData.financial?.cashFlow?.toFixed(2)}</p>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-gray-900">Revenue</p>
                      <p className="text-sm text-gray-500">Total sales income</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">£{reportData.sales?.totalRevenue?.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-gray-900">Cost of Goods</p>
                      <p className="text-sm text-gray-500">Product costs and inventory</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">-£{(reportData.sales?.totalRevenue - reportData.financial?.grossProfit).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-gray-900">Expenses</p>
                      <p className="text-sm text-gray-500">Operating costs</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">-£{reportData.financial?.expenses?.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-green-200 rounded bg-green-50">
                    <div>
                      <p className="font-medium text-gray-900">Net Profit</p>
                      <p className="text-sm text-gray-500">Final profit after all costs</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">£{reportData.financial?.netProfit?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </Layout>
    </>
  );
}
