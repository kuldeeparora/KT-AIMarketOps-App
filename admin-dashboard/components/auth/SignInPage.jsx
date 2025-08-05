import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';

export default function SignInPage() {
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
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        setError('Google sign in failed. Please try again.');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      setError('Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
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
          }}
        >
          <Box textAlign="center" mb={4}>
            <LockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your Kent Traders admin dashboard
            </Typography>
          </Box>

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
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  startIcon={<GoogleIcon />}
                  sx={{ 
                    py: 1.5,
                    borderColor: '#4285f4',
                    color: '#4285f4',
                    '&:hover': {
                      borderColor: '#3367d6',
                      backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign in with Google'
                  )}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup">
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
} 