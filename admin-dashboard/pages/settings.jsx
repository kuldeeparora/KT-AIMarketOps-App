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
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  CurrencyExchange as CurrencyIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Kent Traders',
      email: 'admin@kenttraders.co.uk',
      phone: '+44 123 456 7890',
      address: '123 High Street, Kent, UK',
      timezone: 'Europe/London',
      currency: 'GBP',
      language: 'en',
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      inventoryAlerts: true,
      lowStockThreshold: 10,
      dailyReports: true,
      weeklyReports: true,
    },
    integrations: {
      shopify: {
        enabled: true,
        storeUrl: 'kent-traders.myshopify.com',
        apiKey: '••••••••••••••••',
        webhookUrl: 'https://kenttraders.co.uk/webhooks/shopify',
      },
      sellerdynamics: {
        enabled: true,
        endpoint: 'https://api.sellerdynamics.com',
        retailerId: 'KT123456',
        encryptedLogin: '••••••••••••••••',
      },
      quickbooks: {
        enabled: false,
        companyId: '',
        accessToken: '',
      },
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      failedLoginAttempts: 5,
      ipWhitelist: [],
    },
    appearance: {
      theme: 'light',
      sidebarCollapsed: false,
      compactMode: false,
      showAnimations: true,
    },
  });

  const [saveDialog, setSaveDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const tabs = [
    { id: 'general', name: 'General', icon: <BusinessIcon /> },
    { id: 'notifications', name: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'integrations', name: 'Integrations', icon: <SettingsIcon /> },
    { id: 'security', name: 'Security', icon: <SecurityIcon /> },
    { id: 'appearance', name: 'Appearance', icon: <PaletteIcon /> },
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    setSaveDialog(true);
    setSaveStatus('saving');
    
    // Simulate save operation
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => {
        setSaveDialog(false);
        setSaveStatus('');
      }, 1500);
    }, 1000);
  };

  const renderGeneralSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Company Information
          </Typography>
          <TextField
            fullWidth
            label="Company Name"
            value={settings.general.companyName}
            onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={settings.general.email}
            onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone"
            value={settings.general.phone}
            onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Address"
            value={settings.general.address}
            onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Regional Settings
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Timezone</InputLabel>
            <Select
              value={settings.general.timezone}
              label="Timezone"
              onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            >
              <MenuItem value="Europe/London">Europe/London</MenuItem>
              <MenuItem value="America/New_York">America/New_York</MenuItem>
              <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={settings.general.currency}
              label="Currency"
              onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            >
              <MenuItem value="GBP">GBP (£)</MenuItem>
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.general.language}
              label="Language"
              onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Email Notifications
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive notifications via email"
              />
              <Switch
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Order Notifications"
                secondary="Get notified about new orders"
              />
              <Switch
                checked={settings.notifications.orderNotifications}
                onChange={(e) => handleSettingChange('notifications', 'orderNotifications', e.target.checked)}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText
                primary="Inventory Alerts"
                secondary="Receive low stock alerts"
              />
              <Switch
                checked={settings.notifications.inventoryAlerts}
                onChange={(e) => handleSettingChange('notifications', 'inventoryAlerts', e.target.checked)}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Report Settings
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Daily Reports"
                secondary="Receive daily summary reports"
              />
              <Switch
                checked={settings.notifications.dailyReports}
                onChange={(e) => handleSettingChange('notifications', 'dailyReports', e.target.checked)}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Weekly Reports"
                secondary="Receive weekly summary reports"
              />
              <Switch
                checked={settings.notifications.weeklyReports}
                onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
              />
            </ListItem>
          </List>
          <TextField
            fullWidth
            type="number"
            label="Low Stock Threshold"
            value={settings.notifications.lowStockThreshold}
            onChange={(e) => handleSettingChange('notifications', 'lowStockThreshold', parseInt(e.target.value))}
            sx={{ mt: 2 }}
          />
        </Paper>
      </Grid>
    </Grid>
  );

  const renderIntegrationSettings = () => (
    <Grid container spacing={3}>
      {Object.entries(settings.integrations).map(([key, integration]) => (
        <Grid item xs={12} md={6} key={key}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
              {key} Integration
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={integration.enabled}
                  onChange={(e) => handleSettingChange('integrations', key, {
                    ...integration,
                    enabled: e.target.checked
                  })}
                />
              }
              label={`Enable ${key} integration`}
              sx={{ mb: 2 }}
            />
            {integration.enabled && (
              <Box>
                {Object.entries(integration).filter(([k]) => k !== 'enabled').map(([field, value]) => (
                  <TextField
                    key={field}
                    fullWidth
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={value}
                    onChange={(e) => handleSettingChange('integrations', key, {
                      ...integration,
                      [field]: e.target.value
                    })}
                    sx={{ mb: 2 }}
                    type={field.includes('Token') || field.includes('Key') || field.includes('Login') ? 'password' : 'text'}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Authentication
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText
                primary="Two-Factor Authentication"
                secondary="Require 2FA for all users"
              />
              <Switch
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
              />
            </ListItem>
          </List>
          <TextField
            fullWidth
            type="number"
            label="Session Timeout (minutes)"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Password Expiry (days)"
            value={settings.security.passwordExpiry}
            onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Failed Login Attempts"
            value={settings.security.failedLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'failedLoginAttempts', parseInt(e.target.value))}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Security Status
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            All security settings are properly configured
          </Alert>
          <Alert severity="info" sx={{ mb: 2 }}>
            Last security scan: 2 hours ago
          </Alert>
          <Alert severity="warning">
            Consider enabling two-factor authentication
          </Alert>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderAppearanceSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Theme Settings
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Theme</InputLabel>
            <Select
              value={settings.appearance.theme}
              label="Theme"
              onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="auto">Auto</MenuItem>
            </Select>
          </FormControl>
          <List>
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Compact Mode"
                secondary="Use compact layout"
              />
              <Switch
                checked={settings.appearance.compactMode}
                onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Show Animations"
                secondary="Enable UI animations"
              />
              <Switch
                checked={settings.appearance.showAnimations}
                onChange={(e) => handleSettingChange('appearance', 'showAnimations', e.target.checked)}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Layout Settings
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Collapsed Sidebar"
                secondary="Start with collapsed sidebar"
              />
              <Switch
                checked={settings.appearance.sidebarCollapsed}
                onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderGeneralSettings();
      case 1:
        return renderNotificationSettings();
      case 2:
        return renderIntegrationSettings();
      case 3:
        return renderSecuritySettings();
      case 4:
        return renderAppearanceSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <>
      <Head>
        <title>Settings - Kent Traders Admin Dashboard</title>
        <meta name="description" content="System settings and configuration" />
      </Head>
      
      <Layout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure your Kent Traders admin dashboard
            </Typography>
          </Box>

          <Paper elevation={2} sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.id}
                  label={tab.name}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Paper>

          <Box sx={{ mb: 3 }}>
            {renderTabContent()}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </Box>
        </Container>

        {/* Save Dialog */}
        <Dialog open={saveDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {saveStatus === 'saving' ? 'Saving Settings...' : 'Settings Saved'}
          </DialogTitle>
          <DialogContent>
            {saveStatus === 'saving' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* CircularProgress is not imported, so it's commented out */}
                {/* <CircularProgress size={20} /> */}
                <Typography>Please wait while we save your settings...</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon color="success" />
                <Typography>Your settings have been saved successfully!</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
} 