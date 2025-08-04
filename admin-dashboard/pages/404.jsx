import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon
} from '@mui/icons-material';

export default function Custom404() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSearch = () => {
    router.push('/search');
  };

  return (
    <>
      <Head>
        <title>404 - Page Not Found | Kent Traders Admin</title>
        <meta name="description" content="Page not found" />
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
              <ErrorIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
              <Typography variant="h2" component="h1" gutterBottom color="warning.main">
                404
              </Typography>
              <Typography variant="h4" component="h2" gutterBottom>
                Page Not Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The page you're looking for doesn't exist or has been moved.
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Go Home
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Return to the main dashboard
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<HomeIcon />}
                      onClick={handleGoHome}
                      fullWidth
                    >
                      Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Go Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Return to the previous page
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={handleGoBack}
                      fullWidth
                    >
                      Back
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Search
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Search for what you're looking for
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<SearchIcon />}
                      onClick={handleSearch}
                      fullWidth
                    >
                      Search
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                If you believe this is an error, please contact support.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
} 