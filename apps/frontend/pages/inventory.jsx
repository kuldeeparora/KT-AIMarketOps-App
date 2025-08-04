import { useState, useEffect } from 'react';

export default function Inventory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [sellerDynamicsStatus, setSellerDynamicsStatus] = useState(null);

  useEffect(() => {
    fetchData();
    testSellerDynamicsConnection();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/analytics/inventory');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function testSellerDynamicsConnection() {
    try {
      const response = await fetch('http://localhost:5001/api/analytics/inventory/test');
      const result = await response.json();
      setSellerDynamicsStatus(result);
    } catch (error) {
      console.error('Error testing SellerDynamics connection:', error);
      setSellerDynamicsStatus({
        success: false,
        message: 'Connection test failed',
        error: error.message
      });
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncStatus(null);
      
      const response = await fetch('http://localhost:5001/api/analytics/inventory/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: 'test-shop.myshopify.com',
          inventory: data?.products || []
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSyncStatus({
          type: 'success',
          message: 'Inventory synced successfully with SellerDynamics',
          details: `Uploaded ${result.result?.uploadedCount || 0} products`
        });
        // Refresh data after sync
        await fetchData();
      } else {
        setSyncStatus({
          type: 'error',
          message: 'Sync failed',
          details: result.error || 'Unknown error occurred'
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus({
        type: 'error',
        message: 'Sync failed',
        details: error.message
      });
    } finally {
      setSyncing(false);
    }
  };

  const getFilteredProducts = () => {
    if (!data?.products) return [];
    
    switch (filter) {
      case 'low-stock':
        return data.products.filter(p => p.quantity <= 10 && p.quantity > 0);
      case 'out-of-stock':
        return data.products.filter(p => p.quantity === 0);
      case 'overstocked':
        return data.products.filter(p => p.quantity > (p.maxStock || 100) * 0.9);
      default:
        return data.products;
    }
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Monitor and manage your inventory levels with real-time SellerDynamics integration</p>
        </div>

        {/* SellerDynamics Status */}
        {sellerDynamicsStatus && (
          <div className={`mb-6 p-4 rounded-lg border ${
            sellerDynamicsStatus.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">SellerDynamics Integration Status</h3>
                <p className="text-sm mt-1">{sellerDynamicsStatus.message}</p>
                {sellerDynamicsStatus.error && (
                  <p className="text-xs mt-1 opacity-75">{sellerDynamicsStatus.error}</p>
                )}
              </div>
              <button
                onClick={testSellerDynamicsConnection}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Test Connection
              </button>
            </div>
          </div>
        )}

        {/* Data Source Indicator */}
        {data && (
          <div className={`mb-6 p-4 rounded-lg border ${
            data.source === 'sellerdynamics' 
              ? 'bg-blue-50 border-blue-200 text-blue-800' 
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {data.source === 'sellerdynamics' ? '✅ Real SellerDynamics Data' : '⚠️ Mock Data (Demo Mode)'}
                </h3>
                <p className="text-sm mt-1">
                  {data.source === 'sellerdynamics' 
                    ? 'Connected to SellerDynamics API - showing real inventory data'
                    : data.message || 'Using simulated data for demonstration purposes'
                  }
                </p>
                {data.lastUpdated && (
                  <p className="text-xs mt-1 opacity-75">
                    Last updated: {new Date(data.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                data.source === 'sellerdynamics' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {data.source === 'sellerdynamics' ? 'LIVE' : 'DEMO'}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">Total Products</p>
                <p className="text-lg font-bold text-gray-900">{data?.totalProducts || '0'}</p>
                <div className="flex items-center mt-1">
                  <span className="text-blue-600 text-xs font-medium">Active</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-0.5">
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">Low Stock</p>
                <p className="text-lg font-bold text-gray-900">{data?.lowStockCount || '0'}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-600 text-xs font-medium">Needs attention</span>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-0.5">
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">Out of Stock</p>
                <p className="text-lg font-bold text-gray-900">{data?.outOfStockCount || '0'}</p>
                <div className="flex items-center mt-1">
                  <span className="text-red-600 text-xs font-medium">Critical</span>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-0.5">
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">Total Value</p>
                <p className="text-lg font-bold text-gray-900">£{data?.totalValue || '0'}</p>
                <div className="flex items-center mt-1">
                  <span className="text-green-600 text-xs font-medium">Inventory value</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-0.5">
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
              All Products
            </button>
            <button
              onClick={() => setFilter('low-stock')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'low-stock' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilter('out-of-stock')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'out-of-stock' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Out of Stock
            </button>
            <button
              onClick={() => setFilter('overstocked')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'overstocked' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overstocked
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Inventory Items</h2>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredProducts.length} items
                </div>
              </div>
              <div className="space-y-3">
                {filteredProducts.map((product, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                          <p className="text-xs text-gray-500">Supplier: {product.supplier}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">£{product.price}</p>
                        <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.quantity === 0 ? 'bg-red-100 text-red-800' :
                          product.quantity <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          product.quantity > product.maxStock * 0.9 ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.quantity === 0 ? 'Out of Stock' :
                           product.quantity <= 10 ? 'Low Stock' :
                           product.quantity > product.maxStock * 0.9 ? 'Overstocked' : 'In Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">AI Insights</h2>
              <div className="space-y-4">
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

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Add Product
                </button>
                <button 
                  className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  {syncing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Syncing...
                    </>
                  ) : (
                    <>
                      Sync with SellerDynamics
                    </>
                  )}
                </button>
                
                {syncStatus && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${
                    syncStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                    syncStatus.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                    'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="font-medium">{syncStatus.message}</div>
                    {syncStatus.details && (
                      <div className="text-xs mt-1 opacity-75">{syncStatus.details}</div>
                    )}
                  </div>
                )}
                <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                  Export Report
                </button>
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Alerts</h2>
              <div className="space-y-3">
                {data?.alerts?.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                    alert.severity === 'high' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
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
    </div>
  );
}
