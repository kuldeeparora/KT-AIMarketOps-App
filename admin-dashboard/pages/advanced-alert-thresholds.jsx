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
  CircularProgress,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  AlertTitle,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  AttachMoney as AttachMoneyIcon,
  Euro as EuroIcon,
  CurrencyPound as CurrencyPoundIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  VerifiedUser as VerifiedUserIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  DataUsage as DataUsageIcon,
  Storage as StorageIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Sync as SyncIcon,
  BugReport as BugReportIcon,
  Build as BuildIcon,
  Test as TestIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  Block as BlockIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon,
  SupervisedUserCircle as SupervisedUserIcon,
  Security as SecurityIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';

export default function AdvancedAlertThresholds() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertRules, setAlertRules] = useState([]);
  const [thresholds, setThresholds] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [automationSettings, setAutomationSettings] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  useEffect(() => {
    fetchAlertData();
  }, []);

  const fetchAlertData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock data
      const mockAlertRules = generateMockAlertRules();
      const mockThresholds = generateMockThresholds();
      const mockNotifications = generateMockNotifications();
      const mockAutomationSettings = generateMockAutomationSettings();

      setAlertRules(mockAlertRules);
      setThresholds(mockThresholds);
      setNotifications(mockNotifications);
      setAutomationSettings(mockAutomationSettings);

    } catch (err) {
      console.error('Error fetching alert data:', err);
      setError('Failed to fetch alert data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAlertRules = () => {
    return [
      {
        id: 1,
        name: 'Low Stock Alert',
        description: 'Trigger when inventory falls below minimum threshold',
        category: 'inventory',
        severity: 'high',
        threshold: 10,
        condition: 'below',
        metric: 'stock_level',
        status: 'active',
        notifications: ['email', 'sms', 'dashboard'],
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        triggerCount: 15
      },
      {
        id: 2,
        name: 'High Demand Alert',
        description: 'Alert when product demand exceeds supply',
        category: 'demand',
        severity: 'medium',
        threshold: 80,
        condition: 'above',
        metric: 'demand_ratio',
        status: 'active',
        notifications: ['email', 'dashboard'],
        lastTriggered: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        triggerCount: 8
      },
      {
        id: 3,
        name: 'Price Drop Alert',
        description: 'Monitor competitor price changes',
        category: 'pricing',
        severity: 'high',
        threshold: 15,
        condition: 'below',
        metric: 'price_difference',
        status: 'active',
        notifications: ['email', 'sms'],
        lastTriggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        triggerCount: 3
      },
      {
        id: 4,
        name: 'Quality Issue Alert',
        description: 'Detect product quality problems',
        category: 'quality',
        severity: 'critical',
        threshold: 5,
        condition: 'above',
        metric: 'defect_rate',
        status: 'inactive',
        notifications: ['email', 'sms', 'dashboard', 'phone'],
        lastTriggered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        triggerCount: 0
      },
      {
        id: 5,
        name: 'Revenue Drop Alert',
        description: 'Monitor revenue decline',
        category: 'financial',
        severity: 'high',
        threshold: 20,
        condition: 'below',
        metric: 'revenue_change',
        status: 'active',
        notifications: ['email', 'dashboard'],
        lastTriggered: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        triggerCount: 2
      }
    ];
  };

  const generateMockThresholds = () => {
    return {
      inventory: {
        low_stock: 10,
        critical_stock: 5,
        overstock: 100,
        reorder_point: 15
      },
      financial: {
        revenue_drop: 20,
        profit_margin: 15,
        cash_flow: 5000,
        debt_ratio: 0.6
      },
      quality: {
        defect_rate: 5,
        return_rate: 10,
        customer_satisfaction: 4.0,
        warranty_claims: 2
      },
      performance: {
        page_load_time: 3,
        api_response_time: 500,
        error_rate: 1,
        uptime: 99.9
      }
    };
  };

  const generateMockNotifications = () => {
    return [
      {
        id: 1,
        type: 'email',
        recipient: 'admin@kenttraders.com',
        template: 'low_stock_alert',
        status: 'sent',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        readAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        type: 'sms',
        recipient: '+44 7911 123456',
        template: 'critical_alert',
        status: 'delivered',
        sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        readAt: null
      },
      {
        id: 3,
        type: 'dashboard',
        recipient: 'all_users',
        template: 'demand_alert',
        status: 'read',
        sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        readAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const generateMockAutomationSettings = () => {
    return {
      autoResolve: true,
      escalationEnabled: true,
      escalationDelay: 30,
      maxEscalations: 3,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
        timezone: 'Europe/London'
      },
      notificationChannels: {
        email: true,
        sms: true,
        dashboard: true,
        phone: false,
        slack: false
      },
      alertGrouping: {
        enabled: true,
        window: 300,
        maxGroupSize: 10
      }
    };
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#4F8CFF';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'sent': return '#4F8CFF';
      case 'delivered': return '#10B981';
      case 'read': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setOpenDialog(true);
  };

  const handleSaveRule = () => {
    // Save rule logic
    setOpenDialog(false);
    setSelectedRule(null);
  };

  const handleDeleteRule = (ruleId) => {
    setAlertRules(alertRules.filter(rule => rule.id !== ruleId));
  };

  const handleToggleRule = (ruleId) => {
    setAlertRules(alertRules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' }
        : rule
    ));
  };

  return (
    <Layout>
      <Head>
        <title>Advanced Alert Thresholds - Kent Traders Admin</title>
        <meta name="description" content="Advanced alert threshold management and automation" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #E8E8EA 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Advanced Alert Thresholds
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Configure advanced alert thresholds, automation rules, and notification settings for comprehensive system monitoring
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Alert Rules Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(79, 140, 255, 0.3)',
                  }}
                >
                  <SecurityIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {alertRules.length}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Active Rules
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <NotificationsActiveIcon sx={{ color: '#F59E0B', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Recent Alerts
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {alertRules.reduce((sum, rule) => sum + rule.triggerCount, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Last 24 hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <WarningIcon sx={{ color: '#EF4444', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Critical Alerts
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {alertRules.filter(rule => rule.severity === 'critical').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  High priority
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <AutoAwesomeIcon sx={{ color: '#10B981', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Automation
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {automationSettings.autoResolve ? 'ON' : 'OFF'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Auto-resolve enabled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alert Rules Table */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <SecurityIcon sx={{ color: '#4F8CFF' }} />
                    Alert Rules
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
                      color: 'white',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #3B7AE8 0%, #5A8FE8 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(79, 140, 255, 0.3)',
                      },
                    }}
                  >
                    Add Rule
                  </Button>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Rule</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Category</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Severity</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Threshold</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alertRules.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                {rule.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {rule.description}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rule.category}
                              size="small"
                              sx={{
                                backgroundColor: '#3A3A3D',
                                color: 'text.secondary',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rule.severity}
                              size="small"
                              sx={{
                                backgroundColor: `${getSeverityColor(rule.severity)}20`,
                                color: getSeverityColor(rule.severity),
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {rule.condition} {rule.threshold}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rule.status}
                              size="small"
                              sx={{
                                backgroundColor: `${getStatusColor(rule.status)}20`,
                                color: getStatusColor(rule.status),
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditRule(rule)}
                                sx={{ color: '#4F8CFF' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleRule(rule.id)}
                                sx={{ color: rule.status === 'active' ? '#F59E0B' : '#10B981' }}
                              >
                                {rule.status === 'active' ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteRule(rule.id)}
                                sx={{ color: '#EF4444' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Threshold Settings */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <SettingsIcon sx={{ color: '#4F8CFF' }} />
                  Threshold Settings
                </Typography>
                <Stack spacing={3}>
                  {Object.entries(thresholds).map(([category, settings]) => (
                    <Accordion
                      key={category}
                      sx={{
                        backgroundColor: 'transparent',
                        border: '1px solid',
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                        sx={{ color: 'text.primary' }}
                      >
                        <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                          {category.replace('_', ' ')}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={2}>
                          {Object.entries(settings).map(([key, value]) => (
                            <Box key={key}>
                              <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                                  {key.replace('_', ' ')}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                  {typeof value === 'number' ? value : value.toString()}
                                </Typography>
                              </Box>
                              <Slider
                                value={typeof value === 'number' ? value : 0}
                                min={0}
                                max={100}
                                step={1}
                                sx={{
                                  color: '#4F8CFF',
                                  '& .MuiSlider-thumb': {
                                    backgroundColor: '#4F8CFF',
                                  },
                                  '& .MuiSlider-track': {
                                    backgroundColor: '#4F8CFF',
                                  },
                                }}
                              />
                            </Box>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Automation Settings */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <AutoAwesomeIcon sx={{ color: '#4F8CFF' }} />
                  Automation Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 2, fontWeight: 600 }}>
                      General Settings
                    </Typography>
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={automationSettings.autoResolve}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#10B981',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#10B981',
                              },
                            }}
                          />
                        }
                        label="Auto-resolve alerts"
                        sx={{ color: 'text.primary' }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={automationSettings.escalationEnabled}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#10B981',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#10B981',
                              },
                            }}
                          />
                        }
                        label="Enable escalation"
                        sx={{ color: 'text.primary' }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={automationSettings.quietHours?.enabled}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#10B981',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#10B981',
                              },
                            }}
                          />
                        }
                        label="Quiet hours"
                        sx={{ color: 'text.primary' }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 2, fontWeight: 600 }}>
                      Notification Channels
                    </Typography>
                    <Stack spacing={2}>
                      {Object.entries(automationSettings.notificationChannels || {}).map(([channel, enabled]) => (
                        <FormControlLabel
                          key={channel}
                          control={
                            <Switch
                              checked={enabled}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#10B981',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#10B981',
                                },
                              }}
                            />
                          }
                          label={channel.charAt(0).toUpperCase() + channel.slice(1)}
                          sx={{ color: 'text.primary' }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Edit Rule Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'background.paper',
              border: '1px solid',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ color: 'text.primary', fontWeight: 600 }}>
            Edit Alert Rule
          </DialogTitle>
          <DialogContent>
            {selectedRule && (
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  label="Rule Name"
                  value={selectedRule.name}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'text.primary',
                      '& fieldset': {
                        borderColor: '#3A3A3D',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F8CFF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F8CFF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    },
                  }}
                />
                <TextField
                  label="Description"
                  value={selectedRule.description}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'text.primary',
                      '& fieldset': {
                        borderColor: '#3A3A3D',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4F8CFF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4F8CFF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    },
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'text.secondary' }}>Severity</InputLabel>
                  <Select
                    value={selectedRule.severity}
                    label="Severity"
                    sx={{
                      color: 'text.primary',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3A3A3D',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4F8CFF',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4F8CFF',
                      },
                    }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: '#3A3A3D',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRule}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
                color: 'white',
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #3B7AE8 0%, #5A8FE8 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(79, 140, 255, 0.3)',
                },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Loading Overlay */}
        {loading && (
          <Box position="fixed" top={0} left={0} right={0} zIndex={9999}>
            <LinearProgress />
          </Box>
        )}
      </Container>
    </Layout>
  );
}
