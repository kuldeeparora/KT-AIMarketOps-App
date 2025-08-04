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
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification link has expired or has already been used.';
      case 'Default':
      default:
        return 'An unexpected error occurred during authentication.';
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Authentication Error - Kent Traders Admin</title>
        <meta name="description" content="Authentication error page" />
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
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box textAlign="center" mb={3}>
              <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom color="error.main">
                Authentication Error
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {getErrorMessage(error)}
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Error Code: {error || 'Unknown'}
              </Typography>
            </Alert>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleGoBack}
                >
                  Go Back
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<HomeIcon />}
                  onClick={handleGoHome}
                >
                  Go Home
                </Button>
              </Grid>
            </Grid>

            <Box mt={3} textAlign="center">
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
