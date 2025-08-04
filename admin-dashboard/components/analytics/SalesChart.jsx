import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart} from 'recharts';

export default function SalesChart({ data = [] }) {
  // Generate sample data if no data provided,
  const chartData =
    data.length > 0
      ? data
      : [
          { name: 'Jan', sales: 1200 },
          { name: 'Feb', sales: 1800 },
          { name: 'Mar', sales: 1600 },
          { name: 'Apr', sales: 2200 },
          { name: 'May', sales: 2800 },
          { name: 'Jun', sales: 3200 },
          { name: 'Jul', sales: 2600 },
          { name: 'Aug', sales: 3400 },
          { name: 'Sep', sales: 3800 },
          { name: 'Oct', sales: 4200 },
          { name: 'Nov', sales: 4600 },
          { name: 'Dec', sales: 5000 }];

  return (
    <div className='w-full h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis dataKey='name' stroke='#6b7280' fontSize={12} />
          <YAxis stroke='#6b7280' fontSize={12} tickFormatter={value => `£${value}`} />
          <Tooltip
            formatter={value => [`£${value}`, 'Sales']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
          />
          <Area
            type='monotone'
            dataKey='sales'
            stroke='#3b82f6'
            strokeWidth={2}
            fill='#3b82f6'
            fillOpacity={0.1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
