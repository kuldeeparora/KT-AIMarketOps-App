import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';
import { SmartToy, Analytics, Psychology, TrendingUp } from '@mui/icons-material';
import Layout from '../components/Layout';
import AIAdminDashboard from '../components/ai/AIAdminDashboard';

const AIDashboardPage: React.FC = () => {
  const router = useRouter();
  const { system } = router.query;
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  useEffect(() => {
    if (system && typeof system === 'string') {
      setSelectedSystem(system);
    }
  }, [system]);

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            🤖 AI/AGI Systems Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Monitor and control all your AI systems in real-time
          </Typography>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <SmartToy sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Unified AI/AGI System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Central orchestration hub for all AI capabilities
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Analytics sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Predictive Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                95% accuracy demand forecasting & optimization
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Psychology sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Autonomous Decisions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                99% accuracy autonomous business decisions
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Performance Optimizer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {'<100ms response time & 99.9% uptime'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <AIAdminDashboard selectedSystem={selectedSystem} />
      </Container>
    </Layout>
  );
};

export default AIDashboardPage; 