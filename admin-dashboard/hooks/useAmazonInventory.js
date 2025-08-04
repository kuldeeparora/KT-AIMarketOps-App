import { useState, useEffect } from 'react';

export default function useAmazonInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for now - replace with actual API call
        const mockInventory = [
          {
            sku: 'AMZ-001',
            asin: 'B08N5WRWNW',
            quantity: 45,
            bsr: 1234
          },
          {
            sku: 'AMZ-002',
            asin: 'B08N5WRWNW',
            quantity: 23,
            bsr: 5678
          },
          {
            sku: 'AMZ-003',
            asin: 'B08N5WRWNW',
            quantity: 67,
            bsr: 9012
          },
          {
            sku: 'AMZ-004',
            asin: 'B08N5WRWNW',
            quantity: 12,
            bsr: 3456
          },
          {
            sku: 'AMZ-005',
            asin: 'B08N5WRWNW',
            quantity: 89,
            bsr: 7890
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setInventory(mockInventory);
      } catch (err) {
        setError(err.message || 'Failed to fetch Amazon inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return { inventory, loading, error };
}