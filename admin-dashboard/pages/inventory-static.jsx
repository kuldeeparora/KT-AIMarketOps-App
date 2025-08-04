import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

export default function InventoryStatic() {
  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h4" gutterBottom>
        Static Inventory Test
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        This is a static test page to verify React rendering works.
      </Alert>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        If you can see this content, React and Material-UI are working correctly.
      </Typography>
      
      <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test Item 1
        </Typography>
        <Typography variant="body2">
          <strong>Name:</strong> Test Product 1
        </Typography>
        <Typography variant="body2">
          <strong>SKU:</strong> TEST-001
        </Typography>
        <Typography variant="body2">
          <strong>Stock:</strong> 10
        </Typography>
        <Typography variant="body2">
          <strong>Source:</strong> Static
        </Typography>
      </Box>
      
      <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Test Item 2
        </Typography>
        <Typography variant="body2">
          <strong>Name:</strong> Test Product 2
        </Typography>
        <Typography variant="body2">
          <strong>SKU:</strong> TEST-002
        </Typography>
        <Typography variant="body2">
          <strong>Stock:</strong> 5
        </Typography>
        <Typography variant="body2">
          <strong>Source:</strong> Static
        </Typography>
      </Box>
    </Box>
  );
} 