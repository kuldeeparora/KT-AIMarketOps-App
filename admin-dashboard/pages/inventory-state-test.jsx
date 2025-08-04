import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function InventoryStateTest() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 [State Test] useEffect called');
    setLoading(false);
  }, []);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h4" gutterBottom>
        State Management Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        Loading: {loading.toString()}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        Count: {count}
      </Typography>
      
      <Button variant="contained" onClick={handleClick} sx={{ mb: 2 }}>
        Increment Count
      </Button>
      
      {!loading && (
        <Typography variant="body1" color="success.main">
          ✅ State management is working correctly!
        </Typography>
      )}
    </Box>
  );
} 