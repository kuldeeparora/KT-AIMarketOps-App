import React from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent, Chip, LinearProgress } from '@mui/material';
import { Monitor, Warning, CheckCircle, Error, TrendingUp, Speed } from '@mui/icons-material';
import Layout from '../../components/Layout';

const AIMonitoringPage: React.FC = () => {
  const monitoringData = [
    {
      name: 'Predictive Analytics',
      status: 'operational',
      health: 95,
      responseTime: 45,
      uptime: 99.9,
      lastUpdated: '2 minutes ago',
      alerts: 0
    },
    {
      name: 'Autonomous Decision Maker',
      status: 'operational',
      health: 99,
      responseTime: 12,
      uptime: 99.95,
      lastUpdated: '1 minute ago',
      alerts: 0
    },
    {
      name: 'Real-time Personalization',
      status: 'operational',
      health: 92,
      responseTime: 38,
      uptime: 99.8,
      lastUpdated: '3 minutes ago',
      alerts: 1
    },
    {
      name: 'Multi-modal AI',
      status: 'operational',
      health: 88,
      responseTime: 156,
      uptime: 99.7,
      lastUpdated: '5 minutes ago',
      alerts: 2
    },
    {
      name: 'Performance Optimizer',
      status: 'operational',
      health: 98,
      responseTime: 23,
      uptime: 99.99,
      lastUpdated: '30 seconds ago',
      alerts: 0
    },
    {
      name: 'Unified AI/AGI System',
      status: 'operational',
      health: 100,
      responseTime: 67,
      uptime: 99.95,
      lastUpdated: '1 minute ago',
      alerts: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <Error />;
      default: return <Error />;
    }
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            📊 AI System Monitoring
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Real-time monitoring of all AI/AGI systems, consciousness tracking, and performance metrics
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {monitoringData.map((system, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6">
                      {system.name}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(system.status)}
                      label={system.status}
                      color={getStatusColor(system.status) as any}
                      size="small"
                    />
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      System Health
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={system.health}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                      color={system.health > 90 ? 'success' : system.health > 70 ? 'warning' : 'error'}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {system.health}% healthy
                    </Typography>
                  </Box>

                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Response Time
                      </Typography>
                      <Typography variant="body2">
                        {system.responseTime}ms
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Uptime
                      </Typography>
                      <Typography variant="body2">
                        {system.uptime}%
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Updated: {system.lastUpdated}
                    </Typography>
                    {system.alerts > 0 && (
                      <Chip
                        label={`${system.alerts} alert${system.alerts > 1 ? 's' : ''}`}
                        color="warning"
                        size="small"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                System Performance Overview
              </Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Average Response Time</Typography>
                  <Typography variant="h6" color="primary">
                    {Math.round(monitoringData.reduce((sum, s) => sum + s.responseTime, 0) / monitoringData.length)}ms
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Overall Uptime</Typography>
                  <Typography variant="h6" color="success.main">
                    {Math.min(...monitoringData.map(s => s.uptime)).toFixed(2)}%
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Systems Operational</Typography>
                  <Typography variant="h6" color="info.main">
                    {monitoringData.filter(s => s.status === 'operational').length}/{monitoringData.length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Total Alerts</Typography>
                  <Typography variant="h6" color="warning.main">
                    {monitoringData.reduce((sum, s) => sum + s.alerts, 0)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Recent Alerts
              </Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2} sx={{ bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2">Multi-modal AI</Typography>
                  <Typography variant="caption" color="warning.dark">High response time</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2} sx={{ bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2">Real-time Personalization</Typography>
                  <Typography variant="caption" color="warning.dark">Accuracy below threshold</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2} sx={{ bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2">Multi-modal AI</Typography>
                  <Typography variant="caption" color="warning.dark">Image processing delay</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default AIMonitoringPage; 