import React from 'react';
import { Box, Typography } from '@mui/material';

export default function TestMUI() {
  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h4" gutterBottom>
        Material-UI Test
      </Typography>
      <Typography variant="body1">
        If you can see this, Material-UI is working.
      </Typography>
    </Box>
  );
} 