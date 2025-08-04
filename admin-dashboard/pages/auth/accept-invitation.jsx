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
  Person,
  Email,
  CheckCircle,
  Error
} from '@mui/icons-material';

export default function AcceptInvitation() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const { token, email } = router.query;
    if (!token || !email) {
      setError('Invalid invitation link');
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
      const response = await fetch('/api/auth/accept-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
          name: formData.name
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Invitation accepted successfully!');
        setAccepted(true);
      } else {
        setError(result.error || 'Failed to accept invitation');
      }
    } catch (error) {
      setError('An error occurred while accepting invitation');
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

  if (accepted) {
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
              Welcome to Kent Traders!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 3
              }}
            >
              Your account has been created successfully. You can now sign in to access the admin
              dashboard.
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
        <title>Accept Invitation - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Accept your invitation to join Kent Traders" />
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
              <Person
                sx={{
                  fontSize: 48,
                  color: 'primary.main',
                  mb: 2
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Accept Invitation
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Complete your account setup
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

            {/* Invitation Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Email"
                value={router.query.email || ''}
                disabled
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Password"
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
                label="Confirm Password"
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
                {loading ? <CircularProgress size={24} /> : 'Accept Invitation'}
              </Button>
            </Box>

            {/* Footer */}
            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
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
