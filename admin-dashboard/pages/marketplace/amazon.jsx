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
  LinearProgress
} from '@mui/material';
import {
  Store as AmazonIcon,
  Sync as SyncIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

export default function AmazonIntegration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amazonData, setAmazonData] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchAmazonData();
  }, []);

  const fetchAmazonData = async () => {
    setLoading(true);
    try {
      // Mock Amazon data
      const mockAmazonData = {
        status: 'connected',
        lastSync: '2024-01-15T10:30:00Z',
        totalProducts: 156,
        activeListings: 142,
        pendingListings: 14,
        totalOrders: 89,
        revenue: 23450,
        performance: {
          views: 12500,
          clicks: 890,
          conversions: 156,
          conversionRate: 17.5
        }
      };

      const mockProducts = [
        {
          id: 1,
          title: 'Premium Widget Pro',
          asin: 'B08N5WRWNW',
          status: 'active',
          price: 29.99,
          stock: 45,
          performance: {
            views: 1250,
            clicks: 89,
            conversions: 12,
            revenue: 359.88
          }
        },
        {
          id: 2,
          title: 'Smart Gadget Plus',
          asin: 'B08N5WRWNW',
          status: 'active',
          price: 49.99,
          stock: 23,
          performance: {
            views: 890,
            clicks: 67,
            conversions: 8,
            revenue: 399.92
          }
        }
      ];

      const mockOrders = [
        {
          id: 'AMZ-001',
          customer: 'John Doe',
          products: ['Premium Widget Pro'],
          total: 29.99,
          status: 'shipped',
          date: '2024-01-15T08:30:00Z'
        },
        {
          id: 'AMZ-002',
          customer: 'Jane Smith',
          products: ['Smart Gadget Plus'],
          total: 49.99,
          status: 'processing',
          date: '2024-01-15T09:15:00Z'
        }
      ];

      const mockSettings = {
        autoSync: true,
        priceSync: true,
        inventorySync: true,
        orderSync: true,
        reviewSync: true,
        fulfillmentType: 'FBA',
        shippingTemplate: 'Standard'
      };

      setAmazonData(mockAmazonData);
      setProducts(mockProducts);
      setOrders(mockOrders);
      setSettings(mockSettings);
    } catch (err) {
      setError('Failed to load Amazon data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
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
        <title>Amazon Integration - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Amazon marketplace integration" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <AmazonIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              Amazon Integration
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage your Amazon marketplace listings, orders, and performance
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Connection Status */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Connected to Amazon</Typography>
              </Box>
              <Box display="flex" gap={2}>
                <Button variant="outlined" startIcon={<SyncIcon />}>
                  Sync Now
                </Button>
                <Button variant="outlined" startIcon={<SettingsIcon />}>
                  Settings
                </Button>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Last synced: {new Date(amazonData.lastSync).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <InventoryIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{amazonData.totalProducts}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Products</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ShoppingCartIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{amazonData.totalOrders}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">£{amazonData.revenue?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Revenue</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AssessmentIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{amazonData.performance?.conversionRate}%</Typography>
                    <Typography variant="body2" color="text.secondary">Conversion Rate</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Products and Orders */}
        <Grid container spacing={3}>
          {/* Products */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">Amazon Products</Typography>
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Add Product
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>ASIN</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.title}</TableCell>
                          <TableCell>{product.asin}</TableCell>
                          <TableCell>
                            <Chip
                              label={product.status}
                              color={getStatusColor(product.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>£{product.price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <IconButton>
                              <EditIcon />
                            </IconButton>
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
          </Grid>

          {/* Orders */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Orders
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>£{order.total}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={order.status === 'shipped' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(order.date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Metrics */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {amazonData.performance?.views?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Views
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {amazonData.performance?.clicks?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Clicks
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {amazonData.performance?.conversions?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversions
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {amazonData.performance?.conversionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
} 