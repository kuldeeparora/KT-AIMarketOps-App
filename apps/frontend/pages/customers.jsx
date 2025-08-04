import { useEffect, useState } from 'react';
import axios from 'axios';

function CustomersTable({ customers }) {
  if (!customers?.length) return <div className="text-gray-500">No recent customers.</div>;
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Orders</th>
            <th className="py-2 px-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id} className="border-b border-gray-100 dark:border-gray-700">
              <td className="py-2 px-4">{c.name}</td>
              <td className="py-2 px-4">{c.email}</td>
              <td className="py-2 px-4">{c.orders_count}</td>
              <td className="py-2 px-4">{c.created_at.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AIInsightsWidget({ insights }) {
  if (!insights?.predictions?.length) return null;
  return (
    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">SmartOps AI Insights</h2>
      <ul className="list-disc pl-6 text-blue-900 dark:text-blue-100">
        {insights.predictions.slice(0, 5).map((insight, i) => (
          <li key={i}>{insight.summary || JSON.stringify(insight)}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [customerCount, setCustomerCount] = useState('...');
  const [aiInsights, setAIInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [customersRes, aiInsightsRes] = await Promise.all([
          axios.get('/api/shopify-customers'),
          axios.get('http://localhost:3000/api/analytics/ai'),
        ]);
        setCustomers(customersRes.data.customers);
        setCustomerCount(customersRes.data.customerCount);
        setAIInsights(aiInsightsRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to load customers data.');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Customers</h1>
      {loading ? <div className="text-gray-500">Loading...</div> : <>
        <AIInsightsWidget insights={aiInsights} />
        <div className="mb-4">
          <span className="text-gray-600 dark:text-gray-300 font-semibold">Customer Count:</span> {customerCount}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Recent Customers</h2>
          {error ? <div className="text-red-500">{error}</div> : <CustomersTable customers={customers} />}
        </div>
      </>}
    </div>
  );
} 