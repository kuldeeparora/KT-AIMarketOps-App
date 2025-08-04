import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  DataUsage as DataUsageIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

export default function TestData() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateTestData = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage('Test data generated successfully!');
    } catch (error) {
      setMessage('Failed to generate test data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Test Data - Kent Traders Admin</title>
        <meta name="description" content="Generate test data for development" />
      </Head>

      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Test Data
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate test data for development and testing purposes
            </Typography>
          </Box>

          {message && (
            <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Generate Test Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create sample products, orders, and inventory data for testing.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DataUsageIcon />}
                    onClick={generateTestData}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? 'Generating...' : 'Generate Test Data'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Export Test Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Download test data for external analysis.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    fullWidth
                  >
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}
