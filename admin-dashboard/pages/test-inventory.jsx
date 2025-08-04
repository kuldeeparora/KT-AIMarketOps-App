import { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';

export default function TestInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const testAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Testing API...');
      const response = await fetch('/api/inventory/unified?limit=5&page=1');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API result:', result);
      setData(result);
      
    } catch (err) {
      console.error('API error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory API Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testAPI}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test API'}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {data && (
        <Alert severity="success" sx={{ mb: 2 }}>
          API working! Found {data.data?.length || 0} items
        </Alert>
      )}
      
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        {data ? JSON.stringify(data, null, 2) : 'No data'}
      </pre>
    </Box>
  );
} 