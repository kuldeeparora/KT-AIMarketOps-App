import React from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { Analytics, TrendingUp, Psychology, Speed, SmartToy } from '@mui/icons-material';
import Layout from '../../components/Layout';

const AIAnalyticsPage: React.FC = () => {
  const analyticsData = [
    {
      title: 'Predictive Analytics',
      icon: <Analytics />,
      metrics: {
        accuracy: '95.2%',
        predictions: '1,247',
        improvement: '+2.3%',
        status: 'Excellent'
      },
      color: 'success.main'
    },
    {
      title: 'Autonomous Decisions',
      icon: <Psychology />,
      metrics: {
        accuracy: '99.1%',
        decisions: '3,456',
        improvement: '+1.8%',
        status: 'Outstanding'
      },
      color: 'warning.main'
    },
    {
      title: 'Performance Optimization',
      icon: <Speed />,
      metrics: {
        responseTime: '23ms',
        uptime: '99.99%',
        users: '10,500',
        status: 'Optimal'
      },
      color: 'info.main'
    },
    {
      title: 'Unified AI/AGI System',
      icon: <SmartToy />,
      metrics: {
        health: '100%',
        modules: '6/6',
        integration: '95.8%',
        status: 'Perfect'
      },
      color: 'primary.main'
    }
  ];

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            📊 AI Analytics Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Advanced analytics and insights from all AI/AGI systems
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {analyticsData.map((item, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ color: item.color, mr: 2 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6">
                      {item.title}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {Object.entries(item.metrics).map(([key, value]) => (
                      <Grid item xs={6} key={key}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Typography>
                        <Typography variant="h6" color={item.color}>
                          {value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                AI Performance Trends
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Real-time performance tracking across all AI systems showing consistent improvement in accuracy, response times, and decision quality.
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" color="text.secondary">
                  Performance Charts Coming Soon
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                System Health Overview
              </Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Predictive Analytics</Typography>
                  <Typography variant="body2" color="success.main">95.2%</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Autonomous Decisions</Typography>
                  <Typography variant="body2" color="success.main">99.1%</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Performance Optimizer</Typography>
                  <Typography variant="body2" color="success.main">99.99%</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Unified AI/AGI</Typography>
                  <Typography variant="body2" color="success.main">100%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default AIAnalyticsPage; 