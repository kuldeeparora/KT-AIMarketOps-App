import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
export const RealTimeDataContext = createContext();

// Custom hook to use the context
export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  return context;
};

// Provider component
export default function RealTimeDataProvider({ children }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize real-time data connection
    const initializeData = async () => {
      setLoading(true);
      try {
        // Simulate real-time data fetching
        // In production, this would connect to WebSocket or Server-Sent Events
        const mockData = {
          timestamp: new Date().toISOString(),
          status: 'connected',
          metrics: {
            activeUsers: Math.floor(Math.random() * 100),
            ordersPerMinute: Math.floor(Math.random() * 10),
            revenue: Math.floor(Math.random() * 1000),
          },
        };

        setData(mockData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Set up interval for real-time updates
    const interval = setInterval(initializeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const value = {
    data,
    loading,
    error,
    refresh: () => {
      // Trigger manual refresh
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    },
  };

  return <RealTimeDataContext.Provider value={value}>{children}</RealTimeDataContext.Provider>;
}
