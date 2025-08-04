import React, { useState, useEffect } from 'react';
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
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Key as KeyIcon,
  VpnKey as VpnKeyIcon,
  TwoWheeler as TwoWheelerIcon,
  Security as SecurityIcon2
} from '@mui/icons-material';

export default function Security() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    ipWhitelist: true,
    auditLogging: true,
    encryptionLevel: 'high'
  });

  const [securityEvents, setSecurityEvents] = useState([
    {
      id: 1,
      type: 'login',
      user: 'admin@kenttraders.com',
      ip: '192.168.1.100',
      timestamp: '2024-01-15 10:30:00',
      status: 'success',
      location: 'London, UK'
    },
    {
      id: 2,
      type: 'failed_login',
      user: 'unknown@example.com',
      ip: '203.0.113.45',
      timestamp: '2024-01-15 09:15:00',
      status: 'failed',
      location: 'Unknown'
    },
    {
      id: 3,
      type: 'password_change',
      user: 'manager@kenttraders.com',
      ip: '192.168.1.101',
      timestamp: '2024-01-14 16:45:00',
      status: 'success',
      location: 'London, UK'
    }
  ]);

  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);

  const handleSettingChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSecurityScan = () => {
    // Simulate security scan
    console.log('Running security scan...');
  };

  const getSecurityScore = () => {
    const scores = {
      twoFactorAuth: securitySettings.twoFactorAuth ? 25 : 0,
      passwordExpiry: securitySettings.passwordExpiry <= 90 ? 20 : 10,
      sessionTimeout: securitySettings.sessionTimeout <= 30 ? 15 : 5,
      ipWhitelist: securitySettings.ipWhitelist ? 20 : 0,
      auditLogging: securitySettings.auditLogging ? 20 : 0
    };
    return Object.values(scores).reduce((a, b) => a + b, 0);
  };

  const securityScore = getSecurityScore();

  return (
    <>
      <Head>
        <title>Security - Kent Traders Admin</title>
        <meta name="description" content="Security settings and monitoring for Kent Traders Admin Dashboard" />
      </Head>
      <Layout>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Security Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor and manage security settings for your Kent Traders platform
            </Typography>
          </Box>

          {/* Security Score */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom>
                  {securityScore}/100
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Security Score
                </Typography>
                <Chip
                  label={securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Good' : 'Needs Improvement'}
                  color={securityScore >= 80 ? 'success' : securityScore >= 60 ? 'warning' : 'error'}
                  sx={{ mt: 1 }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Security Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {securityEvents.filter(e => e.status === 'success').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Successful Logins
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error.main">
                        {securityEvents.filter(e => e.status === 'failed').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Failed Attempts
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="info.main">
                        {securityEvents.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Events
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        3
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Sessions
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Security Settings */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TwoWheelerIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Require 2FA for all user accounts"
                    />
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LockIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Password Expiry"
                      secondary={`${securitySettings.passwordExpiry} days`}
                    />
                    <TextField
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VpnKeyIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Session Timeout"
                      secondary={`${securitySettings.sessionTimeout} minutes`}
                    />
                    <TextField
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ShieldIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="IP Whitelist"
                      secondary="Restrict access to specific IP addresses"
                    />
                    <Switch
                      checked={securitySettings.ipWhitelist}
                      onChange={(e) => handleSettingChange('ipWhitelist', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Audit Logging"
                      secondary="Log all security events"
                    />
                    <Switch
                      checked={securitySettings.auditLogging}
                      onChange={(e) => handleSettingChange('auditLogging', e.target.checked)}
                    />
                  </ListItem>
                </List>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={handleSecurityScan}
                    fullWidth
                  >
                    Run Security Scan
                  </Button>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Security Events
                </Typography>
                <List>
                  {securityEvents.map((event) => (
                    <ListItem key={event.id} divider>
                      <ListItemIcon>
                        {event.status === 'success' ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <ErrorIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={event.user}
                        secondary={`${event.type} - ${event.ip} - ${event.timestamp}`}
                      />
                      <Chip
                        label={event.status}
                        color={event.status === 'success' ? 'success' : 'error'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" fullWidth>
                    View All Events
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Security Alerts */}
          <Box sx={{ mt: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Security Alerts
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>System Update Available:</strong> Security patch v2.1.3 is available for installation.
                </Typography>
              </Alert>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Unusual Activity Detected:</strong> Multiple failed login attempts from IP 203.0.113.45
                </Typography>
              </Alert>
              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Security Scan Complete:</strong> No vulnerabilities detected in the latest scan.
                </Typography>
              </Alert>
            </Paper>
          </Box>
        </Container>
      </Layout>
    </>
  );
} 