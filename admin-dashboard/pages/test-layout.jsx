import React from 'react';
import Layout from '../components/Layout';
import { AIMarketOpsThemeProvider } from '../components/AIMarketOpsTheme';
import { Typography, Box } from '@mui/material';

export default function TestLayout() {
  return (
    <AIMarketOpsThemeProvider>
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Test Layout Page
          </Typography>
          <Typography variant="body1">
            This is a test page to verify the Layout component is working properly.
          </Typography>
        </Box>
      </Layout>
    </AIMarketOpsThemeProvider>
  );
}
