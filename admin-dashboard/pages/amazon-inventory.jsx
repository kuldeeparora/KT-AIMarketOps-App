import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

// Dynamically import the component to prevent SSR issues
const AmazonInventoryTable = dynamic(() => import('../components/amazon/AmazonInventoryTable'), {
  ssr: false,
  loading: () => <div>Loading Amazon inventory...</div>
});

export default function AmazonInventory() {
  return (
    <>
      <Head>
        <title>Amazon Inventory - Kent Traders Admin</title>
        <meta name="description" content="Amazon inventory management and tracking" />
      </Head>

      <Layout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Amazon Inventory Management</h1>
            <p className="text-gray-600">
              Track and manage your Amazon inventory with real-time data
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">£45,678</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg BSR</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Amazon Inventory</h2>
            </div>
            <div className="p-6">
              <AmazonInventoryTable />
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📤</span>
                    <div>
                      <p className="font-medium text-gray-900">Export Inventory</p>
                      <p className="text-sm text-gray-500">Download current inventory as CSV</p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🔄</span>
                    <div>
                      <p className="font-medium text-gray-900">Sync with Amazon</p>
                      <p className="text-sm text-gray-500">Update inventory from Amazon API</p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📊</span>
                    <div>
                      <p className="font-medium text-gray-900">Generate Report</p>
                      <p className="text-sm text-gray-500">Create inventory performance report</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">📦</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Product "Echo Dot" stock updated to 45 units
                    </p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Low stock alert for "Fire TV Stick" (5 units remaining)
                    </p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">📈</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      BSR updated for "Kindle Paperwhite" (rank: 1,234)
                    </p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
