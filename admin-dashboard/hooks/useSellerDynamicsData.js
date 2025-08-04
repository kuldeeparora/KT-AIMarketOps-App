import { useState, useEffect, useCallback } from 'react';

export const useSellerDynamicsData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[useSellerDynamicsData] Fetching dashboard stats...');
      
      const response = await fetch('/api/dashboard-stats');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data');
      }
      
      if (result.success) {
        setData(result.data);
        setLastUpdated(result.data.lastUpdated);
        console.log('[useSellerDynamicsData] Data fetched successfully:', {
          totalProducts: result.data.totalProducts,
          totalStock: result.data.totalStock,
          lowStockItems: result.data.lowStockItems,
          totalRevenue: result.data.totalRevenue,
          ordersToday: result.data.ordersToday,
          dataSource: result.data.dataSource
        });
      } else {
        throw new Error(result.error || 'API returned error');
      }
    } catch (err) {
      console.error('[useSellerDynamicsData] Error:', err);
      setError(err.message);
      
      // Fallback to mock data
      setData({
        totalProducts: 5,
        totalStock: 218,
        lowStockItems: 2,
        totalRevenue: 1705.75,
        ordersToday: 0,
        lastUpdated: new Date().toISOString(),
        dataSource: 'fallback'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[useSellerDynamicsData] Auto-refreshing data...');
      fetchData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refreshData,
    isRealData: data?.dataSource === 'real',
    isMockData: data?.dataSource === 'mock' || data?.dataSource === 'fallback'
  };
};

export default useSellerDynamicsData; 