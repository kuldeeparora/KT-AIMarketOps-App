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
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  AlertTitle,
  Collapse,
  Slider,
  Rating,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon,
  SupervisedUserCircle as SupervisedUserIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon,
  Branding as BrandingIcon,
  PriceCheck as PriceCheckIcon,
  Euro as EuroIcon,
  CurrencyPound as CurrencyPoundIcon,
  Help as HelpIcon
} from '@mui/icons-material';

export default function EnhancedAlertThresholds() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertRules, setAlertRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRule, setSelectedRule] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: '',
    threshold: 0,
    priority: 'medium',
    status: 'active',
    notificationChannels: [],
    description: '',
    cooldownPeriod: 300, // 5 minutes
    escalationEnabled: false,
    autoResolve: false
  });

  useEffect(() => {
    fetchAlertRules();
  }, []);

  useEffect(() => {
    filterRules();
  }, [alertRules, searchTerm, filterCategory, filterStatus, filterPriority]);

  const fetchAlertRules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock alert rules data
      const mockRules = generateMockAlertRules();
      setAlertRules(mockRules);
      setFilteredRules(mockRules);

    } catch (err) {
      console.error('Error fetching alert rules:', err);
      setError('Failed to fetch alert rules: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAlertRules = () => {
    const categories = ['Inventory', 'Sales', 'Performance', 'Security', 'System', 'Financial'];
    const conditions = ['Low Stock', 'High Demand', 'Price Drop', 'Performance Degradation', 'Security Breach', 'Revenue Decline'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    const statuses = ['active', 'inactive', 'testing'];
    const notificationChannels = ['email', 'sms', 'webhook', 'slack'];

    return Array.from({ length: 25 }, (_, index) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const channels = notificationChannels.slice(0, Math.floor(Math.random() * notificationChannels.length) + 1);
      const threshold = Math.floor(Math.random() * 100) + 10;
      const triggeredCount = Math.floor(Math.random() * 50);
      const lastTriggered = Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null;

      return {
        id: `rule-${index + 1}`,
        name: `${condition} Alert Rule ${index + 1}`,
        category,
        condition,
        threshold,
        priority,
        status,
        notificationChannels: channels,
        description: `Automated alert for ${condition.toLowerCase()} monitoring`,
        cooldownPeriod: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
        escalationEnabled: Math.random() > 0.5,
        autoResolve: Math.random() > 0.7,
        triggeredCount,
        lastTriggered,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: `admin@kenttraders.com`
      };
    });
  };

  const filterRules = () => {
    let filtered = alertRules;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(rule =>
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.condition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(rule => rule.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(rule => rule.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(rule => rule.priority === filterPriority);
    }

    setFilteredRules(filtered);
  };

  const handleAddRule = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      category: '',
      condition: '',
      threshold: 0,
      priority: 'medium',
      status: 'active',
      notificationChannels: [],
      description: '',
      cooldownPeriod: 300,
      escalationEnabled: false,
      autoResolve: false
    });
    setDialogOpen(true);
  };

  const handleEditRule = (rule) => {
    setDialogMode('edit');
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      category: rule.category,
      condition: rule.condition,
      threshold: rule.threshold,
      priority: rule.priority,
      status: rule.status,
      notificationChannels: rule.notificationChannels,
      description: rule.description,
      cooldownPeriod: rule.cooldownPeriod,
      escalationEnabled: rule.escalationEnabled,
      autoResolve: rule.autoResolve
    });
    setDialogOpen(true);
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this alert rule?')) {
      setAlertRules(alertRules.filter(rule => rule.id !== ruleId));
    }
  };

  const handleSaveRule = () => {
    if (dialogMode === 'add') {
      const newRule = {
        id: `rule-${Date.now()}`,
        ...formData,
        triggeredCount: 0,
        lastTriggered: null,
        createdAt: new Date().toISOString(),
        createdBy: 'admin@kenttraders.com'
      };
      setAlertRules([...alertRules, newRule]);
    } else {
      setAlertRules(alertRules.map(rule =>
        rule.id === selectedRule.id ? { ...rule, ...formData } : rule
      ));
    }
    setDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'testing': return 'warning';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Inventory': return <AssignmentIcon />;
      case 'Sales': return <TrendingUpIcon />;
      case 'Performance': return <SpeedIcon />;
      case 'Security': return <SecurityIcon />;
      case 'System': return <SettingsIcon />;
      case 'Financial': return <CurrencyPoundIcon />;
      default: return <InfoIcon />;
    }
  };

  const getUniqueCategories = () => {
    return [...new Set(alertRules.map(rule => rule.category))];
  };

  const getAlertStats = () => {
    const totalRules = alertRules.length;
    const activeRules = alertRules.filter(r => r.status === 'active').length;
    const criticalRules = alertRules.filter(r => r.priority === 'critical').length;
    const totalTriggered = alertRules.reduce((sum, r) => sum + r.triggeredCount, 0);
    const recentAlerts = alertRules.filter(r => r.lastTriggered && new Date(r.lastTriggered) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;

    return {
      totalRules,
      activeRules,
      criticalRules,
      totalTriggered,
      recentAlerts
    };
  };

  const stats = getAlertStats();

  return (
    <Layout>
      <>
        <Head>
          <title>Enhanced Alert Thresholds - Kent Traders Admin</title>
          <meta name="description" content="Advanced alert threshold management for Kent Traders Admin" />
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
              Enhanced Alert Thresholds
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                color: 'text.secondary',
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              Configure intelligent alert rules and monitoring thresholds for proactive system management
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Controls */}
          <Paper 
            sx={{ 
              p: 4, 
              mb: 4,
              background: 'background.paper',
              border: '1px solid',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search alert rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#2A2A2D',
                      border: '1px solid',
                      '&:hover': {
                        borderColor: '#4F8CFF',
                      },
                      '&.Mui-focused': {
                        borderColor: '#4F8CFF',
                        boxShadow: '0 0 0 2px rgba(79, 140, 255, 0.2)',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {getUniqueCategories().map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="testing">Testing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    label="Priority"
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddRule}
                  fullWidth
                >
                  Add Rule
                </Button>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchAlertRules}
                  fullWidth
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={2.4}>
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
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(79, 140, 255, 0.3)',
                      }}
                    >
                      <NotificationsIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h3" 
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: '2rem',
                        }}
                      >
                        {stats.totalRules}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        Total Rules
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
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
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h3" 
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: '2rem',
                        }}
                      >
                        {stats.activeRules}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        Active Rules
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
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
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      <ErrorIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h3" 
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: '2rem',
                        }}
                      >
                        {stats.criticalRules}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        Critical Rules
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
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
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <WarningIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h3" 
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: '2rem',
                        }}
                      >
                        {stats.totalTriggered}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        Total Triggered
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
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
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <TimelineIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h3" 
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: '2rem',
                        }}
                      >
                        {stats.recentAlerts}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        Recent Alerts
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Alert Rules Table */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rule</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Threshold</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Notifications</TableCell>
                    <TableCell>Triggered</TableCell>
                    <TableCell>Last Triggered</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRules
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {rule.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {rule.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getCategoryIcon(rule.category)}
                            label={rule.category}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{rule.condition}</TableCell>
                        <TableCell>{rule.threshold}</TableCell>
                        <TableCell>
                          <Chip
                            label={rule.priority.charAt(0).toUpperCase() + rule.priority.slice(1)}
                            color={getPriorityColor(rule.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                            color={getStatusColor(rule.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            {rule.notificationChannels.map((channel, index) => (
                              <Chip
                                key={index}
                                label={channel}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Badge badgeContent={rule.triggeredCount} color="primary">
                            <NotificationsIcon />
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {rule.lastTriggered
                            ? new Date(rule.lastTriggered).toLocaleString()
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="View Details">
                              <IconButton size="small" color="primary">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Rule">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditRule(rule)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Rule">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteRule(rule.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredRules.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          {/* Add/Edit Alert Rule Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {dialogMode === 'add' ? 'Add New Alert Rule' : 'Edit Alert Rule'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Rule Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      label="Category"
                    >
                      <MenuItem value="Inventory">Inventory</MenuItem>
                      <MenuItem value="Sales">Sales</MenuItem>
                      <MenuItem value="Performance">Performance</MenuItem>
                      <MenuItem value="Security">Security</MenuItem>
                      <MenuItem value="System">System</MenuItem>
                      <MenuItem value="Financial">Financial</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Threshold"
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      label="Priority"
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="critical">Critical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="testing">Testing</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cooldown Period (seconds)"
                    type="number"
                    value={formData.cooldownPeriod}
                    onChange={(e) => setFormData({ ...formData, cooldownPeriod: parseInt(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Notification Channels</InputLabel>
                    <Select
                      multiple
                      value={formData.notificationChannels}
                      onChange={(e) => setFormData({ ...formData, notificationChannels: e.target.value })}
                      label="Notification Channels"
                    >
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="sms">SMS</MenuItem>
                      <MenuItem value="webhook">Webhook</MenuItem>
                      <MenuItem value="slack">Slack</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.escalationEnabled}
                        onChange={(e) => setFormData({ ...formData, escalationEnabled: e.target.checked })}
                      />
                    }
                    label="Enable Escalation"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.autoResolve}
                        onChange={(e) => setFormData({ ...formData, autoResolve: e.target.checked })}
                      />
                    }
                    label="Auto Resolve"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveRule} variant="contained">
                {dialogMode === 'add' ? 'Add Rule' : 'Save Changes'}
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
      </>
    </Layout>
  );
}
