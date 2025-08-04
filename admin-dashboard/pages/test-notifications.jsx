import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Send as SendIcon,
  Email as EmailIcon,
  Sms as SmsIcon
} from '@mui/icons-material';

export default function TestNotifications() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState('email');
  const [recipient, setRecipient] = useState('');

  const sendTestNotification = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage(`Test ${notificationType} notification sent successfully!`);
    } catch (error) {
      setMessage('Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Test Notifications - Kent Traders Admin</title>
        <meta name="description" content="Test notification system" />
      </Head>

      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Test Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Test the notification system with different channels
            </Typography>
          </Box>

          {message && (
            <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Send Test Notification
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter email or phone number"
                    sx={{ mb: 2 }}
                  />
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Notification Type</InputLabel>
                    <Select
                      value={notificationType}
                      label="Notification Type"
                      onChange={(e) => setNotificationType(e.target.value)}
                    >
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="sms">SMS</MenuItem>
                      <MenuItem value="push">Push Notification</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={sendTestNotification}
                    disabled={loading || !recipient}
                    fullWidth
                  >
                    {loading ? 'Sending...' : 'Send Test Notification'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Settings
                  </Typography>
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email Notifications"
                    sx={{ mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch />}
                    label="SMS Notifications"
                    sx={{ mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Push Notifications"
                    sx={{ mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch />}
                    label="Low Stock Alerts"
                    sx={{ mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Order Updates"
                    sx={{ mb: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}
