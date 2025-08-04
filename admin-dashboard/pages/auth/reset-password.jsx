import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  CheckCircle,
  Error
} from '@mui/icons-material';

export default function PasswordReset() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reset, setReset] = useState(false);

  useEffect(() => {
    const { token, email } = router.query;
    if (!token || !email) {
      setError('Invalid reset link');
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { token, email } = router.query;

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          token,
          newPassword: formData.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully!');
        setReset(true);
      } else {
        setError(result.error || 'Password reset failed');
      }
    } catch (error) {
      setError('An error occurred during password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (reset) {
    return (
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
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            <CheckCircle
              sx={{
                fontSize: 64,
                color: 'success.main',
                mb: 2
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Password Reset Successfully!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 3
              }}
            >
              Your password has been updated. You can now sign in with your new password.
            </Typography>
            <Button variant="contained" size="large" onClick={() => router.push('/auth/signin')}>
              Sign In
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Reset your password" />
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
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Lock
                sx={{
                  fontSize: 48,
                  color: 'primary.main',
                  mb: 2
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Reset Password
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Enter your new password
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3
                }}
              >
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 3
                }}
              >
                {success}
              </Alert>
            )}

            {/* Reset Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                helperText="Password must be at least 8 characters long"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </Box>

            {/* Footer */}
            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{' '}
                <Button
                  variant="text"
                  onClick={() => router.push('/auth/signin')}
                  sx={{
                    p: 0,
                    minWidth: 'auto'
                  }}
                >
                  Sign in here
                </Button>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
