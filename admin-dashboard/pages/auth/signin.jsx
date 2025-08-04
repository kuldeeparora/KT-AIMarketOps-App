import React, { useState } from 'react';
import Head from 'next/head';
import { signIn, getSession } from 'next-auth/react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Security as SecurityIcon,
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const result = await signIn('google', { callbackUrl: '/' });
      
      if (result?.error) {
        if (result.error === 'AccessDenied') {
          setInfo('Your login request has been submitted for admin approval. You will be notified once approved.');
        } else {
          setError('Sign in failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/'
      });
      
      if (result?.error) {
        if (result.error === 'AccessDenied') {
          setInfo('Your login request has been submitted for admin approval. You will be notified once approved.');
        } else {
          setError('Invalid credentials. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - Kent Traders Admin</title>
        <meta name="description" content="Sign in to Kent Traders Admin Dashboard" />
      </Head>
      
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Admin Access Required
              </Typography>
              <Typography variant="body1" color="textSecondary">
                All login attempts require admin approval
              </Typography>
            </Box>

            {/* Info Alert */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Security Notice:</strong> All login requests are manually reviewed by the administrator. 
                You will be notified once your access is approved.
              </Typography>
            </Alert>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Info Alert */}
            {info && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {info}
              </Alert>
            )}

            {/* Sign In Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sign In Options
              </Typography>
              
              {/* Google Sign In */}
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  'Continue with Google'
                )}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Chip label="OR" />
              </Divider>

              {/* Credentials Sign In */}
              <Box component="form" onSubmit={handleCredentialsSignIn}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>
            </Box>

            {/* Approval Process Info */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="primary" />
                  Approval Process
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  1. Submit your login request using any method above
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  2. Your request will be reviewed by the administrator
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  3. You will receive notification once approved
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  4. Only approved users can access the dashboard
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
