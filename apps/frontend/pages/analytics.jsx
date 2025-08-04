import React, { useState, useEffect } from 'react';
import { apiBaseUrl } from '../config/api';

export default function Analytics() {
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

        // Fetch analytics data
        const response = await fetch(`${apiBaseUrl}/analytics?shop=${shop}`);
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
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800">Error loading analytics</h3>
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
            Please authenticate with your Shopify store to access analytics.
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Comprehensive performance metrics and data analysis</p>
      </div>

      {/* Analytics Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Conversion Rate</p>
              <p className="text-lg font-bold text-gray-900">{data?.conversionRate || '0'}%</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">+2.5%</span>
                <span className="text-gray-500 text-xs ml-1">from last month</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Average Order Value</p>
              <p className="text-lg font-bold text-gray-900">£{data?.averageOrderValue || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">+8%</span>
                <span className="text-gray-500 text-xs ml-1">from last month</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Customer Lifetime Value</p>
              <p className="text-lg font-bold text-gray-900">£{data?.customerLifetimeValue || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">+15%</span>
                <span className="text-gray-500 text-xs ml-1">from last month</span>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Return Rate</p>
              <p className="text-lg font-bold text-gray-900">{data?.returnRate || '0'}%</p>
              <div className="flex items-center mt-1">
                <span className="text-red-600 text-xs font-medium">+1.2%</span>
                <span className="text-gray-500 text-xs ml-1">from last month</span>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Charts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Sales Performance</h2>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Trending Up
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Performing Products</h2>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {data?.topProducts?.length || 0} products
              </div>
            </div>
            <div className="space-y-3">
              {data?.topProducts?.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">£{product.revenue}</p>
                    <p className="text-sm text-gray-600">{product.sales} units sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Key Metrics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Page Views</span>
                <span className="text-gray-900 font-medium">{data?.pageViews || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Unique Visitors</span>
                <span className="text-gray-900 font-medium">{data?.uniqueVisitors || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bounce Rate</span>
                <span className="text-gray-900 font-medium">{data?.bounceRate || '0'}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Session Duration</span>
                <span className="text-gray-900 font-medium">{data?.sessionDuration || '0'} min</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Generate Report
              </button>
              <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Export Data
              </button>
              <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Set Alerts
              </button>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">AI Insights</h2>
            <div className="space-y-3">
              {data?.insights?.map((insight, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
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