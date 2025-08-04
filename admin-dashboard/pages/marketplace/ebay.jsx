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
  Store as EbayIcon,
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

export default function EbayIntegration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ebayData, setEbayData] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchEbayData();
  }, []);

  const fetchEbayData = async () => {
    setLoading(true);
    try {
      // Mock eBay data
      const mockEbayData = {
        status: 'connected',
        lastSync: '2024-01-15T09:15:00Z',
        totalProducts: 89,
        activeListings: 76,
        pendingListings: 13,
        totalOrders: 45,
        revenue: 15680,
        performance: {
          views: 8900,
          clicks: 567,
          conversions: 89,
          conversionRate: 15.7
        }
      };

      const mockProducts = [
        {
          id: 1,
          title: 'Vintage Collectible Item',
          itemId: '123456789',
          status: 'active',
          price: 45.99,
          stock: 12,
          performance: {
            views: 890,
            clicks: 67,
            conversions: 8,
            revenue: 367.92
          }
        },
        {
          id: 2,
          title: 'Handcrafted Artisan Piece',
          itemId: '987654321',
          status: 'active',
          price: 89.99,
          stock: 5,
          performance: {
            views: 567,
            clicks: 34,
            conversions: 5,
            revenue: 449.95
          }
        }
      ];

      const mockOrders = [
        {
          id: 'EBAY-001',
          customer: 'Mike Johnson',
          products: ['Vintage Collectible Item'],
          total: 45.99,
          status: 'shipped',
          date: '2024-01-15T10:30:00Z'
        },
        {
          id: 'EBAY-002',
          customer: 'Sarah Wilson',
          products: ['Handcrafted Artisan Piece'],
          total: 89.99,
          status: 'processing',
          date: '2024-01-15T11:15:00Z'
        }
      ];

      const mockSettings = {
        autoSync: true,
        priceSync: false,
        inventorySync: true,
        orderSync: true,
        reviewSync: true,
        fulfillmentType: 'Seller Fulfilled',
        shippingTemplate: 'eBay Standard'
      };

      setEbayData(mockEbayData);
      setProducts(mockProducts);
      setOrders(mockOrders);
      setSettings(mockSettings);
    } catch (err) {
      setError('Failed to load eBay data');
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
        <title>eBay Integration - Kent Traders Admin Dashboard</title>
        <meta name="description" content="eBay marketplace integration" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <EbayIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              eBay Integration
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage your eBay marketplace listings, orders, and performance
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
                <Typography variant="h6">Connected to eBay</Typography>
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
              Last synced: {new Date(ebayData.lastSync).toLocaleString()}
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
                    <Typography variant="h6">{ebayData.totalProducts}</Typography>
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
                    <Typography variant="h6">{ebayData.totalOrders}</Typography>
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
                    <Typography variant="h6">£{ebayData.revenue?.toLocaleString()}</Typography>
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
                    <Typography variant="h6">{ebayData.performance?.conversionRate}%</Typography>
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
                  <Typography variant="h6">eBay Products</Typography>
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Add Product
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Item ID</TableCell>
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
                          <TableCell>{product.itemId}</TableCell>
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
                    {ebayData.performance?.views?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Views
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {ebayData.performance?.clicks?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Clicks
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {ebayData.performance?.conversions?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversions
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {ebayData.performance?.conversionRate}%
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