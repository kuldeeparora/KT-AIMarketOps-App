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
  Tooltip
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Sync as SyncIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Store as AmazonIcon,
  Store as EbayIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Google as GoogleIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marketplaces, setMarketplaces] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [syncDialog, setSyncDialog] = useState(false);
  const [addMarketplaceDialog, setAddMarketplaceDialog] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState(null);

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const fetchMarketplaceData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockMarketplaces = [
        {
          id: 1,
          name: 'Amazon',
          type: 'amazon',
          status: 'active',
          products: 245,
          orders: 156,
          revenue: 45230,
          syncStatus: 'synced',
          lastSync: '2024-01-15T10:30:00Z',
          settings: {
            autoSync: true,
            priceSync: true,
            inventorySync: true
          }
        },
        {
          id: 2,
          name: 'eBay',
          type: 'ebay',
          status: 'active',
          products: 189,
          orders: 89,
          revenue: 23450,
          syncStatus: 'syncing',
          lastSync: '2024-01-15T09:15:00Z',
          settings: {
            autoSync: true,
            priceSync: false,
            inventorySync: true
          }
        },
        {
          id: 3,
          name: 'Facebook Marketplace',
          type: 'facebook',
          status: 'inactive',
          products: 67,
          orders: 23,
          revenue: 8900,
          syncStatus: 'error',
          lastSync: '2024-01-14T16:45:00Z',
          settings: {
            autoSync: false,
            priceSync: true,
            inventorySync: false
          }
        }
      ];

      const mockProducts = [
        {
          id: 1,
          name: 'Premium Widget Pro',
          sku: 'WID-001',
          marketplaces: ['Amazon', 'eBay'],
          price: 29.99,
          stock: 45,
          status: 'active',
          performance: {
            views: 1250,
            clicks: 89,
            conversions: 12,
            revenue: 359.88
          }
        },
        {
          id: 2,
          name: 'Smart Gadget Plus',
          sku: 'GAD-002',
          marketplaces: ['Amazon'],
          price: 49.99,
          stock: 23,
          status: 'active',
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
          marketplace: 'Amazon',
          customer: 'John Doe',
          products: ['Premium Widget Pro'],
          total: 29.99,
          status: 'shipped',
          date: '2024-01-15T08:30:00Z'
        },
        {
          id: 'EBAY-002',
          marketplace: 'eBay',
          customer: 'Jane Smith',
          products: ['Smart Gadget Plus'],
          total: 49.99,
          status: 'processing',
          date: '2024-01-15T09:15:00Z'
        }
      ];

      const mockAnalytics = {
        totalRevenue: 77580,
        totalOrders: 268,
        totalProducts: 501,
        growthRate: 15.3,
        topMarketplace: 'Amazon',
        monthlyData: [
          { month: 'Jan', revenue: 45230, orders: 156 },
          { month: 'Feb', revenue: 23450, orders: 89 },
          { month: 'Mar', revenue: 8900, orders: 23 }
        ]
      };

      setMarketplaces(mockMarketplaces);
      setProducts(mockProducts);
      setOrders(mockOrders);
      setAnalytics(mockAnalytics);
    } catch (err) {
      setError('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (marketplaceId) => {
    setSyncDialog(true);
    setLoading(true);
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update marketplace sync status
      setMarketplaces(prev => prev.map(mp => 
        mp.id === marketplaceId 
          ? { ...mp, syncStatus: 'synced', lastSync: new Date().toISOString() }
          : mp
      ));
      
      setSyncDialog(false);
    } catch (err) {
      setError('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'syncing': return 'warning';
      default: return 'default';
    }
  };

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'synced': return <CheckCircleIcon color="success" />;
      case 'syncing': return <CircularProgress size={20} />;
      case 'error': return <WarningIcon color="error" />;
      default: return <WarningIcon color="warning" />;
    }
  };

  const getMarketplaceIcon = (type) => {
    switch (type) {
      case 'amazon': return <AmazonIcon />;
      case 'ebay': return <EbayIcon />;
      case 'facebook': return <FacebookIcon />;
      case 'instagram': return <InstagramIcon />;
      case 'google': return <GoogleIcon />;
      default: return <StoreIcon />;
    }
  };

  const tabs = [
    { label: 'Overview', icon: <AssessmentIcon /> },
    { label: 'Marketplaces', icon: <StoreIcon /> },
    { label: 'Products', icon: <InventoryIcon /> },
    { label: 'Orders', icon: <ShoppingCartIcon /> },
    { label: 'Analytics', icon: <AnalyticsIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> }
  ];

  if (loading && marketplaces.length === 0) {
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
        <title>Marketplace - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Multi-platform marketplace management" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Marketplace Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your products across multiple marketplaces
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">£{analytics.totalRevenue?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ShoppingCartIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{analytics.totalOrders}</Typography>
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
                  <InventoryIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{analytics.totalProducts}</Typography>
                    <Typography variant="body2" color="text.secondary">Active Products</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <StoreIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{marketplaces.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Connected Platforms</Typography>
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
            {/* Marketplaces Overview */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Connected Marketplaces
                  </Typography>
                  <List>
                    {marketplaces.map((marketplace) => (
                      <ListItem key={marketplace.id}>
                        <ListItemIcon>
                          {getMarketplaceIcon(marketplace.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={marketplace.name}
                          secondary={`${marketplace.products} products • ${marketplace.orders} orders`}
                        />
                        <Chip
                          label={marketplace.status}
                          color={getStatusColor(marketplace.status)}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Orders */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Orders
                  </Typography>
                  <List>
                    {orders.slice(0, 5).map((order) => (
                      <ListItem key={order.id}>
                        <ListItemText
                          primary={`${order.marketplace} - ${order.id}`}
                          secondary={`${order.customer} • £${order.total}`}
                        />
                        <Chip
                          label={order.status}
                          color={order.status === 'shipped' ? 'success' : 'warning'}
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Marketplace Connections</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddMarketplaceDialog(true)}
                >
                  Add Marketplace
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Marketplace</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Products</TableCell>
                      <TableCell>Orders</TableCell>
                      <TableCell>Revenue</TableCell>
                      <TableCell>Sync Status</TableCell>
                      <TableCell>Last Sync</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {marketplaces.map((marketplace) => (
                      <TableRow key={marketplace.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getMarketplaceIcon(marketplace.type)}
                            <Typography sx={{ ml: 1 }}>{marketplace.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={marketplace.status}
                            color={getStatusColor(marketplace.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{marketplace.products}</TableCell>
                        <TableCell>{marketplace.orders}</TableCell>
                        <TableCell>£{marketplace.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getSyncStatusIcon(marketplace.syncStatus)}
                            <Typography sx={{ ml: 1 }} variant="body2">
                              {marketplace.syncStatus}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {new Date(marketplace.lastSync).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleSync(marketplace.id)}>
                            <SyncIcon />
                          </IconButton>
                          <IconButton onClick={() => setSelectedMarketplace(marketplace)}>
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
              <Typography variant="h6" gutterBottom>
                Marketplace Products
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Marketplaces</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Performance</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>
                          {product.marketplaces.map((mp, index) => (
                            <Chip key={index} label={mp} size="small" sx={{ mr: 0.5 }} />
                          ))}
                        </TableCell>
                        <TableCell>£{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {product.performance.views} views
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.performance.conversions} sales
                          </Typography>
                        </TableCell>
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
        )}

        {activeTab === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Marketplace Orders
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Marketplace</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Products</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.marketplace}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                          {order.products.join(', ')}
                        </TableCell>
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

        {activeTab === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue by Marketplace
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Chart placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Trends
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Chart placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 5 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Marketplace Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Sync Settings
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-sync inventory"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-sync pricing"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Auto-sync orders"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Notifications
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Low stock alerts"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Order notifications"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Price change alerts"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Sync Dialog */}
      <Dialog open={syncDialog} onClose={() => setSyncDialog(false)}>
        <DialogTitle>Syncing Marketplace</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" justifyContent="center" py={3}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Syncing data...</Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Add Marketplace Dialog */}
      <Dialog open={addMarketplaceDialog} onClose={() => setAddMarketplaceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Marketplace</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Marketplace Type</InputLabel>
                <Select label="Marketplace Type">
                  <MenuItem value="amazon">Amazon</MenuItem>
                  <MenuItem value="ebay">eBay</MenuItem>
                  <MenuItem value="facebook">Facebook Marketplace</MenuItem>
                  <MenuItem value="instagram">Instagram Shopping</MenuItem>
                  <MenuItem value="google">Google Shopping</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="API Key" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Secret Key" type="password" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMarketplaceDialog(false)}>Cancel</Button>
          <Button variant="contained">Connect</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
} 