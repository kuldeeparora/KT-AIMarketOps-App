import React from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { Box, Typography, Button } from '@mui/material';
import { Cancel, CheckCircle } from '@mui/icons-material';

export default function SignOutForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <>
      {session?.user && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Currently signed in as: <strong>{session.user.email}</strong>
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
        }}
      >
        <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          startIcon={<CheckCircle />}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </Box>
    </>
  );
} 