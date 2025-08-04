import React from 'react';

export default function InventoryHealthDashboard({ metrics, onClose }) {
  return (
    <div className='mb-6 bg-white rounded-lg shadow p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-gray-900'>Inventory Health Dashboard</h2>
        <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
          ✕
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <div className='bg-blue-50 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-blue-600'>{metrics.totalItems}</div>
          <div className='text-sm text-blue-600'>Total Products</div>
        </div>
        <div className='bg-green-50 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-green-600'>£{metrics.totalValue.toFixed(2)}</div>
          <div className='text-sm text-green-600'>Total Value</div>
        </div>
        <div className='bg-yellow-50 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-yellow-600'>{metrics.lowStock}</div>
          <div className='text-sm text-yellow-600'>Low Stock Items</div>
        </div>
        <div className='bg-red-50 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-red-600'>{metrics.outOfStock}</div>
          <div className='text-sm text-red-600'>Out of Stock</div>
        </div>
        <div className='bg-purple-50 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-purple-600'>{metrics.healthScore}%</div>
          <div className='text-sm text-purple-600'>Health Score</div>
        </div>
      </div>
      {metrics.criticalItems.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-sm font-medium text-gray-900 mb-2'>
            Critical Items Requiring Attention:{' '}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {metrics.criticalItems.map(item => (
              <span
                key={item.id}
                className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'
              >
                {item.name} ({item.stock})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
