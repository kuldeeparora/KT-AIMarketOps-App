import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Email as EmailIcon,
  Home as HomeIcon
} from '@mui/icons-material';

export default function VerifyEmail() {
  const router = useRouter();
  const { token, email } = router.query;
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token && email) {
      verifyEmail();
    }
  }, [token, email]);

  const verifyEmail = async () => {
    try {
      setStatus('verifying');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, always succeed
      setStatus('success');
      setMessage('Your email has been verified successfully!');
    } catch (error) {
      setStatus('error');
      setMessage('Email verification failed. Please try again.');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleResendVerification = () => {
    // Implement resend verification logic
    setMessage('Verification email sent! Please check your inbox.');
  };

  const getStatusContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <Box textAlign="center">
            <CircularProgress size={64} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Verifying Your Email
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your email address...
            </Typography>
          </Box>
        );
      
      case 'success':
        return (
          <Box textAlign="center">
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="success.main">
              Email Verified Successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your email address has been verified. You can now access all features.
            </Typography>
          </Box>
        );
      
      case 'error':
        return (
          <Box textAlign="center">
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="error.main">
              Verification Failed
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We couldn't verify your email. The link may have expired.
            </Typography>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Verify Email - Kent Traders Admin</title>
        <meta name="description" content="Email verification page" />
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
              <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Email Verification
              </Typography>
            </Box>

            {message && (
              <Alert 
                severity={status === 'success' ? 'success' : 'error'} 
                sx={{ mb: 3 }}
              >
                {message}
              </Alert>
            )}

            {getStatusContent()}

            <Box mt={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<HomeIcon />}
                    onClick={handleGoHome}
                  >
                    Go to Dashboard
                  </Button>
                </Grid>
                
                {status === 'error' && (
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleResendVerification}
                    >
                      Resend Verification Email
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
