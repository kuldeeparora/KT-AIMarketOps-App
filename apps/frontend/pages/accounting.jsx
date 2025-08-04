import React, { useState, useEffect } from 'react';
import { apiBaseUrl } from '../config/api';

export default function Accounting() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [period, setPeriod] = useState('month'); // month, quarter, year

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

        // Fetch accounting data
        const response = await fetch(`${apiBaseUrl}/accounting?shop=${shop}&period=${period}`);
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
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accounting data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800">Error loading accounting data</h3>
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
            Please authenticate with your Shopify store to access accounting data.
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounting & Finance</h1>
        <p className="text-gray-600">Comprehensive financial reporting and analysis</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('quarter')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'quarter' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Quarter
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Revenue</p>
              <p className="text-lg font-bold text-gray-900">£{data?.revenue || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">+15%</span>
                <span className="text-gray-500 text-xs ml-1">vs last period</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Expenses</p>
              <p className="text-lg font-bold text-gray-900">£{data?.expenses || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-red-600 text-xs font-medium">+8%</span>
                <span className="text-gray-500 text-xs ml-1">vs last period</span>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Profit</p>
              <p className="text-lg font-bold text-gray-900">£{data?.profit || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">+22%</span>
                <span className="text-gray-500 text-xs ml-1">vs last period</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Tax Liability</p>
              <p className="text-lg font-bold text-gray-900">£{data?.taxLiability || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-orange-600 text-xs font-medium">Due soon</span>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Reports */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profit & Loss Statement</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">Gross Revenue</span>
                <span className="text-gray-900 font-bold">£{data?.grossRevenue || '0'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">Cost of Goods Sold</span>
                <span className="text-gray-900 font-bold">-£{data?.costOfGoods || '0'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <span className="text-gray-900 font-medium">Gross Profit</span>
                <span className="text-blue-900 font-bold">£{data?.grossProfit || '0'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">Operating Expenses</span>
                <span className="text-gray-900 font-bold">-£{data?.operatingExpenses || '0'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <span className="text-gray-900 font-medium">Net Profit</span>
                <span className="text-green-900 font-bold">£{data?.netProfit || '0'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
            <div className="space-y-3">
              {data?.recentTransactions?.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.category}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}£{transaction.amount}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cash Flow */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Cash Flow</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cash In</span>
                <span className="text-green-600 font-bold">+£{data?.cashIn || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cash Out</span>
                <span className="text-red-600 font-bold">-£{data?.cashOut || '0'}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">Net Cash Flow</span>
                  <span className={`font-bold ${
                    (data?.cashIn || 0) - (data?.cashOut || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    £{((data?.cashIn || 0) - (data?.cashOut || 0)).toFixed(2)}
                  </span>
                </div>
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
                Add Transaction
              </button>
              <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Export Data
              </button>
            </div>
          </div>

          {/* Tax Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tax Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">VAT Collected</span>
                <span className="text-gray-900 font-medium">£{data?.vatCollected || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">VAT Paid</span>
                <span className="text-gray-900 font-medium">£{data?.vatPaid || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">VAT Due</span>
                <span className="text-orange-600 font-medium">£{data?.vatDue || '0'}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">Next Filing</span>
                  <span className="text-gray-900 font-medium">{data?.nextFilingDate || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
