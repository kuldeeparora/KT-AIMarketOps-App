import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Chip,
  Divider,
  useTheme} from '@mui/material';
import { Inventory as InventoryIcon, ShoppingCart as OrdersIcon, Analytics as AnalyticsIcon, People as CustomersIcon, Assessment as ReportsIcon, Settings as SettingsIcon, Warning as WarningIcon, AttachMoney as MoneyIcon, Notifications as NotificationsIcon, Refresh as RefreshIcon } from '@mui/icons-material';

export default function IndexMUI() {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState({
    loading: true,
    error: null,
    stats: {
      totalProducts: 0,
      ordersToday: 0,
      revenue: 0,
      lowStock: 0
    },
    recentActivity: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch data from multiple APIs
      const [inventoryResponse, ordersResponse] = await Promise.allSettled([
        fetch('/api/shopify-inventory'),
        fetch('/api/orders')
      ]);

      const inventoryData = inventoryResponse.status === 'fulfilled' 
        ? await inventoryResponse.value.json()
        : { data: { products: [] } };

      const ordersData = ordersResponse.status === 'fulfilled'
        ? await ordersResponse.value.json()
        : { data: { orders: [] } };

      // Calculate stats
      const products = inventoryData.data?.products || [];
      const orders = ordersData.data?.orders || [];
      
      const today = new Date().toDateString();
      const ordersToday = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
      ).length;

      const totalProducts = products.length;
      const lowStock = products.filter(p => p.lowStock).length;
      const revenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice || 0), 0);

      // Generate recent activity
      const recentActivity = [
        ...orders.slice(0, 3).map(order => ({
          type: 'order',
          icon: <OrdersIcon color="primary" />,
          message: `New order #${order.orderNumber} received from ${order.customer?.firstName || 'Customer'} ${order.customer?.lastName || ''}`,
          time: new Date(order.createdAt).toLocaleTimeString()
        })),
        ...products.filter(p => p.lowStock).slice(0, 2).map(product => ({
          type: 'stock',
          icon: <WarningIcon color="warning" />,
          message: `Low stock alert for ${product.title} (${product.totalInventory} units remaining)`,
          time: new Date().toLocaleTimeString()
        }))
      ];

      setDashboardData({
        loading: false,
        error: null,
        stats: {
          totalProducts,
          ordersToday,
          revenue,
          lowStock
        },
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch dashboard data'
      }));
    }
  };

  if (dashboardData.loading) {
    return (
      <Layout>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Box textAlign="center">
            <CircularProgress size={48} color="primary" />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Loading dashboard data...
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  if (dashboardData.error) {
    return (
      <Layout>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Box textAlign="center">
            <Alert severity="error" sx={{ mb: 2 }}>
              {dashboardData.error}
            </Alert>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchDashboardData}
            >
              Retry
            </Button>
          </Box>
        </Box>
      </Layout>
    );
  }

  const quickActions = [
    {
      title: 'Inventory Management',
      description: 'Manage stock levels and product information',
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      href: '/inventory-advanced',
      color: 'primary'},
    {
      title: 'Order Management',
      description: 'View and process customer orders',
      icon: <OrdersIcon sx={{ fontSize: 40 }} />,
      href: '/orders',
      color: 'secondary'},
    {
      title: 'Analytics',
      description: 'View business insights and reports',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      href: '/analytics',
      color: 'success'},
    {
      title: 'Customer Management',
      description: 'Manage customer information and relationships',
      icon: <CustomersIcon sx={{ fontSize: 40 }} />,
      href: '/customers',
      color: 'info'},
    {
      title: 'Reports',
      description: 'Generate and view business reports',
      icon: <ReportsIcon sx={{ fontSize: 40 }} />,
      href: '/reports',
      color: 'warning'},
    {
      title: 'Settings',
      description: 'Configure system settings and preferences',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      href: '/settings',
      color: 'error'}];

  return (
    <>
      <Head>
        <title>Kent Traders Admin Dashboard</title>
        <meta name="description" content="Kent Traders Admin Dashboard - Inventory Management System" />
      </Head>
      
      <Layout>
        <Box sx={{ p: 3 }}>
          {/* Page Title */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening with your business today.
            </Typography>
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box sx={{ mr: 2 }}>
                      <InventoryIcon color="primary" sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Products
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {dashboardData.stats.totalProducts}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box sx={{ mr: 2 }}>
                      <OrdersIcon color="secondary" sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Orders Today
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {dashboardData.stats.ordersToday}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box sx={{ mr: 2 }}>
                      <MoneyIcon color="success" sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Revenue
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        £{dashboardData.stats.revenue.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box sx={{ mr: 2 }}>
                      <WarningIcon color="warning" sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Low Stock
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {dashboardData.stats.lowStock}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  component={Link}
                  href={action.href}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Box sx={{ mr: 2 }}>
                        {React.cloneElement(action.icon, { color: action.color })}
                      </Box>
                      <Box>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity */}
          <Card>
            <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" component="h2">
                Recent Activity
              </Typography>
            </Box>
            <CardContent>
              <Stack spacing={2}>
                {dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity, index) => (
                    <Box key={index} display="flex" alignItems="center" spacing={2}>
                      <Box sx={{ mr: 2 }}>
                        {activity.icon}
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body2">
                          {activity.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                      <Chip
                        label={activity.type === 'order' ? 'Order' : 'Stock'}
                        size="small"
                        color={activity.type === 'order' ? 'primary' : 'warning'}
                        variant="outlined"
                      />
                    </Box>
                  ))
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                      No recent activity
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Layout>
    </>
  );
} 