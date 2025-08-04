import React, { useState, useEffect } from 'react';
import { apiBaseUrl } from '../config/api';

export default function Dashboard() {
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

        // Fetch dashboard data
        const response = await fetch(`${apiBaseUrl}/dashboard?shop=${shop}`);
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
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800">Error loading dashboard</h3>
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
            Please authenticate with your Shopify store to access the dashboard.
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-gray-600 text-sm">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Total Sales</p>
              <p className="text-lg font-bold text-gray-900">£{data?.totalSales || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">+12%</span>
                <span className="text-gray-500 text-xs ml-1">vs last month</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Orders</p>
              <p className="text-lg font-bold text-gray-900">{data?.totalOrders || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-blue-600 text-xs font-medium">+8%</span>
                <span className="text-gray-500 text-xs ml-1">vs last month</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Customers</p>
              <p className="text-lg font-bold text-gray-900">{data?.totalCustomers || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-purple-600 text-xs font-medium">+15%</span>
                <span className="text-gray-500 text-xs ml-1">vs last month</span>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Products</p>
              <p className="text-lg font-bold text-gray-900">{data?.totalProducts || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-orange-600 text-xs font-medium">+5%</span>
                <span className="text-gray-500 text-xs ml-1">vs last month</span>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">AI Insights</h2>
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                Live
              </div>
            </div>
            <div className="space-y-3">
              {data?.aiInsights?.map((insight, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <div>
                      <p className="text-gray-900 font-medium">{insight.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {data?.recentActivity?.length || 0} items
              </div>
            </div>
            <div className="space-y-2">
              {data?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.type === 'order' ? 'bg-green-100 text-green-800' :
                    activity.type === 'customer' ? 'bg-blue-100 text-blue-800' :
                    activity.type === 'product' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
              <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Generate Report
              </button>
              <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Analytics
              </button>
            </div>
          </div>

          {/* Store Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Store Health</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Performance</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">Excellent</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Security</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">Secure</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Backup</span>
                <span className="text-gray-900 font-medium">2 hours ago</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-3">
              {data?.notifications?.map((notification, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  notification.type === 'success' ? 'bg-green-50 border-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  notification.type === 'error' ? 'bg-red-50 border-red-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
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