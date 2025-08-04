import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function Plugins() {
  const [loading, setLoading] = useState(true);
  const [pluginsData, setPluginsData] = useState({
    totalPlugins: 0,
    activePlugins: 0,
    updatesAvailable: 0,
    plugins: []
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPluginsData({
        totalPlugins: 12,
        activePlugins: 8,
        updatesAvailable: 3,
        plugins: [
          {
            id: 1,
            name: 'SEO Optimizer',
            description: 'Automatically optimize your content for search engines',
            version: '2.1.0',
            status: 'active',
            rating: 4.8,
            downloads: 1247,
            lastUpdated: '2024-01-15',
            category: 'SEO'
          },
          {
            id: 2,
            name: 'Inventory Manager',
            description: 'Real-time inventory tracking and alerts',
            version: '1.5.2',
            status: 'active',
            rating: 4.6,
            downloads: 892,
            lastUpdated: '2024-01-10',
            category: 'Inventory'
          },
          {
            id: 3,
            name: 'Customer Portal',
            description: 'Enhanced customer experience and support',
            version: '3.0.1',
            status: 'inactive',
            rating: 4.9,
            downloads: 567,
            lastUpdated: '2024-01-08',
            category: 'Customer'
          },
          {
            id: 4,
            name: 'Analytics Dashboard',
            description: 'Advanced analytics and reporting tools',
            version: '2.3.0',
            status: 'active',
            rating: 4.7,
            downloads: 1023,
            lastUpdated: '2024-01-12',
            category: 'Analytics'
          },
          {
            id: 5,
            name: 'AI Copilot',
            description: 'AI-powered business intelligence and automation',
            version: '1.0.0',
            status: 'active',
            rating: 4.9,
            downloads: 2341,
            lastUpdated: '2024-01-14',
            category: 'AI'
          },
          {
            id: 6,
            name: 'Financial Manager',
            description: 'Complete financial management and reporting',
            version: '2.0.1',
            status: 'active',
            rating: 4.5,
            downloads: 756,
            lastUpdated: '2024-01-11',
            category: 'Finance'
          }
        ]
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const overviewCards = [
    {
      title: 'Total Plugins',
      value: pluginsData.totalPlugins,
      icon: '🧩',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Plugins',
      value: pluginsData.activePlugins,
      icon: '✅',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Updates Available',
      value: pluginsData.updatesAvailable,
      icon: '🔄',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading plugins,...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Plugins - Kent Traders Admin Dashboard</title>
        <meta name='description' content='Plugin management system' />
      </Head>

      <Layout>
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm: px-6 lg:px-8'>
            <div className='flex justify-between items-center py-6'>
              <div className='flex items-center'>
                <h1 className='text-2xl font-bold text-gray-900'>Plugin Management</h1>
              </div>
              <div className='flex items-center space-x-4'>
                <button className='btn-primary'>Install New Plugin</button>
                <button className='btn-secondary'>Check Updates</button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='max-w-7xl mx-auto px-4 sm: px-6 lg:px-8 py-8'>
          {/* Overview Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            {overviewCards.map(card => (
              <div key={card.title} className={`${card.bgColor} rounded-lg p-6`}>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <span className='text-2xl'>{card.icon}</span>
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-500'>{card.title}</p>
                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Plugins Grid */}
          <div className='bg-white rounded-lg shadow'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Installed Plugins ({pluginsData.plugins.length})
              </h2>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {pluginsData.plugins.map(plugin => (
                  <div
                    key={plugin.id}
                    className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900'>{plugin.name}</h3>
                        <p className='text-sm text-gray-600'>{plugin.description}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          plugin.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {plugin.status}
                      </span>
                    </div>

                    <div className='space-y-2 mb-4'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <span className='font-medium'>Version: </span>
                        <span className='ml-2'>{plugin.version}</span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600'>
                        <span className='font-medium'>Category: </span>
                        <span className='ml-2'>{plugin.category}</span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600'>
                        <span className='font-medium'>Rating: </span>
                        <span className='ml-2'>⭐ {plugin.rating}</span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600'>
                        <span className='font-medium'>Downloads: </span>
                        <span className='ml-2'>{plugin.downloads.toLocaleString()}</span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600'>
                        <span className='font-medium'>Updated: </span>
                        <span className='ml-2'>{plugin.lastUpdated}</span>
                      </div>
                    </div>

                    <div className='flex space-x-2'>
                      <button
                        className={`text-sm font-medium px-3 py-1 rounded ${
                          plugin.status === 'active'
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-green-600 hover: text-green-800'
                        }`}
                      >
                        {plugin.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className='text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 rounded'>
                        Settings
                      </button>
                      <button className='text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-1 rounded'>
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plugin Categories */}
          <div className='mt-8 bg-white rounded-lg shadow'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h2 className='text-lg font-semibold text-gray-900'>Plugin Categories</h2>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center p-4 border border-gray-200 rounded-lg'>
                  <div className='text-2xl mb-2'>🔍</div>
                  <h3 className='font-semibold text-gray-900'>SEO</h3>
                  <p className='text-sm text-gray-600'>1 plugin</p>
                </div>
                <div className='text-center p-4 border border-gray-200 rounded-lg'>
                  <div className='text-2xl mb-2'>📦</div>
                  <h3 className='font-semibold text-gray-900'>Inventory</h3>
                  <p className='text-sm text-gray-600'>1 plugin</p>
                </div>
                <div className='text-center p-4 border border-gray-200 rounded-lg'>
                  <div className='text-2xl mb-2'>👥</div>
                  <h3 className='font-semibold text-gray-900'>Customer</h3>
                  <p className='text-sm text-gray-600'>1 plugin</p>
                </div>
                <div className='text-center p-4 border border-gray-200 rounded-lg'>
                  <div className='text-2xl mb-2'>📊</div>
                  <h3 className='font-semibold text-gray-900'>Analytics</h3>
                  <p className='text-sm text-gray-600'>1 plugin</p>
                </div>
                <div className='text-center p-4 border border-gray-200 rounded-lg'>
                  <div className='text-2xl mb-2'>🤖</div>
                  <h3 className='font-semibold text-gray-900'>AI</h3>
                  <p className='text-sm text-gray-600'>1 plugin</p>
                </div>
                <div className='text-center p-4 border border-gray-200 rounded-lg'>
                  <div className='text-2xl mb-2'>💰</div>
                  <h3 className='font-semibold text-gray-900'>Finance</h3>
                  <p className='text-sm text-gray-600'>1 plugin</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
