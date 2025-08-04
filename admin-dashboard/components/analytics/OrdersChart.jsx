import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OrdersChart({ data = [] }) {
  // Generate sample data if no data provided,
  const chartData =
    data.length > 0
      ? data
      : [
          { name: 'Jan', orders: 45 },
          { name: 'Feb', orders: 62 },
          { name: 'Mar', orders: 58 },
          { name: 'Apr', orders: 78 },
          { name: 'May', orders: 92 },
          { name: 'Jun', orders: 105 },
          { name: 'Jul', orders: 88 },
          { name: 'Aug', orders: 112 },
          { name: 'Sep', orders: 125 },
          { name: 'Oct', orders: 138 },
          { name: 'Nov', orders: 152 },
          { name: 'Dec', orders: 165 }];

  return (
    <div className='w-full h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis dataKey='name' stroke='#6b7280' fontSize={12} />
          <YAxis stroke='#6b7280' fontSize={12} />
          <Tooltip
            formatter={value => [value, 'Orders']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
          />
          <Bar dataKey='orders' fill='#10b981' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
