import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function EnhancedCartSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [cartAnalytics, setCartAnalytics] = useState({});
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [_showModal, _setShowModal] = useState(false);
  const [_editingCart, _setEditingCart] = useState(null);
  const [cartSettings, setCartSettings] = useState({
    autoSave: true,
    abandonedCartRecovery: true,
    aiRecommendations: true,
    dynamicPricing: true,
    crossSelling: true,
    upSelling: true,
    cartExpiry: 24,
    emailReminders: true,
    smsReminders: false,
    pushNotifications: true
  });

  const cartFeatures = [
    {
      id: 'ai-recommendations',
      name: 'AI Recommendations',
      description: 'Smart product suggestions',
      icon: '🧠',
      status: 'active'
    },
    {
      id: 'dynamic-pricing',
      name: 'Dynamic Pricing',
      description: 'Real-time price optimization',
      icon: '💰',
      status: 'active'
    },
    {
      id: 'abandoned-recovery',
      name: 'Abandoned Cart Recovery',
      description: 'Recover lost sales',
      icon: '🔄',
      status: 'active'
    },
    {
      id: 'cross-selling',
      name: 'Cross-selling',
      description: 'Related product suggestions',
      icon: '📦',
      status: 'active'
    },
    {
      id: 'up-selling',
      name: 'Up-selling',
      description: 'Premium product recommendations',
      icon: '📈',
      status: 'active'
    },
    {
      id: 'cart-analytics',
      name: 'Cart Analytics',
      description: 'Detailed cart insights',
      icon: '📊',
      status: 'active'
    }
  ];

  const _cartStatuses = [
    { id: 'active', name: 'Active', color: 'green', icon: '✅' },
    { id: 'abandoned', name: 'Abandoned', color: 'red', icon: '❌' },
    { id: 'recovered', name: 'Recovered', color: 'blue', icon: '🔄' },
    { id: 'converted', name: 'Converted', color: 'purple', icon: '📈' },
    { id: 'expired', name: 'Expired', color: 'gray', icon: '⏰' }
  ];

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCartItems([
        {
          id: 1,
          customer: 'john.doe@example.com',
          items: [
            { id: 1, name: 'Premium Wireless Headphones', price: 159.99, quantity: 1 },
            { id: 2, name: 'Bluetooth Speaker Pro', price: 89.99, quantity: 2 }
          ],
          total: 339.97,
          status: 'active',
          lastActivity: '2024-01-15T10:30:00Z',
          abandonedAt: null
        },
        {
          id: 2,
          customer: 'jane.smith@example.com',
          items: [{ id: 3, name: 'USB-C Cable 6ft', price: 12.99, quantity: 3 }],
          total: 38.97,
          status: 'abandoned',
          lastActivity: '2024-01-15T09:15:00Z',
          abandonedAt: '2024-01-15T09:20:00Z'
        }
      ]);

      setAbandonedCarts([
        {
          id: 1,
          customer: 'jane.smith@example.com',
          total: 38.97,
          abandonedAt: '2024-01-15T09:20:00Z',
          recoveryAttempts: 1,
          lastEmailSent: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          customer: 'bob.johnson@example.com',
          total: 245.0,
          abandonedAt: '2024-01-15T08:45:00Z',
          recoveryAttempts: 2,
          lastEmailSent: '2024-01-15T09:30:00Z'
        }
      ]);

      setCartAnalytics({
        totalCarts: 156,
        activeCarts: 23,
        abandonedCarts: 45,
        recoveredCarts: 12,
        conversionRate: 67.3,
        averageCartValue: 89.45,
        recoveryRate: 26.7
      });

      setAiRecommendations([
        {
          id: 1,
          type: 'cross-sell',
          product: 'Premium Wireless Headphones',
          recommended: 'Bluetooth Speaker Pro',
          confidence: 0.89,
          reason: 'Frequently bought together'
        },
        {
          id: 2,
          type: 'up-sell',
          product: 'USB-C Cable 6ft',
          recommended: 'Premium USB-C Cable Bundle',
          confidence: 0.76,
          reason: 'Higher value alternative'
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'active-carts', name: 'Active Carts', icon: '🛒' },
    { id: 'abandoned-carts', name: 'Abandoned Carts', icon: '❌' },
    { id: 'ai-recommendations', name: 'AI Recommendations', icon: '🧠' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading cart data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Enhanced Cart System - Kent Traders Admin Dashboard</title>
        <meta name='description' content='Advanced cart management and recovery system' />
      </Head>

      <Layout>
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm: px-6 lg:px-8'>
            <div className='flex justify-between items-center py-6'>
              <div className='flex items-center'>
                <h1 className='text-2xl font-bold text-gray-900'>Enhanced Cart System</h1>
              </div>
              <div className='flex items-center space-x-4'>
                <button className='btn-primary'>Send Recovery Emails</button>
                <button className='btn-secondary'>Export Data</button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='max-w-7xl mx-auto px-4 sm: px-6 lg:px-8 py-8'>
          {/* Tab Navigation */}
          <div className='border-b border-gray-200 mb-8'>
            <nav className='-mb-px flex space-x-8'>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover: text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className='mr-2'>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className='space-y-6'>
              {/* Analytics Cards */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-sm font-medium text-gray-500'>Total Carts</h3>
                  <p className='text-2xl font-bold text-blue-600'>{cartAnalytics.totalCarts}</p>
                </div>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-sm font-medium text-gray-500'>Active Carts</h3>
                  <p className='text-2xl font-bold text-green-600'>{cartAnalytics.activeCarts}</p>
                </div>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-sm font-medium text-gray-500'>Abandoned Carts</h3>
                  <p className='text-2xl font-bold text-red-600'>{cartAnalytics.abandonedCarts}</p>
                </div>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-sm font-medium text-gray-500'>Recovery Rate</h3>
                  <p className='text-2xl font-bold text-purple-600'>
                    {cartAnalytics.recoveryRate}%
                  </p>
                </div>
              </div>

              {/* Cart Features */}
              <div className='bg-white rounded-lg shadow'>
                <div className='px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-semibold text-gray-900'>Cart Features</h2>
                </div>
                <div className='p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {cartFeatures.map(feature => (
                      <div key={feature.id} className='border border-gray-200 rounded-lg p-4'>
                        <div className='flex items-center mb-3'>
                          <span className='text-2xl mr-3'>{feature.icon}</span>
                          <div>
                            <h3 className='font-semibold text-gray-900'>{feature.name}</h3>
                            <p className='text-sm text-gray-500'>{feature.description}</p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            feature.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {feature.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Active Carts */}
          {activeTab === 'active-carts' && (
            <div className='bg-white rounded-lg shadow'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-900'>Active Shopping Carts</h2>
              </div>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Customer
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Items
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Total
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Last Activity
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {cartItems
                      .filter(cart => cart.status === 'active')
                      .map(cart => (
                        <tr key={cart.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                            {cart.customer}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                            {cart.items.length} items
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                            £{cart.total}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                              Active
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                            {new Date(cart.lastActivity).toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                            <button className='text-blue-600 hover:text-blue-800 mr-3'>View</button>
                            <button className='text-green-600 hover:text-green-800'>Recover</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Abandoned Carts */}
          {activeTab === 'abandoned-carts' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-lg shadow'>
                <div className='px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-semibold text-gray-900'>Abandoned Carts</h2>
                </div>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Customer
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Total
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Abandoned
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Recovery Attempts
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Last Email
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {abandonedCarts.map(cart => (
                        <tr key={cart.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                            {cart.customer}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                            £{cart.total}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                            {new Date(cart.abandonedAt).toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                            {cart.recoveryAttempts}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                            {new Date(cart.lastEmailSent).toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                            <button className='text-blue-600 hover:text-blue-800 mr-3'>
                              Send Email
                            </button>
                            <button className='text-green-600 hover:text-green-800'>Recover</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* AI Recommendations */}
          {activeTab === 'ai-recommendations' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-lg shadow'>
                <div className='px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-semibold text-gray-900'>
                    AI Product Recommendations
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='space-y-4'>
                    {aiRecommendations.map(recommendation => (
                      <div
                        key={recommendation.id}
                        className='border border-gray-200 rounded-lg p-4'
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <h3 className='font-semibold text-gray-900'>{recommendation.type}</h3>
                            <p className='text-sm text-gray-600'>
                              {recommendation.product} → {recommendation.recommended}
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>{recommendation.reason}</p>
                          </div>
                          <div className='text-right'>
                            <p className='text-sm font-medium text-gray-900'>
                              {Math.round(recommendation.confidence * 100)}% confidence
                            </p>
                            <button className='text-blue-600 hover:text-blue-800 text-sm mt-2'>
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Conversion Rate</h3>
                  <p className='text-3xl font-bold text-green-600'>
                    {cartAnalytics.conversionRate}%
                  </p>
                  <p className='text-sm text-gray-500'>+2.1% from last month</p>
                </div>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Average Cart Value</h3>
                  <p className='text-3xl font-bold text-blue-600'>
                    £{cartAnalytics.averageCartValue}
                  </p>
                  <p className='text-sm text-gray-500'>+5.3% from last month</p>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Cart Recovery Performance
                </h3>
                <div className='h-64 bg-gray-50 rounded flex items-center justify-center'>
                  <p className='text-gray-500'>
                    Chart placeholder - Recovery performance over time
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Settings */}
          {activeTab === 'settings' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-lg shadow p-6'>
                <h2 className='text-lg font-semibold text-gray-900 mb-4'>Cart Recovery Settings</h2>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-900'>Auto Save Carts</h3>
                      <p className='text-sm text-gray-500'>Automatically save cart progress</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={cartSettings.autoSave}
                      onChange={e =>
                        setCartSettings(prev => ({ ...prev, autoSave: e.target.checked }))
                      }
                      className='rounded'
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-900'>Abandoned Cart Recovery</h3>
                      <p className='text-sm text-gray-500'>
                        Send recovery emails for abandoned carts
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      checked={cartSettings.abandonedCartRecovery}
                      onChange={e =>
                        setCartSettings(prev => ({
                          ...prev,
                          abandonedCartRecovery: e.target.checked
                        }))
                      }
                      className='rounded'
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-900'>AI Recommendations</h3>
                      <p className='text-sm text-gray-500'>Show AI-powered product suggestions</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={cartSettings.aiRecommendations}
                      onChange={e =>
                        setCartSettings(prev => ({ ...prev, aiRecommendations: e.target.checked }))
                      }
                      className='rounded'
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-900'>Email Reminders</h3>
                      <p className='text-sm text-gray-500'>
                        Send email reminders for abandoned carts
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      checked={cartSettings.emailReminders}
                      onChange={e =>
                        setCartSettings(prev => ({ ...prev, emailReminders: e.target.checked }))
                      }
                      className='rounded'
                    />
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
