import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Logout as LogoutIcon, Cancel, CheckCircle } from '@mui/icons-material';

// Dynamically import the component to prevent SSR issues
const SignOutForm = dynamic(() => import('../../components/auth/SignOutForm'), {
  ssr: false,
  loading: () => <CircularProgress />
});

export default function SignOut() {
  return (
    <>
      <Head>
        <title>Sign Out - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Sign out confirmation" />
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
            <Box textAlign="center" mb={4}>
              <LogoutIcon
                sx={{
                  fontSize: 64,
                  color: 'warning.main',
                  mb: 2
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Sign Out
              </Typography>
            </Box>

            <Alert
              severity="info"
              sx={{
                mb: 3
              }}
            >
              Are you sure you want to sign out of your account?
            </Alert>

            <SignOutForm />
          </Paper>
        </Container>
      </Box>
    </>
  );
}
