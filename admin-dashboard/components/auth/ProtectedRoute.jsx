import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isStaticEnvironment, setIsStaticEnvironment] = useState(false);

  useEffect(() => {
    // Check if we're in a static environment (Firebase hosting)
    const staticEnv = typeof window !== 'undefined' && 
      (window.location.hostname.includes('web.app') || 
       window.location.hostname.includes('firebaseapp.com') ||
       process.env.NODE_ENV === 'production');
    
    setIsStaticEnvironment(staticEnv);
    
    if (staticEnv) {
      // In static environment, bypass authentication for demo purposes
      console.log('Static environment detected - bypassing authentication');
      setIsAuthorized(true);
      return;
    }

    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Check role-based access if required
    if (requiredRole) {
      const userRole = session.user?.role || 'user';
      if (userRole !== requiredRole && userRole !== 'admin') {
        setIsAuthorized(false);
        return;
      }
    }

    setIsAuthorized(true);
  }, [session, status, router, requiredRole]);

  if (isStaticEnvironment) {
    // In static environment, show a demo notice but allow access
    return (
      <Box>
        <Box
          sx={{
            backgroundColor: 'warning.main',
            color: 'warning.contrastText',
            p: 1,
            textAlign: 'center',
            fontSize: '0.875rem',
          }}
        >
          🔒 Demo Mode - Authentication bypassed for static deployment
        </Box>
        {children}
      </Box>
    );
  }

  if (status === 'loading') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              textAlign: 'center',
            }}
          >
            <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Verifying Authentication
            </Typography>
            <CircularProgress sx={{ mt: 2 }} />
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  if (!isAuthorized) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              textAlign: 'center',
            }}
          >
            <SecurityIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You don&apos;t have permission to access this page.
            </Typography>
            <Button
              variant="contained"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              sx={{ mr: 2 }}
            >
              Sign Out
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/')}
            >
              Go to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return children;
} 