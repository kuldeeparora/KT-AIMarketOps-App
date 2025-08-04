import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SalesChart from '../components/analytics/SalesChart';
import OrdersChart from '../components/analytics/OrdersChart';

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    loading: true,
    error: null,
    stats: {
    totalSales: 0,
      orders: 0,
      customers: 0,
      averageOrder: 0
  },
    trends: {
    salesGrowth: 0,
      orderGrowth: 0,
      customerGrowth: 0
  }
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setAnalyticsData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch data from APIs
        const [ordersResponse, inventoryResponse] = await Promise.allSettled([
  fetch('/api/orders'),
  fetch('/api/shopify-inventory')
]);

        const ordersData =
          ordersResponse.status === 'fulfilled'
            ? await ordersResponse.value.json()
            : { data: { orders: [] } };
        const inventoryData =
          inventoryResponse.status === 'fulfilled'
            ? await inventoryResponse.value.json()
            : { data: { products: [] } };

        const orders = ordersData.data?.orders || [];
        const products = inventoryData.data?.products || [];

        // Calculate analytics
        const totalSales = orders.reduce(
          (sum, order) => sum + parseFloat(order.totalPrice || 0),
          0
        );
        const totalOrders = orders.length;
        const uniqueCustomers = new Set(orders.map(order => order.customer?.email || 'guest')).size;
        const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

        // Calculate trend,s (simplified - in real app you'd compare with previous period)
        const salesGrowth = -12; // Mock growth percentage
        const orderGrowth = -8;
        const customerGrowth = -15;

        setAnalyticsData({
          loading: false,
          error: null,
          stats: {
            totalSales,
            orders: totalOrders,
            customers: uniqueCustomers,
            averageOrder},
          trends: {
            salesGrowth,
            orderGrowth,
            customerGrowth}});
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setAnalyticsData(prev => ({
          ...prev,
          loading: false,
          error: error.message}));
  }
    };

    fetchAnalyticsData();
  }, []);

  if (analyticsData.loading) {
    return (
      <Layout>
        <div className='min-h-full'>
          <div className='bg-white shadow'>
            <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
              <h1 className='text-3xl font-bold text-gray-900'>Analytics</h1>
              <p className='mt-2 text-sm text-gray-600'>
                Business insights and performance metrics
              </p>
            </div>
          </div>
          <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-center min-h-64'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                <p className='mt-4 text-gray-600'>Loading analytics data...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (analyticsData.error) {
    return (
      <Layout>
        <div className='min-h-full'>
          <div className='bg-white shadow'>
            <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
              <h1 className='text-3xl font-bold text-gray-900'>Analytics</h1>
              <p className='mt-2 text-sm text-gray-600'>
                Business insights and performance metrics
              </p>
            </div>
          </div>
          <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
            <div className='bg-red-50 border border-red-200 rounded-md p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>Error loading analytics data</h3>
                  <div className='mt-2 text-sm text-red-700'>{analyticsData.error}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='min-h-full'>
        {/* Header */}
        <div className='bg-white shadow'>
          <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-3xl font-bold text-gray-900'>Analytics</h1>
            <p className='mt-2 text-sm text-gray-600'>Business insights and performance metrics</p>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
            <div className='bg-white overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 bg-green-500 rounded-md flex items-center justify-center'>
                      <span className='text-white text-sm font-medium'>£</span>
                    </div>
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 truncate'>Total Sales</dt>
                      <dd className='text-lg font-medium text-gray-900'>
                        £{analyticsData.stats.totalSales.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className='bg-red-50 px-5 py-3'>
                <div className='text-sm'>
                  <span className='text-red-600 font-medium'>
                    {analyticsData.trends.salesGrowth}%
                  </span>
                  <span className='text-gray-500'> from last month</span>
                </div>
              </div>
            </div>

            <div className='bg-white overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center'>
                      <span className='text-white text-sm font-medium'>📦</span>
                    </div>
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 truncate'>Total Orders</dt>
                      <dd className='text-lg font-medium text-gray-900'>
                        {analyticsData.stats.orders}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className='bg-red-50 px-5 py-3'>
                <div className='text-sm'>
                  <span className='text-red-600 font-medium'>
                    {analyticsData.trends.orderGrowth}%
                  </span>
                  <span className='text-gray-500'> from last month</span>
                </div>
              </div>
            </div>

            <div className='bg-white overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center'>
                      <span className='text-white text-sm font-medium'>👥</span>
                    </div>
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 truncate'>
                        Total Customers
                      </dt>
                      <dd className='text-lg font-medium text-gray-900'>
                        {analyticsData.stats.customers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className='bg-red-50 px-5 py-3'>
                <div className='text-sm'>
                  <span className='text-red-600 font-medium'>
                    {analyticsData.trends.customerGrowth}%
                  </span>
                  <span className='text-gray-500'> from last month</span>
                </div>
              </div>
            </div>

            <div className='bg-white overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center'>
                      <span className='text-white text-sm font-medium'>📊</span>
                    </div>
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 truncate'>Average Order</dt>
                      <dd className='text-lg font-medium text-gray-900'>
                        £{analyticsData.stats.averageOrder.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className='bg-red-50 px-5 py-3'>
                <div className='text-sm'>
                  <span className='text-red-600 font-medium'>-5%</span>
                  <span className='text-gray-500'> from last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Sales Chart */}
            <div className='bg-white shadow rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Sales Trend</h3>
              <SalesChart />
            </div>

            {/* Orders Chart */}
            <div className='bg-white shadow rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Orders Trend</h3>
              <OrdersChart />
            </div>
          </div>

          {/* Additional Analytics */}
          <div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='bg-white shadow rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Top Products</h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Fire Extinguisher 2kg</span>
                  <span className='text-sm font-medium'>45 units</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Fire Blanket Premium</span>
                  <span className='text-sm font-medium'>32 units</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Smoke Detector</span>
                  <span className='text-sm font-medium'>28 units</span>
                </div>
              </div>
            </div>

            <div className='bg-white shadow rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Customer Segments</h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>New Customers</span>
                  <span className='text-sm font-medium'>65%</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Returning Customers</span>
                  <span className='text-sm font-medium'>35%</span>
                </div>
              </div>
            </div>

            <div className='bg-white shadow rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Revenue by Category</h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Fire Extinguishers</span>
                  <span className='text-sm font-medium'>£12,450</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Fire Blankets</span>
                  <span className='text-sm font-medium'>£8,230</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Safety Equipment</span>
                  <span className='text-sm font-medium'>£5,120</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
