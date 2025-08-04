import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Chip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Support as SupportIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  Branding as BrandingIcon,
  PriceCheck as PriceCheckIcon,
  AttachMoney as MoneyIcon,
  Euro as EuroIcon,
  CurrencyPound as PoundIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewComfy as ViewComfyIcon,
  Dashboard as DashboardIcon,
  Print as PrintIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowDown as ExpandMore,
  KeyboardArrowUp as ExpandLess,
  Lightbulb as IntelligenceIcon,
  BarChart as ReportsIcon,
  Speed as OptimizationIcon,
  DataUsage as DataIcon,
  Link as IntegrationIcon,
  SmartToy as AIIcon,
  Insights as InsightsIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@aimarketops.com',
    role: 'Administrator',
    avatar: 'JD',
    phone: '+1 (555) 123-4567',
    location: 'London, UK',
    company: 'AIMarketOps',
    department: 'Operations',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-15T10:30:00Z',
    status: 'active',
    permissions: ['admin', 'inventory', 'orders', 'analytics', 'users'],
    preferences: {
      theme: 'dark',
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      language: 'en',
      timezone: 'Europe/London',
    },
    security: {
      twoFactorEnabled: true,
      lastPasswordChange: '2024-01-01T00:00:00Z',
      failedLoginAttempts: 0,
      accountLocked: false,
    },
    activity: [
      {
        id: 1,
        action: 'Logged in',
        timestamp: '2024-01-15T10:30:00Z',
        ip: '192.168.1.100',
        location: 'London, UK',
      },
      {
        id: 2,
        action: 'Updated inventory',
        timestamp: '2024-01-15T09:15:00Z',
        ip: '192.168.1.100',
        location: 'London, UK',
      },
      {
        id: 3,
        action: 'Generated report',
        timestamp: '2024-01-15T08:45:00Z',
        ip: '192.168.1.100',
        location: 'London, UK',
      },
    ],
  });

  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData({ ...user });
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ ...formData });
      setEditMode(false);
    } catch (err) {
      console.error('Error saving user data:', err);
      setError('Failed to save user data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading && !user) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Account - AIMarketOps</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4" component="h1">
              Account Settings
            </Typography>
            <Box display="flex" gap={1}>
              {editMode ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings, preferences, and security
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Profile Overview Card */}
        <Card sx={{ 
          mb: 4,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
                      fontSize: '2rem',
                      fontWeight: 600,
                    }}
                  >
                    {user.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.role}
                    </Typography>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2">
                        {user.phone}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body2">
                        {user.location}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Last Login
                      </Typography>
                      <Typography variant="body2">
                        {formatTimestamp(user.lastLogin)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Profile" icon={<PersonIcon />} />
            <Tab label="Security" icon={<SecurityIcon />} />
            <Tab label="Preferences" icon={<SettingsIcon />} />
            <Tab label="Activity" icon={<TimeIcon />} />
          </Tabs>

          {/* Profile Tab */}
          {selectedTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={editMode ? formData.name : user.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={editMode ? formData.email : user.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    value={editMode ? formData.phone : user.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={editMode ? formData.location : user.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Company"
                    value={editMode ? formData.company : user.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Department"
                    value={editMode ? formData.department : user.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Security Tab */}
          {selectedTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Two-Factor Authentication
                      </Typography>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          {user.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </Typography>
                        <Switch
                          checked={user.security.twoFactorEnabled}
                          disabled={!editMode}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Password
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last changed: {formatTimestamp(user.security.lastPasswordChange)}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<LockIcon />}
                        disabled={!editMode}
                      >
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card sx={{
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Login Activity
                      </Typography>
                      <List>
                        {user.activity.map((activity) => (
                          <ListItem key={activity.id}>
                            <ListItemIcon>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary={activity.action}
                              secondary={`${formatTimestamp(activity.timestamp)} - ${activity.ip} (${activity.location})`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Preferences Tab */}
          {selectedTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={editMode ? formData.preferences.theme : user.preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      disabled={!editMode}
                      label="Theme"
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={editMode ? formData.preferences.language : user.preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      disabled={!editMode}
                      label="Language"
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={editMode ? formData.preferences.timezone : user.preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                      disabled={!editMode}
                      label="Timezone"
                    >
                      <MenuItem value="Europe/London">Europe/London</MenuItem>
                      <MenuItem value="America/New_York">America/New_York</MenuItem>
                      <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Notifications
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editMode ? formData.preferences.notifications : user.preferences.notifications}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                        disabled={!editMode}
                      />
                    }
                    label="Push Notifications"
                    sx={{ mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editMode ? formData.preferences.emailAlerts : user.preferences.emailAlerts}
                        onChange={(e) => handlePreferenceChange('emailAlerts', e.target.checked)}
                        disabled={!editMode}
                      />
                    }
                    label="Email Alerts"
                    sx={{ mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editMode ? formData.preferences.smsAlerts : user.preferences.smsAlerts}
                        onChange={(e) => handlePreferenceChange('smsAlerts', e.target.checked)}
                        disabled={!editMode}
                      />
                    }
                    label="SMS Alerts"
                    sx={{ mb: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Activity Tab */}
          {selectedTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {user.activity.map((activity) => (
                  <ListItem key={activity.id}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${formatTimestamp(activity.timestamp)} - ${activity.ip} (${activity.location})`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Container>
    </Layout>
  );
} 