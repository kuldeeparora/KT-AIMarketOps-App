import React, { useState, useEffect } from 'react';
import { apiBaseUrl } from '../config/api';

export default function Plugins() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, inactive, recommended

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

        // Fetch plugins data
        const response = await fetch(`${apiBaseUrl}/plugins?shop=${shop}`);
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

  const getFilteredPlugins = () => {
    if (!data?.plugins) return [];
    
    switch (filter) {
      case 'active':
        return data.plugins.filter(p => p.status === 'active');
      case 'inactive':
        return data.plugins.filter(p => p.status === 'inactive');
      case 'recommended':
        return data.plugins.filter(p => p.recommended);
      default:
        return data.plugins;
    }
  };

  const togglePlugin = async (pluginId, currentStatus) => {
    try {
      const response = await fetch(`${apiBaseUrl}/plugins/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pluginId,
          status: currentStatus === 'active' ? 'inactive' : 'active',
          shop: 'kenttraders.myshopify.com'
        })
      });

      if (response.ok) {
        // Update local state
        setData(prev => ({
          ...prev,
          plugins: prev.plugins.map(p => 
            p.id === pluginId 
              ? { ...p, status: currentStatus === 'active' ? 'inactive' : 'active' }
              : p
          )
        }));
      }
    } catch (err) {
      console.error('Error toggling plugin:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plugins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800">Error loading plugins</h3>
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
            Please authenticate with your Shopify store to access plugins.
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

  const filteredPlugins = getFilteredPlugins();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plugin Management</h1>
        <p className="text-gray-600">Manage and configure your store plugins</p>
      </div>

      {/* Plugin Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Total Plugins</p>
              <p className="text-lg font-bold text-gray-900">{data?.totalPlugins || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 text-xs">Available</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Active Plugins</p>
              <p className="text-lg font-bold text-gray-900">{data?.activePlugins || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">Running</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Recommended</p>
              <p className="text-lg font-bold text-gray-900">{data?.recommendedPlugins || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-purple-600 text-xs font-medium">For your store</span>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Updates Available</p>
              <p className="text-lg font-bold text-gray-900">{data?.updatesAvailable || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-orange-600 text-xs font-medium">Pending</span>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Plugins
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'inactive' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inactive
          </button>
          <button
            onClick={() => setFilter('recommended')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'recommended' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Recommended
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plugins List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Available Plugins</h2>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredPlugins.length} plugins
              </div>
            </div>
            <div className="space-y-4">
              {filteredPlugins.map((plugin, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{plugin.name}</p>
                          {plugin.recommended && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{plugin.description}</p>
                        <p className="text-xs text-gray-500">Version: {plugin.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plugin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plugin.status}
                      </span>
                      <button
                        onClick={() => togglePlugin(plugin.id, plugin.status)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          plugin.status === 'active'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {plugin.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plugin Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">Analytics</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">3</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">Marketing</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">5</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">Inventory</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">2</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">Customer Service</span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">4</span>
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
                Install New Plugin
              </button>
              <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update All Plugins
              </button>
              <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Backup Plugins
              </button>
            </div>
          </div>

          {/* Plugin Updates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Available Updates</h2>
            <div className="space-y-3">
              {data?.updates?.map((update, index) => (
                <div key={index} className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-500">
                  <div className="flex items-start">
                    <div className="bg-yellow-500 rounded-full p-1 mr-2 mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{update.pluginName}</p>
                      <p className="text-xs text-gray-600">v{update.currentVersion} → v{update.newVersion}</p>
                      <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">
                        Update Now →
                      </button>
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
