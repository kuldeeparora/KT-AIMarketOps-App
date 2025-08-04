import React from 'react';
import useAmazonInventory from '../../hooks/useAmazonInventory';

export default function AmazonInventoryTable() {
  const { inventory, loading, error } = useAmazonInventory();

  if (loading) return <div>Loading Amazon inventory...</div>;
  if (error) return <div className='text-red-600'>Error: {error}</div>;
  if (!inventory.length) return <div>No Amazon inventory found.</div>;

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border border-slate-200 rounded-lg'>
        <thead>
          <tr className='bg-slate-100'>
            <th className='px-4 py-2 text-left'>SKU</th>
            <th className='px-4 py-2 text-left'>ASIN</th>
            <th className='px-4 py-2 text-left'>Quantity</th>
            <th className='px-4 py-2 text-left'>BSR</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.sku} className='border-t'>
              <td className='px-4 py-2'>{item.sku}</td>
              <td className='px-4 py-2'>{item.asin}</td>
              <td className='px-4 py-2'>{item.quantity}</td>
              <td className='px-4 py-2'>{item.bsr || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
