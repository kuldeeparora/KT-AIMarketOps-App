import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Badge,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  TablePagination,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
  MarkEmailUnread as MarkUnreadIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Support as SupportIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  VideoCall as VideoCallIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Branding as BrandingIcon,
  PriceCheck as PriceCheckIcon,
  AttachMoney as MoneyIcon,
  Euro as EuroIcon,
  CurrencyPound as PoundIcon,
  Help as HelpIcon,
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
} from '@mui/icons-material';

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTab, setSelectedTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    today: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchTerm, filterType, filterStatus]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate comprehensive notifications
      const mockNotifications = generateMockNotifications();
      setNotifications(mockNotifications);
      calculateStats(mockNotifications);

    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockNotifications = () => {
    const notificationTypes = [
      { type: 'inventory', icon: <InventoryIcon />, color: 'primary' },
      { type: 'order', icon: <ShoppingCartIcon />, color: 'success' },
      { type: 'analytics', icon: <AnalyticsIcon />, color: 'info' },
      { type: 'security', icon: <SecurityIcon />, color: 'warning' },
      { type: 'system', icon: <SettingsIcon />, color: 'secondary' },
      { type: 'ai', icon: <AIIcon />, color: 'primary' },
    ];

    const priorities = ['high', 'medium', 'low'];
    const statuses = ['unread', 'read'];
    const messages = [
      'Low stock alert for product SKU-001',
      'New order received from customer #12345',
      'AI analysis completed for inventory optimization',
      'System backup completed successfully',
      'Security scan detected potential threat',
      'Performance metrics updated',
      'Vendor integration status changed',
      'Payment processed for order #67890',
      'Inventory sync completed with SellerDynamics',
      'New user account created',
      'API rate limit approaching threshold',
      'Database maintenance scheduled',
      'Export report generated successfully',
      'Import process completed',
      'Alert threshold updated',
      'User permissions modified',
      'System update available',
      'Integration test completed',
      'Backup verification successful',
      'Performance optimization recommended',
    ];

    const notifications = [];
    const now = new Date();

    for (let i = 0; i < 25; i++) {
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      
      // Generate timestamp within last 7 days
      const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      notifications.push({
        id: i + 1,
        type: type.type,
        icon: type.icon,
        color: type.color,
        priority,
        status,
        message,
        timestamp,
        read: status === 'read',
        actionable: Math.random() > 0.5,
        category: type.type,
      });
    }

    return notifications.sort((a, b) => b.timestamp - a.timestamp);
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(notification => 
        filterStatus === 'unread' ? !notification.read : notification.read
      );
    }

    setFilteredNotifications(filtered);
  };

  const calculateStats = (data) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    setStats({
      total: data.length,
      unread: data.filter(n => !n.read).length,
      highPriority: data.filter(n => n.priority === 'high').length,
      mediumPriority: data.filter(n => n.priority === 'medium').length,
      lowPriority: data.filter(n => n.priority === 'low').length,
      today: data.filter(n => n.timestamp >= today).length,
      thisWeek: data.filter(n => n.timestamp >= weekAgo).length,
    });
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setDialogOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    return status === 'unread' ? 'primary' : 'default';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
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
        <title>Notifications - AIMarketOps</title>
        <meta name="description" content="Manage and view all system notifications" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and view all system notifications, alerts, and updates
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <NotificationsIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">Total</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <NotificationsActiveIcon color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.unread}</Typography>
                    <Typography variant="body2" color="text.secondary">Unread</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WarningIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.highPriority}</Typography>
                    <Typography variant="body2" color="text.secondary">High Priority</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <InfoIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.today}</Typography>
                    <Typography variant="body2" color="text.secondary">Today</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CalendarIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.thisWeek}</Typography>
                    <Typography variant="body2" color="text.secondary">This Week</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <SettingsIcon color="secondary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.mediumPriority}</Typography>
                    <Typography variant="body2" color="text.secondary">Medium Priority</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="inventory">Inventory</MenuItem>
                  <MenuItem value="order">Orders</MenuItem>
                  <MenuItem value="analytics">Analytics</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                  <MenuItem value="ai">AI</MenuItem>
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
                  <MenuItem value="unread">Unread</MenuItem>
                  <MenuItem value="read">Read</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<MarkReadIcon />}
                  onClick={handleMarkAllAsRead}
                >
                  Mark All Read
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchNotifications}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={() => setSettingsOpen(true)}
                >
                  Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Notifications List */}
        <Paper>
          <List>
            {filteredNotifications
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                secondaryAction={
                  <Box display="flex" gap={1}>
                    {!notification.read && (
                      <Tooltip title="Mark as read">
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <MarkReadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewNotification(notification)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${notification.color}.main` }}>
                    {notification.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: notification.read ? 400 : 600,
                          color: notification.read ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Chip
                        label={notification.priority}
                        size="small"
                        color={getPriorityColor(notification.priority)}
                      />
                      {notification.actionable && (
                        <Chip
                          label="Actionable"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(notification.timestamp)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.type}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
          <TablePagination
            component="div"
            count={filteredNotifications.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>

        {/* Notification Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Notification Details
          </DialogTitle>
          <DialogContent>
            {selectedNotification && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedNotification.message}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={selectedNotification.priority}
                    color={getPriorityColor(selectedNotification.priority)}
                    size="small"
                  />
                  <Chip
                    label={selectedNotification.type}
                    color="primary"
                    size="small"
                  />
                  {selectedNotification.actionable && (
                    <Chip
                      label="Actionable"
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Timestamp: {selectedNotification.timestamp.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {selectedNotification.read ? 'Read' : 'Unread'}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
} 