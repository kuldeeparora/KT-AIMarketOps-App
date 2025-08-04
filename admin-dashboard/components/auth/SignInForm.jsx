import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, TextField, Button, Alert, CircularProgress, Link, Divider, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';

export default function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      if (formData.email && formData.password) {
        // Redirect to dashboard
        router.push('/');
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Box textAlign="center">
              <Link href="/auth/forgot-password" variant="body2">
                Forgot your password?
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="/auth/signup">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
} 