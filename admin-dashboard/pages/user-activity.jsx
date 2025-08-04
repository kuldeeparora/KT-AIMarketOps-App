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
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  LinearProgress
} from '@mui/material';
import {
    Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Block as BlockIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  VerifiedUser as VerifiedUserIcon,
  Pending as PendingIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon,
  SupervisedUserCircle as SupervisedUserIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccessTime as AccessTimeIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Public as PublicIcon,
  VpnKey as VpnKeyIcon,
  History as HistoryIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Assessment as AssessmentIcon,
  Report as ReportIcon,
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Help as HelpIcon
} from '@mui/icons-material';

export default function UserActivity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchUserActivities();
  }, [timeRange]);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, filterUser, filterAction, filterStatus]);

  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock user activity data
      const mockActivities = generateMockUserActivities();
      setActivities(mockActivities);
      setFilteredActivities(mockActivities);

    } catch (err) {
      console.error('Error fetching user activities:', err);
      setError('Failed to fetch user activities: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockUserActivities = () => {
    const users = ['admin@kenttraders.com', 'manager@kenttraders.com', 'user1@kenttraders.com', 'user2@kenttraders.com', 'user3@kenttraders.com'];
    const actions = ['login', 'logout', 'view_inventory', 'edit_product', 'create_order', 'delete_item', 'export_data', 'import_data', 'change_settings', 'view_reports'];
    const statuses = ['success', 'failed', 'pending'];
    const devices = ['desktop', 'mobile', 'tablet'];
    const locations = ['London, UK', 'Manchester, UK', 'Birmingham, UK', 'Leeds, UK', 'Liverpool, UK'];
    const ipAddresses = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.10', '198.51.100.5'];

    return Array.from({ length: 50 }, (_, index) => {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const ipAddress = ipAddresses[Math.floor(Math.random() * ipAddresses.length)];
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

      return {
        id: `activity-${index + 1}`,
        userId: user,
        userName: user.split('@')[0],
        action,
        status,
        device,
        location,
        ipAddress,
        timestamp: timestamp.toISOString(),
        sessionId: `session-${Math.floor(Math.random() * 10000)}`,
        userAgent: `Mozilla/5.0 (${device === 'mobile' ? 'iPhone' : device === 'tablet' ? 'iPad' : 'Windows NT 10.0'}) AppleWebKit/537.36`,
        details: generateActionDetails(action),
        duration: Math.floor(Math.random() * 300) + 1 // seconds
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const generateActionDetails = (action) => {
    const details = {
      login: 'User logged in successfully',
      logout: 'User logged out',
      view_inventory: 'Viewed inventory dashboard',
      edit_product: 'Modified product information',
      create_order: 'Created new order',
      delete_item: 'Deleted inventory item',
      export_data: 'Exported data to CSV',
      import_data: 'Imported data from file',
      change_settings: 'Updated system settings',
      view_reports: 'Accessed analytics reports'
    };
    return details[action] || 'User action performed';
  };

  const filterActivities = () => {
    let filtered = activities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // User filter
    if (filterUser !== 'all') {
      filtered = filtered.filter(activity => activity.userId === filterUser);
    }

    // Action filter
    if (filterAction !== 'all') {
      filtered = filtered.filter(activity => activity.action === filterAction);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(activity => activity.status === filterStatus);
    }

    setFilteredActivities(filtered);
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'login': return 'success';
      case 'logout': return 'info';
      case 'view_inventory': return 'primary';
      case 'edit_product': return 'warning';
      case 'create_order': return 'success';
      case 'delete_item': return 'error';
      case 'export_data': return 'info';
      case 'import_data': return 'warning';
      case 'change_settings': return 'error';
      case 'view_reports': return 'primary';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'login': return <LoginIcon />;
      case 'logout': return <LogoutIcon />;
      case 'view_inventory': return <InventoryIcon />;
      case 'edit_product': return <EditIcon />;
      case 'create_order': return <ShoppingCartIcon />;
      case 'delete_item': return <DeleteIcon />;
      case 'export_data': return <AssessmentIcon />;
      case 'import_data': return <AddIcon />;
      case 'change_settings': return <SettingsIcon />;
      case 'view_reports': return <ReportIcon />;
      default: return <InfoIcon />;
    }
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'desktop': return <ComputerIcon />;
      case 'mobile': return <SmartphoneIcon />;
      case 'tablet': return <TabletIcon />;
      default: return <ComputerIcon />;
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getUniqueUsers = () => {
    return [...new Set(activities.map(activity => activity.userId))];
  };

  const getUniqueActions = () => {
    return [...new Set(activities.map(activity => activity.action))];
  };

  const getActivityStats = () => {
    const totalActivities = activities.length;
    const successfulActivities = activities.filter(a => a.status === 'success').length;
    const failedActivities = activities.filter(a => a.status === 'failed').length;
    const uniqueUsers = getUniqueUsers().length;
    const activeSessions = activities.filter(a => a.action === 'login').length - activities.filter(a => a.action === 'logout').length;

    return {
      totalActivities,
      successfulActivities,
      failedActivities,
      uniqueUsers,
      activeSessions
    };
  };

  const stats = getActivityStats();

  return (
    <Layout>
      <>
        <Head>
          <title>User Activity - Kent Traders Admin</title>
          <meta name="description" content="Comprehensive user activity monitoring for Kent Traders Admin" />
        </Head>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              User Activity
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor user activities, sessions, and system access across the platform
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
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>User</InputLabel>
                  <Select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    label="User"
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    {getUniqueUsers().map(user => (
                      <MenuItem key={user} value={user}>{user}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    label="Action"
                  >
                    <MenuItem value="all">All Actions</MenuItem>
                    {getUniqueActions().map(action => (
                      <MenuItem key={action} value={action}>{action.replace('_', ' ')}</MenuItem>
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
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    label="Time Range"
                  >
                    <MenuItem value="1h">Last Hour</MenuItem>
                    <MenuItem value="24h">Last 24 Hours</MenuItem>
                    <MenuItem value="7d">Last 7 Days</MenuItem>
                    <MenuItem value="30d">Last 30 Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchUserActivities}
                  fullWidth
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <TimelineIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.totalActivities}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Activities
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.successfulActivities}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Successful
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <ErrorIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.failedActivities}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Failed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <PersonIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.uniqueUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <VpnKeyIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.activeSessions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Sessions
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Activities Table */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Device</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredActivities
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2 }}>
                              {activity.userName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="bold">
                                {activity.userName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {activity.userId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getActionIcon(activity.action)}
                            label={activity.action.replace('_', ' ')}
                            color={getActionColor(activity.action)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            color={getStatusColor(activity.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getDeviceIcon(activity.device)}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {activity.device}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{activity.location}</TableCell>
                        <TableCell>{activity.ipAddress}</TableCell>
                        <TableCell>
                          {new Date(activity.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {formatDuration(activity.duration)}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewDetails(activity)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredActivities.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          {/* Activity Details Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              Activity Details
            </DialogTitle>
            <DialogContent>
              {selectedActivity && (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>User Information</Typography>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ mr: 2 }}>
                        {selectedActivity.userName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedActivity.userName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedActivity.userId}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Activity Information</Typography>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Action</Typography>
                      <Chip
                        icon={getActionIcon(selectedActivity.action)}
                        label={selectedActivity.action.replace('_', ' ')}
                        color={getActionColor(selectedActivity.action)}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip
                        label={selectedActivity.status.charAt(0).toUpperCase() + selectedActivity.status.slice(1)}
                        color={getStatusColor(selectedActivity.status)}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Duration</Typography>
                      <Typography variant="body1">{formatDuration(selectedActivity.duration)}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Session Information</Typography>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Session ID</Typography>
                      <Typography variant="body1">{selectedActivity.sessionId}</Typography>
                    </Box>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Device</Typography>
                      <Box display="flex" alignItems="center">
                        {getDeviceIcon(selectedActivity.device)}
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {selectedActivity.device}
                        </Typography>
                      </Box>
                    </Box>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Location</Typography>
                      <Typography variant="body1">{selectedActivity.location}</Typography>
                    </Box>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">IP Address</Typography>
                      <Typography variant="body1">{selectedActivity.ipAddress}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Details</Typography>
                    <Typography variant="body1">{selectedActivity.details}</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>User Agent</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {selectedActivity.userAgent}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
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
