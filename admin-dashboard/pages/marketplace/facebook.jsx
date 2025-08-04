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
  Facebook as FacebookIcon,
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

export default function FacebookMarketplace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facebookData, setFacebookData] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchFacebookData();
  }, []);

  const fetchFacebookData = async () => {
    setLoading(true);
    try {
      // Mock Facebook data
      const mockFacebookData = {
        status: 'inactive',
        lastSync: '2024-01-14T16:45:00Z',
        totalProducts: 67,
        activeListings: 45,
        pendingListings: 22,
        totalOrders: 23,
        revenue: 8900,
        performance: {
          views: 3400,
          clicks: 234,
          conversions: 23,
          conversionRate: 9.8
        }
      };

      const mockProducts = [
        {
          id: 1,
          title: 'Local Handmade Crafts',
          itemId: 'FB-001',
          status: 'active',
          price: 25.99,
          stock: 8,
          performance: {
            views: 234,
            clicks: 18,
            conversions: 3,
            revenue: 77.97
          }
        },
        {
          id: 2,
          title: 'Vintage Furniture Piece',
          itemId: 'FB-002',
          status: 'active',
          price: 150.00,
          stock: 1,
          performance: {
            views: 156,
            clicks: 12,
            conversions: 1,
            revenue: 150.00
          }
        }
      ];

      const mockOrders = [
        {
          id: 'FB-001',
          customer: 'Local Buyer',
          products: ['Local Handmade Crafts'],
          total: 25.99,
          status: 'completed',
          date: '2024-01-14T15:30:00Z'
        },
        {
          id: 'FB-002',
          customer: 'Furniture Collector',
          products: ['Vintage Furniture Piece'],
          total: 150.00,
          status: 'pending',
          date: '2024-01-14T16:15:00Z'
        }
      ];

      const mockSettings = {
        autoSync: false,
        priceSync: true,
        inventorySync: false,
        orderSync: true,
        reviewSync: true,
        fulfillmentType: 'Local Pickup',
        shippingTemplate: 'Facebook Local'
      };

      setFacebookData(mockFacebookData);
      setProducts(mockProducts);
      setOrders(mockOrders);
      setSettings(mockSettings);
    } catch (err) {
      setError('Failed to load Facebook data');
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
        <title>Facebook Marketplace - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Facebook marketplace integration" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <FacebookIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              Facebook Marketplace
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage your Facebook marketplace listings and local sales
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
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Connection Inactive</Typography>
              </Box>
              <Box display="flex" gap={2}>
                <Button variant="outlined" startIcon={<SyncIcon />}>
                  Connect
                </Button>
                <Button variant="outlined" startIcon={<SettingsIcon />}>
                  Settings
                </Button>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Last synced: {new Date(facebookData.lastSync).toLocaleString()}
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
                    <Typography variant="h6">{facebookData.totalProducts}</Typography>
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
                    <Typography variant="h6">{facebookData.totalOrders}</Typography>
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
                    <Typography variant="h6">£{facebookData.revenue?.toLocaleString()}</Typography>
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
                    <Typography variant="h6">{facebookData.performance?.conversionRate}%</Typography>
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
                  <Typography variant="h6">Facebook Products</Typography>
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
                              color={order.status === 'completed' ? 'success' : 'warning'}
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
                    {facebookData.performance?.views?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Views
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {facebookData.performance?.clicks?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Clicks
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {facebookData.performance?.conversions?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversions
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {facebookData.performance?.conversionRate}%
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