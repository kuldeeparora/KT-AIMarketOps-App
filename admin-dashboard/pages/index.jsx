import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  PendingActions as PendingActionsIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

// Dashboard Stats Component
const DashboardStats = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="h6">Dashboard Error</Typography>
        <Typography variant="body2">
          {error === 'authorization_error' 
            ? 'Unable to fetch data from SellerDynamics. Please check your API credentials and permissions.'
            : 'Failed to load dashboard data. Please try again later.'
          }
        </Typography>
        <Button 
          variant="contained" 
          size="small" 
          sx={{ mt: 1 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount || 0);
  };

  return (
    <Grid container spacing={3}>
      {/* Total Sales */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ 
          p: 3, 
          height: '100%',
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  width: 48, 
                  height: 48 
                }}
              >
                <TrendingUpIcon />
              </IconButton>
              <Chip
                label="Mock Data"
                color="warning"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: '18px' }}
              />
            </Box>
          </Box>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {formatCurrency(stats?.totalSales || 0)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Sales
          </Typography>
        </Paper>
      </Grid>

      {/* Total Orders */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ 
          p: 3, 
          height: '100%',
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                sx={{ 
                  bgcolor: 'secondary.main', 
                  color: 'white', 
                  width: 48, 
                  height: 48 
                }}
              >
                <ShoppingCartIcon />
              </IconButton>
              <Chip
                label="Mock Data"
                color="warning"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: '18px' }}
              />
            </Box>
          </Box>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {stats?.totalOrders || 0}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Orders
          </Typography>
        </Paper>
      </Grid>

      {/* Inventory Items */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ 
          p: 3, 
          height: '100%',
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                sx={{ 
                  bgcolor: 'success.main', 
                  color: 'white', 
                  width: 48, 
                  height: 48 
                }}
              >
                <InventoryIcon />
              </IconButton>
              <Chip
                label="Live Data"
                color="success"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: '18px' }}
              />
            </Box>
          </Box>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {stats?.inventoryItems || 0}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Inventory Items
          </Typography>
        </Paper>
      </Grid>

      {/* Pending Orders */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ 
          p: 3, 
          height: '100%',
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                sx={{ 
                  bgcolor: 'warning.main', 
                  color: 'white', 
                  width: 48, 
                  height: 48 
                }}
              >
                <PendingActionsIcon />
              </IconButton>
              <Chip
                label="Mock Data"
                color="warning"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: '18px' }}
              />
            </Box>
          </Box>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {stats?.pendingOrders || 0}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Pending Orders
          </Typography>
        </Paper>
      </Grid>

      {/* Sales Overview */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ 
          p: 3, 
          height: '100%',
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }}>
          <Typography variant="h6" gutterBottom>
            Sales Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Average Order Value
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(stats?.averageOrderValue || 0)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Completed Orders
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {stats?.completedOrders || 0}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Inventory Value
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(stats?.inventoryValue || 0)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Active Marketplaces
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {stats?.activeMarketplaces || 0}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Settlement Overview */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ 
          p: 3, 
          height: '100%',
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }}>
          <Typography variant="h6" gutterBottom>
            Settlement Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Total Settlement
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(stats?.totalSettlement || 0)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Pending Settlement
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(stats?.pendingSettlement || 0)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Settled Amount
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(stats?.settledAmount || 0)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Total Marketplaces
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {stats?.totalMarketplaces || 0}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we're in a static environment (Firebase hosting)
      const isStaticEnvironment = typeof window !== 'undefined' && 
        (window.location.hostname.includes('web.app') || 
         window.location.hostname.includes('firebaseapp.com') ||
         process.env.NODE_ENV === 'production');
      
      let result;
      
      if (isStaticEnvironment) {
        // Use static mock data for Firebase hosting
        console.log('Using static mock data for Firebase hosting');
        result = {
          success: true,
          data: {
            totalProducts: 8,
            totalStock: 0,
            totalOrders: 3,
            totalRevenue: "461.24",
            averageOrderValue: "153.75",
            inventoryValue: "10457.31",
            completedOrders: 2,
            pendingOrders: 0,
            activeMarketplaces: 2,
            totalSettlement: "438.18",
            pendingSettlement: "23.06",
            settledAmount: "415.12",
            totalMarketplaces: 2,
            lowStockItems: 3,
            outOfStockItems: 3,
            ordersToday: 0,
            dataSource: "mock"
          },
          meta: {
            lastUpdated: new Date().toISOString(),
            dataSource: "mock",
            note: "Static deployment - using mock data"
          }
        };
      } else {
        // Use API for development
        const response = await fetch('/api/dashboard-stats');
        result = await response.json();
      }
      
      console.log('Dashboard API Response:', result);
      
      if (result.error) {
        setError(result.error);
        setStats(null);
      } else {
        // Parse totalRevenue string to number (remove commas and convert)
        const parseRevenue = (revenueStr) => {
          if (typeof revenueStr === 'string') {
            return parseFloat(revenueStr.replace(/,/g, '')) || 0;
          }
          return parseFloat(revenueStr) || 0;
        };

        // Map the API data to the expected format
        const mappedStats = {
          totalSales: parseRevenue(result.data?.totalRevenue),
          totalOrders: parseInt(result.data?.totalOrders) || 0,
          inventoryItems: parseInt(result.data?.totalProducts) || 0,
          pendingOrders: parseInt(result.data?.pendingOrders) || 0,
          averageOrderValue: parseRevenue(result.data?.averageOrderValue),
          completedOrders: parseInt(result.data?.completedOrders) || 0,
          inventoryValue: parseRevenue(result.data?.inventoryValue),
          activeMarketplaces: parseInt(result.data?.activeMarketplaces) || 0,
          totalSettlement: parseRevenue(result.data?.totalSettlement),
          pendingSettlement: parseRevenue(result.data?.pendingSettlement),
          settledAmount: parseRevenue(result.data?.settledAmount),
          totalMarketplaces: parseInt(result.data?.totalMarketplaces) || 0,
          dataSource: result.data?.dataSource || 'unknown',
          recordsProcessed: parseInt(result.data?.totalStock) || 0,
          apiStatus: result.data?.dataSource === 'real' ? 'Connected' : 'Error'
        };
        setStats(mappedStats);
        setError(null);
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboardStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <Head>
        <title>AIMarketOps Admin Dashboard</title>
        <meta name="description" content="AIMarketOps Admin Dashboard - Comprehensive e-commerce management" />
      </Head>
      
      <Container maxWidth="xl" sx={{ 
        py: 4, 
        backgroundColor: 'background.default',
        color: 'text.primary'
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Dashboard Overview
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Comprehensive e-commerce management and analytics
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              {/* Data Source Indicator */}
              {stats && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    icon={stats.dataSource === 'real' ? <CheckCircleIcon /> : <WarningIcon />}
                    label={stats.dataSource === 'real' ? 'Live Data' : 'Mock Data'}
                    color={stats.dataSource === 'real' ? 'success' : 'warning'}
                    size="small"
                    variant="outlined"
                  />
                  {stats.dataSource === 'real' && (
                    <Chip
                      label={`${stats.inventoryItems || 0} Products`}
                      color="primary"
                      size="small"
                      variant="filled"
                    />
                  )}
                </Box>
              )}
              {lastUpdated && (
                <Typography variant="body2" color="textSecondary">
                  Last updated: {lastUpdated}
                </Typography>
              )}
              <IconButton 
                onClick={fetchDashboardStats}
                disabled={loading}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* Data Source Status Banner */}
          {stats && (
            <Alert 
              severity={stats.dataSource === 'real' ? 'success' : 'warning'}
              icon={stats.dataSource === 'real' ? <CheckCircleIcon /> : <WarningIcon />}
              sx={{ mb: 3 }}
            >
              <Box display="flex" alignItems="center" justifyContent="between" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.dataSource === 'real' ? '🟢 Live Data Active' : '🟡 Mock Data Mode'}
                  </Typography>
                  <Typography variant="body2">
                    {stats.dataSource === 'real' 
                      ? `Connected to SellerDynamics API • ${stats.inventoryItems} products • Live inventory, mock sales data`
                      : 'Using simulated data for demonstration • Contact support for API access'
                    }
                  </Typography>
                </Box>
                {stats.dataSource === 'real' && (
                  <Box display="flex" gap={1}>
                    <Chip label="Live Inventory" color="success" size="small" />
                    <Chip label="Mock Sales Data" color="warning" size="small" />
                  </Box>
                )}
              </Box>
            </Alert>
          )}
        </Box>

        {/* Status Indicators */}
        <Box display="flex" gap={1} flexWrap="wrap">
            <Chip 
              icon={loading ? <LinearProgress /> : error ? <ErrorIcon /> : <CheckCircleIcon />}
              label={loading ? 'Loading...' : error ? 'Error' : 'Connected'}
              color={loading ? 'default' : error ? 'error' : 'success'}
              size="small"
            />
            <Chip 
              icon={<WarningIcon />}
              label="SellerDynamics API"
              color="warning"
              size="small"
            />
          </Box>

        {/* Dashboard Content */}
        <DashboardStats 
          stats={stats} 
          loading={loading} 
          error={error} 
        />

        {/* Additional Info */}
        {!loading && !error && stats && (
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ 
              p: 3,
              backgroundColor: 'background.paper',
              color: 'text.primary'
            }}>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Data Source: {stats.dataSource || 'SellerDynamics API'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Last Sync: {lastUpdated || 'Unknown'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    API Status: {stats.apiStatus || 'Connected'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Records Processed: {stats.recordsProcessed || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </Container>
    </Layout>
  );
}
