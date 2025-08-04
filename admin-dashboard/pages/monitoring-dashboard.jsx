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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  Tooltip,
  LinearProgress,
  Alert as MuiAlert,
  Snackbar
} from '@mui/material';
import {
  Monitor as MonitorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  BugReport as BugReportIcon,
  Build as BuildIcon,
  Update as UpdateIcon,
  Cloud as CloudIcon,
  Router as RouterIcon
} from '@mui/icons-material';

export default function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [performance, setPerformance] = useState({});
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [alertDialog, setAlertDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    setLoading(true);
    try {
      // Mock monitoring data
      const mockSystemStatus = {
        overall: 'healthy',
        uptime: '99.8%',
        lastCheck: new Date().toISOString(),
        services: [
          { name: 'Web Server', status: 'healthy', response: '200ms', uptime: '99.9%' },
          { name: 'Database', status: 'healthy', response: '45ms', uptime: '99.7%' },
          { name: 'Payment Gateway', status: 'warning', response: '850ms', uptime: '98.5%' },
          { name: 'Email Service', status: 'healthy', response: '120ms', uptime: '99.2%' },
          { name: 'File Storage', status: 'healthy', response: '75ms', uptime: '99.8%' }
        ]
      };

      const mockAlerts = [
        {
          id: 1,
          type: 'warning',
          title: 'High CPU Usage',
          message: 'CPU usage is at 85% on server-01',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          severity: 'medium',
          resolved: false
        },
        {
          id: 2,
          type: 'error',
          title: 'Database Connection Failed',
          message: 'Unable to connect to primary database',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          severity: 'high',
          resolved: true
        },
        {
          id: 3,
          type: 'info',
          title: 'Backup Completed',
          message: 'Daily backup completed successfully',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          severity: 'low',
          resolved: false
        }
      ];

      const mockPerformance = {
        cpu: { current: 45, max: 100, trend: 'stable' },
        memory: { current: 68, max: 100, trend: 'increasing' },
        disk: { current: 32, max: 100, trend: 'stable' },
        network: { current: 12, max: 100, trend: 'decreasing' },
        responseTime: { current: 245, max: 1000, trend: 'stable' },
        throughput: { current: 1250, max: 2000, trend: 'increasing' }
      };

      const mockLogs = [
        {
          id: 1,
          level: 'info',
          message: 'User login successful',
          timestamp: new Date().toISOString(),
          service: 'auth'
        },
        {
          id: 2,
          level: 'warning',
          message: 'Slow database query detected',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          service: 'database'
        },
        {
          id: 3,
          level: 'error',
          message: 'Payment processing failed',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          service: 'payment'
        }
      ];

      const mockNotifications = [
        {
          id: 1,
          type: 'system',
          title: 'System Update Available',
          message: 'New system update is ready for installation',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          read: false
        },
        {
          id: 2,
          type: 'security',
          title: 'Security Scan Completed',
          message: 'No vulnerabilities found in latest scan',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true
        }
      ];

      setSystemStatus(mockSystemStatus);
      setAlerts(mockAlerts);
      setPerformance(mockPerformance);
      setLogs(mockLogs);
      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircleIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <InfoIcon color="info" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const handleRefresh = () => {
    fetchMonitoringData();
    setSnackbar({ open: true, message: 'Monitoring data refreshed', severity: 'success' });
  };

  const handleAlertAction = (alertId, action) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolved: action === 'resolve' }
        : alert
    ));
    setSnackbar({ 
      open: true, 
      message: `Alert ${action === 'resolve' ? 'resolved' : 'dismissed'}`, 
      severity: 'success' 
    });
  };

  const tabs = [
    { label: 'Overview', icon: <MonitorIcon /> },
    { label: 'System Status', icon: <CheckCircleIcon /> },
    { label: 'Alerts', icon: <WarningIcon /> },
    { label: 'Performance', icon: <SpeedIcon /> },
    { label: 'Logs', icon: <BugReportIcon /> },
    { label: 'Notifications', icon: <NotificationsIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> }
  ];

  if (loading && Object.keys(systemStatus).length === 0) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Monitoring Dashboard - Kent Traders Admin Dashboard</title>
        <meta name="description" content="System monitoring and alerts" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Monitoring Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time system monitoring and alerts
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* System Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{systemStatus.uptime}</Typography>
                    <Typography variant="body2" color="text.secondary">System Uptime</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <SpeedIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{performance.responseTime?.current}ms</Typography>
                    <Typography variant="body2" color="text.secondary">Response Time</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WarningIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">
                      {alerts.filter(a => !a.resolved).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Active Alerts</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <StorageIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{performance.disk?.current}%</Typography>
                    <Typography variant="body2" color="text.secondary">Disk Usage</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} icon={tab.icon} />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* System Status */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Status
                  </Typography>
                  <List>
                    {systemStatus.services?.map((service, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getStatusIcon(service.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={service.name}
                          secondary={`Response: ${service.response} • Uptime: ${service.uptime}`}
                        />
                        <Chip
                          label={service.status}
                          color={getStatusColor(service.status)}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Alerts */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Alerts
                  </Typography>
                  <List>
                    {alerts.slice(0, 5).map((alert) => (
                      <ListItem key={alert.id}>
                        <ListItemIcon>
                          {getStatusIcon(alert.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={alert.title}
                          secondary={alert.message}
                        />
                        <Chip
                          label={alert.severity}
                          color={getSeverityColor(alert.severity)}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Services Status
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Response Time</TableCell>
                      <TableCell>Uptime</TableCell>
                      <TableCell>Last Check</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {systemStatus.services?.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={service.status}
                            color={getStatusColor(service.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{service.response}</TableCell>
                        <TableCell>{service.uptime}</TableCell>
                        <TableCell>
                          {new Date(systemStatus.lastCheck).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            <RefreshIcon />
                          </IconButton>
                          <IconButton>
                            <SettingsIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">System Alerts</Typography>
                <Button
                  variant="contained"
                  startIcon={<WarningIcon />}
                  onClick={() => setAlertDialog(true)}
                >
                  Create Alert
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getStatusIcon(alert.type)}
                            <Typography sx={{ ml: 1 }} variant="body2">
                              {alert.type}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{alert.title}</TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>
                          <Chip
                            label={alert.severity}
                            color={getSeverityColor(alert.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(alert.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={alert.resolved ? 'Resolved' : 'Active'}
                            color={alert.resolved ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {!alert.resolved && (
                            <IconButton onClick={() => handleAlertAction(alert.id, 'resolve')}>
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                          <IconButton onClick={() => handleAlertAction(alert.id, 'dismiss')}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            {/* Performance Metrics */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="CPU Usage"
                        secondary={`${performance.cpu?.current}%`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={performance.cpu?.current}
                        sx={{ width: 100 }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Memory Usage"
                        secondary={`${performance.memory?.current}%`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={performance.memory?.current}
                        sx={{ width: 100 }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Disk Usage"
                        secondary={`${performance.disk?.current}%`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={performance.disk?.current}
                        sx={{ width: 100 }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Network Usage"
                        secondary={`${performance.network?.current}%`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={performance.network?.current}
                        sx={{ width: 100 }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Trends
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Performance chart placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 4 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Logs
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Level</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Chip
                            label={log.level}
                            color={getSeverityColor(log.level)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{log.service}</TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 5 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Notifications
              </Typography>
              <List>
                {notifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <ListItemIcon>
                      {notification.type === 'system' ? <UpdateIcon /> : <SecurityIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={notification.message}
                    />
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                        {new Date(notification.timestamp).toLocaleString()}
                      </Typography>
                      {!notification.read && (
                        <Badge badgeContent={1} color="primary">
                          <NotificationsIcon />
                        </Badge>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {activeTab === 6 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monitoring Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Alert Settings
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email notifications"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="SMS notifications"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Slack notifications"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Monitoring Settings
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-refresh data"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Performance monitoring"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Detailed logging"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Alert Dialog */}
      <Dialog open={alertDialog} onClose={() => setAlertDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Alert</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Alert Type</InputLabel>
                <Select label="Alert Type">
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Alert Title" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Alert Message" multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select label="Severity">
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Alert</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Layout>
  );
}