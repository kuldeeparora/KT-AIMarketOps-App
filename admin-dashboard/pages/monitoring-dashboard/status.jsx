import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Monitor as MonitorIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

export default function SystemStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState({});
  const [services, setServices] = useState([]);
  const [performance, setPerformance] = useState({});

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    setLoading(true);
    try {
      // Mock system status data
      const mockSystemStatus = {
        overall: 'healthy',
        uptime: '99.8%',
        lastCheck: new Date().toISOString(),
        totalServices: 8,
        healthyServices: 7,
        warningServices: 1,
        errorServices: 0
      };

      const mockServices = [
        {
          name: 'Web Server',
          status: 'healthy',
          response: '200ms',
          uptime: '99.9%',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://api.kenttraders.com/health'
        },
        {
          name: 'Database',
          status: 'healthy',
          response: '45ms',
          uptime: '99.7%',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://db.kenttraders.com/health'
        },
        {
          name: 'Payment Gateway',
          status: 'warning',
          response: '850ms',
          uptime: '98.5%',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://payments.kenttraders.com/health'
        },
        {
          name: 'Email Service',
          status: 'healthy',
          response: '120ms',
          uptime: '99.2%',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://email.kenttraders.com/health'
        },
        {
          name: 'File Storage',
          status: 'healthy',
          response: '75ms',
          uptime: '99.8%',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://storage.kenttraders.com/health'
        },
        {
          name: 'CDN',
          status: 'healthy',
          response: '25ms',
          uptime: '99.9%',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://cdn.kenttraders.com/health'
        },
        {
          name: 'Cache Service',
          status: 'healthy',
          response: '15ms',
          uptime: '99.6%',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://cache.kenttraders.com/health'
        },
        {
          name: 'Analytics Service',
          status: 'healthy',
          response: '180ms',
          uptime: '99.4%',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://analytics.kenttraders.com/health'
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

      setSystemStatus(mockSystemStatus);
      setServices(mockServices);
      setPerformance(mockPerformance);
    } catch (err) {
      setError('Failed to load system status');
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
      default: return <WarningIcon color="warning" />;
    }
  };

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
        <title>System Status - Kent Traders Admin Dashboard</title>
        <meta name="description" content="System health monitoring" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h4" component="h1">
                System Status
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor system health and service status
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchSystemStatus}
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

        {/* Overall Status */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h5">System Healthy</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall uptime: {systemStatus.uptime}
                  </Typography>
                </Box>
              </Box>
              <Box textAlign="right">
                <Typography variant="h6" color="success.main">
                  {systemStatus.healthyServices}/{systemStatus.totalServices} Services Healthy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last checked: {new Date(systemStatus.lastCheck).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Service Status Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{systemStatus.healthyServices}</Typography>
                    <Typography variant="body2" color="text.secondary">Healthy Services</Typography>
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
                    <Typography variant="h6">{systemStatus.warningServices}</Typography>
                    <Typography variant="body2" color="text.secondary">Warning Services</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ErrorIcon color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{systemStatus.errorServices}</Typography>
                    <Typography variant="body2" color="text.secondary">Error Services</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <SpeedIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{performance.responseTime?.current}ms</Typography>
                    <Typography variant="body2" color="text.secondary">Avg Response Time</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* System Services Status */}
        <Card sx={{ mb: 4 }}>
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
                    <TableCell>Endpoint</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getStatusIcon(service.status)}
                          <Typography sx={{ ml: 1 }}>{service.name}</Typography>
                        </Box>
                      </TableCell>
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
                        {new Date(service.lastCheck).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {service.endpoint}
                        </Typography>
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

        {/* Performance Metrics */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Performance
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <SpeedIcon />
                    </ListItemIcon>
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
                    <ListItemIcon>
                      <MemoryIcon />
                    </ListItemIcon>
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
                    <ListItemIcon>
                      <StorageIcon />
                    </ListItemIcon>
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
                    <ListItemIcon>
                      <NetworkIcon />
                    </ListItemIcon>
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

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Metrics
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Performance chart placeholder</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
} 