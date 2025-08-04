import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Button } from '@mui/material';

export default function InventorySimple() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    console.log('🔍 [Simple Inventory] useEffect called');
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      console.log('🔍 [Simple Inventory] Starting to fetch inventory data...');
      setLoading(true);
      setError(null);

      // Temporarily use mock data to test component rendering
      console.log('🔍 [Simple Inventory] Using mock data for testing...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = [
        {
          productName: 'Test Product 1',
          sku: 'TEST-001',
          currentStock: 10,
          source: 'Mock'
        },
        {
          productName: 'Test Product 2',
          sku: 'TEST-002',
          currentStock: 5,
          source: 'Mock'
        }
      ];
      
      console.log('🔍 [Simple Inventory] Setting inventory state with mock data...');
      setInventory(mockData);
      console.log('✅ [Simple Inventory] Successfully loaded mock inventory data');

    } catch (err) {
      console.error('❌ [Simple Inventory] Error:', err);
      console.error('❌ [Simple Inventory] Error stack:', err.stack);
      setError('Failed to fetch inventory data: ' + err.message);
    } finally {
      console.log('🔍 [Simple Inventory] Setting loading to false');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h4" gutterBottom>
        Simple Inventory Test
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        Found {inventory.length} items
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={fetchInventoryData}
        sx={{ mb: 2 }}
      >
        Refresh Data
      </Button>
      
      {inventory.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            First 5 items:
          </Typography>
          {inventory.slice(0, 5).map((item, index) => (
            <Box key={index} sx={{ mb: 1, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Name:</strong> {item.productName || item.name}
              </Typography>
              <Typography variant="body2">
                <strong>SKU:</strong> {item.sku}
              </Typography>
              <Typography variant="body2">
                <strong>Stock:</strong> {item.currentStock || item.stockLevel}
              </Typography>
              <Typography variant="body2">
                <strong>Source:</strong> {item.source}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
} 