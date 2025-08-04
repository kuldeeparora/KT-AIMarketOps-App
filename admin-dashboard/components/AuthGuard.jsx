import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate authentication check,
    setTimeout(() => {
      setAuthenticated(true);
      setLoading(false);
    }, 100);
  }, []);

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <Typography variant='h6'>Please log in to access the dashboard.</Typography>
      </Box>
    );
  }

  return children;
}
