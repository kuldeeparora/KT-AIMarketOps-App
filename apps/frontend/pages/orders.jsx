import React, { useState, useEffect } from 'react';
import { apiBaseUrl } from '../config/api';

export default function Orders() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Get shop from URL parameters or default to kenttraders
        let shop = 'kenttraders.myshopify.com';
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          shop = urlParams.get('shop') || 'kenttraders.myshopify.com';
        }
        
        // First check authentication status with shop parameter
        const authResponse = await fetch(`${apiBaseUrl}/auth/status?shop=${shop}`);
        const authData = await authResponse.json();
        
        if (!authData.authenticated) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        setIsAuthenticated(true);

        // Fetch orders data
        const response = await fetch(`${apiBaseUrl}/orders?shop=${shop}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800">Error loading orders</h3>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Authentication Required</h2>
          <p className="text-gray-600 text-center mb-6">
            Please authenticate with your Shopify store to access orders.
          </p>
          <button 
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/auth'}
          >
            Connect Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Track and manage your store orders</p>
      </div>

      {/* Order Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Total Orders</p>
              <p className="text-lg font-bold text-gray-900">{data?.totalOrders || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">+8%</span>
                <span className="text-gray-500 text-xs ml-1">from last month</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Pending</p>
              <p className="text-lg font-bold text-gray-900">{data?.pendingOrders || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-600 text-xs font-medium">Needs attention</span>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-2">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Completed</p>
              <p className="text-lg font-bold text-gray-900">{data?.completedOrders || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">Successfully delivered</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Revenue</p>
              <p className="text-lg font-bold text-gray-900">£{data?.totalRevenue || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">+12%</span>
                <span className="text-gray-500 text-xs ml-1">from last month</span>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {data?.recentOrders?.length || 0} orders
              </div>
            </div>
            <div className="space-y-3">
              {data?.recentOrders?.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-gray-900">#{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">£{order.total}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Processing</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">{data?.processingOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shipped</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">{data?.shippedOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Delivered</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">{data?.deliveredOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cancelled</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">{data?.cancelledOrders || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Order
              </button>
              <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Export Orders
              </button>
              <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bulk Update
              </button>
            </div>
          </div>

          {/* Order Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Alerts</h2>
            <div className="space-y-3">
              {data?.orderAlerts?.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-500' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 