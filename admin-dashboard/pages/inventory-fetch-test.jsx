import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

export default function InventoryFetchTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const testFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [Fetch Test] Starting fetch test...');
      const response = await fetch('/api/inventory/unified?limit=1&page=1');
      console.log('🔍 [Fetch Test] Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🔍 [Fetch Test] Response data:', result);
      setData(result);
      
    } catch (err) {
      console.error('❌ [Fetch Test] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔍 [Fetch Test] useEffect called');
    testFetch();
  }, []);

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h4" gutterBottom>
        Fetch API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        Loading: {loading.toString()}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}
      
      {data && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✅ Fetch successful! Found {data.data?.length || 0} items
        </Alert>
      )}
      
      <Button variant="contained" onClick={testFetch} sx={{ mb: 2 }}>
        Test Fetch Again
      </Button>
      
      {data && (
        <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            API Response:
          </Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      )}
    </Box>
  );
} 