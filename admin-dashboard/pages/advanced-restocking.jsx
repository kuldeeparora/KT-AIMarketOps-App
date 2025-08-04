import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function AdvancedRestocking() {
  const [restockingData, setRestockingData] = useState({
    alerts: [
      {
        id: 1,
        product: 'Premium Wireless Headphones',
        sku: 'SD-001',
        currentStock: 5,
        threshold: 10,
        reorderPoint: 15,
        supplier: 'Tech Supplies Ltd',
        leadTime: 7,
        lastOrder: '2024-01-10',
        status: 'critical',
        suggestedOrder: 25},
      {
        id: 2,
        product: 'Bluetooth Speaker Pro',
        sku: 'SD-002',
        currentStock: 8,
        threshold: 15,
        reorderPoint: 20,
        supplier: 'Home Goods Co',
        leadTime: 5,
        lastOrder: '2024-01-12',
        status: 'warning',
        suggestedOrder: 20},
      {
        id: 3,
        product: 'USB-C Cable 6ft',
        sku: 'SD-003',
        currentStock: 2,
        threshold: 25,
        reorderPoint: 30,
        supplier: 'Electronics Plus',
        leadTime: 3,
        lastOrder: '2024-01-08',
        status: 'critical',
        suggestedOrder: 50}],
    orders: [
      {
        id: 'RO-001',
        product: 'Premium Wireless Headphones',
        quantity: 25,
        supplier: 'Tech Supplies Ltd',
        orderDate: '2024-01-15',
        expectedDelivery: '2024-01-22',
        status: 'pending',
        totalCost: 1250.0},
      {
        id: 'RO-002',
        product: 'USB-C Cable 6ft',
        quantity: 50,
        supplier: 'Electronics Plus',
        orderDate: '2024-01-14',
        expectedDelivery: '2024-01-17',
        status: 'confirmed',
        totalCost: 750.0}],
    suppliers: [
      {
        id: 1,
        name: 'Tech Supplies Ltd',
        contact: 'John Smith',
        email: 'john@techsupplies.com',
        phone: '+44 20 7946 0958',
        rating: 4.5,
        avgLeadTime: 7,
        reliability: 95},
      {
        id: 2,
        name: 'Home Goods Co',
        contact: 'Sarah Johnson',
        email: 'sarah@homegoods.co.uk',
        phone: '+44 20 7946 0959',
        rating: 4.2,
        avgLeadTime: 5,
        reliability: 92},
      {
        id: 3,
        name: 'Electronics Plus',
        contact: 'Mike Wilson',
        email: 'mike@electronicsplus.com',
        phone: '+44 20 7946 0960',
        rating: 4.8,
        avgLeadTime: 3,
        reliability: 98}]});

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    quantity: '',
    supplier: '',
    expectedDelivery: ''});

  const getStatusColor = status => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
  };

  const getStockColor = (current, threshold) => {
    if (current <= threshold * 0.5) return 'text-red-600';
    if (current <= threshold) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleCreateOrder = alert => {
    setSelectedAlert(alert);
    setNewOrder({
      quantity: alert.suggestedOrder.toString(),
      supplier: alert.supplier,
      expectedDelivery: new Date(Date.now() + alert.leadTime * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]});
    setShowOrderModal(true);
  };

  const submitOrder = () => {
    if (selectedAlert && newOrder.quantity && newOrder.supplier) {
      const order = {
        id: `RO-${String(restockingData.orders.length + 1).padStart(3, '0')}`,
        product: selectedAlert.product,
        quantity: parseInt(newOrder.quantity),
        supplier: newOrder.supplier,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDelivery: newOrder.expectedDelivery,
        status: 'pending',
        totalCost: parseInt(newOrder.quantity) * 50, // Mock cost calculation
      };

      setRestockingData(prev => ({
        ...prev,
        orders: [...prev.orders, order]}));

      setShowOrderModal(false);
      setSelectedAlert(null);
      setNewOrder({ quantity: '', supplier: '', expectedDelivery: '' });
  }
  };

  return (
    <>
      <Head>
        <title>Advanced Restocking - Kent Traders Admin Dashboard</title>
        <meta name='description' content='Advanced inventory restocking and supplier management' />
      </Head>

      <Layout>
        <div className='max-w-7xl mx-auto px-4 sm: px-6 lg:px-8 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Advanced Restocking 📦</h1>
            <p className='text-gray-600'>
              Intelligent restocking alerts, supplier management, and automated reorder suggestions
            </p>
          </div>

          {/* Restocking Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-semibold text-gray-900'>Critical Alerts</h3>
              <p className='text-3xl font-bold text-red-600'>
                {restockingData.alerts.filter(a => a.status === 'critical').length}
              </p>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-semibold text-gray-900'>Pending Orders</h3>
              <p className='text-3xl font-bold text-yellow-600'>
                {restockingData.orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-semibold text-gray-900'>Active Suppliers</h3>
              <p className='text-3xl font-bold text-blue-600'>{restockingData.suppliers.length}</p>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-semibold text-gray-900'>Avg Lead Time</h3>
              <p className='text-3xl font-bold text-green-600'>
                {Math.round(
                  restockingData.suppliers.reduce((sum, s) => sum + s.avgLeadTime, 0) /
                    restockingData.suppliers.length
                )}{' '}
                days
              </p>
            </div>
          </div>

          {/* Restocking Alerts */}
          <div className='bg-white rounded-lg shadow mb-8'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h2 className='text-lg font-semibold text-gray-900'>Restocking Alerts</h2>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Product
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Current Stock
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Threshold
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Supplier
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Lead Time
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {restockingData.alerts.map(alert => (
                    <tr key={alert.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>{alert.product}</div>
                          <div className='text-sm text-gray-500'>{alert.sku}</div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`text-sm font-medium ${getStockColor(alert.currentStock, alert.threshold)}`}
                        >
                          {alert.currentStock}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {alert.threshold}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {alert.supplier}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {alert.leadTime} days
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status,)}`}
                        >
                          {alert.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleCreateOrder(alert)} className='text-blue-600 hover:text-blue-800'
                          >
                            Create Order
                          </button>
                          <button className='text-green-600 hover:text-green-800'>
                            View History
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className='bg-white rounded-lg shadow mb-8'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h2 className='text-lg font-semibold text-gray-900'>Recent Restocking Orders</h2>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Order ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Product
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Quantity
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Supplier
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Order Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Expected Delivery
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {restockingData.orders.map(order => (
                    <tr key={order.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {order.id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {order.product}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {order.quantity}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {order.supplier}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(order.expectedDelivery).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600'>
                        £{order.totalCost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supplier Performance */}
          <div className='bg-white rounded-lg shadow'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h2 className='text-lg font-semibold text-gray-900'>Supplier Performance</h2>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {restockingData.suppliers.map(supplier => (
                  <div key={supplier.id} className='border rounded-lg p-4'>
                    <div className='flex items-center justify-between mb-3'>
                      <h3 className='text-lg font-semibold text-gray-900'>{supplier.name}</h3>
                      <span className='text-sm text-gray-500'>⭐ {supplier.rating}</span>
                    </div>
                    <div className='space-y-2 text-sm text-gray-600'>
                      <p>Contact: {supplier.contact}</p>
                      <p>Email: {supplier.email}</p>
                      <p>Avg Lead Time: {supplier.avgLeadTime} days</p>
                      <p>Reliability: {supplier.reliability}%</p>
                    </div>
                    <div className='mt-4'>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-green-600 h-2 rounded-full'
                          style={{ width: `${supplier.reliability}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Create Order Modal */}
    {showOrderModal && selectedAlert && (
            <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
              <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
                <div className='mt-3'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Create Restocking Order
                  </h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Product
                      </label>
                      <input
                        type='text'
                        value={selectedAlert.product}
                        readOnly
                        className='input bg-gray-50'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Quantity
                      </label>
                      <input
                        type='number'
                        value={newOrder.quantity} onChange={e => setNewOrder({ ...newOrder, quantity: e.target.value })}
                        className='input'
                        placeholder='Enter quantity'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Supplier
                      </label>
                      <input
                        type='text'
                        value={newOrder.supplier} onChange={e => setNewOrder({ ...newOrder, supplier: e.target.value })}
                        className='input'
                        placeholder='Enter supplier'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Expected Delivery
                      </label>
                      <input
                        type='date'
                        value={newOrder.expectedDelivery} onChange={e =>
                          setNewOrder({ ...newOrder, expectedDelivery: e.target.value })
  }
                        className='input'
                      />
                    </div>
                  </div>
                  <div className='flex space-x-3 mt-6'>
                    <button onClick={submitOrder} className='btn-primary flex-1'>
                      Create Order
                    </button>
                    <button
                      onClick={() => setShowOrderModal(false)} className='btn-secondary flex-1'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
