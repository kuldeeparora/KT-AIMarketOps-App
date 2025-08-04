import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

export default function Custom500() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>500 - Server Error | Kent Traders Admin</title>
        <meta name="description" content="Internal server error" />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box textAlign="center" mb={4}>
              <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              <Typography variant="h2" component="h1" gutterBottom color="error.main">
                500
              </Typography>
              <Typography variant="h4" component="h2" gutterBottom>
                Internal Server Error
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Something went wrong on our end. We're working to fix it.
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Server Error</AlertTitle>
              An unexpected error occurred while processing your request. 
              Our team has been notified and is working to resolve the issue.
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
              >
                Refresh Page
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
              >
                Go Back
              </Button>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
              >
                Go Home
              </Button>
            </Box>

            <Box textAlign="center" sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                If this problem persists, please contact support.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
} 