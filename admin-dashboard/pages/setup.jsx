import React, { useState } from 'react';
import Head from 'next/head';
import {
  useRouter
} from 'next/router';
import {
  Box,
  Container,
  Paper,
  Typography,
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
  Email,
  Lock,
  Person,
  Security
} from '@mui/icons-material';

export default function Setup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match,
  if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength,
  if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'admin'
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Admin user created successfully! You can now sign in.');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create user');
      }
    } catch (error) {
      setError('An error occurred during setup');
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

  return (
    <>
      <Head>
        <title>Setup - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Initial setup for Kent Traders Admin Dashboard" />
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
            elevation={8} sx={{
              p: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Security sx={{
                fontSize: 48, color: 'primary.main', mb: 2
              }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Initial Setup
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Create Admin User
              </Typography>
            </Box>

            {/* Success Alert */}
            {success && (
              <Alert severity="success" sx={{
                mb: 3
              }}>
                {success}
              </Alert>
            )}
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{
                mb: 3
              }}>
                {error}
              </Alert>
            )}
            {/* Development Notice */}
            <Alert severity="info" sx={{
              mb: 3
            }}>
              <Typography variant="body2">
                <strong>Development Mode: </strong> This setup creates a local admin user for development purposes. 
                In production, this would create a user in the database.
              </Typography>
            </Alert>

            {/* Setup Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Create Admin Account
              </Typography>
              
              <TextField
                fullWidth
                label="Full Name" name="name"
                value={formData.name} onChange={handleInputChange}
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
                label="Email" name="email"
                type="email" value={formData.email}
                onChange={handleInputChange} margin="normal"
                required
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
                label="Password" name="password"
                type={showPassword ? 'text' : 'password'} value={formData.password}
                onChange={handleInputChange} margin="normal"
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
                        onClick={() => setShowPassword(!showPassword)} edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label="Confirm Password" name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword}
                onChange={handleInputChange} margin="normal"
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end"
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
                variant="contained" size="large"
                disabled={loading} sx={{
                  mt: 3, mb: 2
                }}>
                {loading ? <CircularProgress size={24} /> : 'Create Admin User'}
              </Button>
            </Box>

            {/* Footer */}
            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="text.secondary">
                This will create the first admin user for the system
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                mt: 1
              }}>
                <strong>Note:</strong> For development, you can also use the default credentials: <br />,
    Email: admin@kenttraders.com | Password: admin123
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
} 