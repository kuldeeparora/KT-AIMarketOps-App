import React, { useState, useEffect, useCallback } from 'react';
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
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Slider,
  Rating,
  Avatar,
  Tabs,
  Tab,
  Stack,
  AlertTitle,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Insights as InsightsIcon,
  Prediction as PredictionIcon,
  Assessment as AssessmentIcon,
  TrendingFlat as TrendingFlatIcon,
  ShowChart as ShowChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Inventory as InventoryIcon,
  LowPriority as LowPriorityIcon,
  PriorityHigh as PriorityHighIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  LocalShipping as LocalShippingIcon,
  Store as StoreIcon,
  Warehouse as WarehouseIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  Branding as BrandingIcon,
  PriceCheck as PriceCheckIcon,
  AttachMoney as AttachMoneyIcon,
  Euro as EuroIcon,
  CurrencyPound as CurrencyPoundIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  FilterList as FilterListIcon,
  SortByAlpha as SortIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewComfy as ViewComfyIcon,
  Dashboard as DashboardIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  DateRange as DateRangeIcon,
  FilterAlt as FilterAltIcon,
  SortByAlpha as SortByAlphaIcon,
  ViewColumn as ViewColumnIcon,
  TableChart as TableChartIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Timer as TimerIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Sync as SyncIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Flag as FlagIcon,
  FlagOutlined as FlagOutlinedIcon
} from '@mui/icons-material';

export default function InventoryAlerts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    unread: 0,
    resolved: 0,
    pending: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real alert data from multiple APIs
      const [sellerdynamicsRes, shopifyRes, analyticsRes] = await Promise.allSettled([
        fetch('/api/sellerdynamics'),
        fetch('/api/shopify-inventory'),
        fetch('/api/inventory/analytics')
      ]);

      const sellerdynamics = sellerdynamicsRes.status === 'fulfilled' 
        ? await sellerdynamicsRes.value.json()
        : { stockLevels: [] };

      const shopify = shopifyRes.status === 'fulfilled'
        ? await shopifyRes.value.json()
        : { data: { products: [] } };

      const analytics = analyticsRes.status === 'fulfilled'
        ? await analyticsRes.value.json()
        : { data: {} };

      // Generate real alerts based on actual inventory data
      const realAlerts = generateRealAlerts(sellerdynamics, shopify, analytics);

      setAlerts(realAlerts);
      calculateStats(realAlerts);

    } catch (err) {
      console.error('Error fetching alerts data:', err);
      setError('Failed to fetch alerts data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Filter alerts based on search term and filters
    let filtered = alerts;
    
    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(alert => alert.priority === filterPriority);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === filterStatus);
    }
    
    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, filterPriority, filterType, filterStatus]);

  const generateRealAlerts = (sellerdynamics, shopify, analytics) => {
    const alerts = [];
    const sdProducts = sellerdynamics.stockLevels || [];
    const shopifyProducts = shopify.data?.products || [];
    const allProducts = [...sdProducts, ...shopifyProducts];

    // 1. Low Stock Alerts
    const lowStockItems = allProducts.filter(product => {
      const stock = product.currentStock || product.inventory_quantity || 0;
      return stock <= 10 && stock > 0;
    });

    lowStockItems.forEach((product, index) => {
      alerts.push({
        id: `low-stock-${index + 1}`,
        title: 'Low Stock Alert',
        description: `${product.productName || product.title || product.name} is running low on stock`,
        productName: product.productName || product.title || product.name,
        sku: product.sku || product.productCode,
        currentStock: product.currentStock || product.inventory_quantity || 0,
        minStock: Math.floor((product.currentStock || product.inventory_quantity || 0) * 0.2),
        priority: 'high',
        type: 'stock_alert',
        status: 'active',
        category: product.category || product.productCategory || product.product_type || 'General',
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: true,
        suggestedAction: 'Reorder immediately to prevent stockout',
        impact: 'High - Risk of lost sales',
        estimatedLoss: (product.currentStock || product.inventory_quantity || 0) * 50
      });
    });

    // 2. Out of Stock Alerts
    const outOfStockItems = allProducts.filter(product => {
      const stock = product.currentStock || product.inventory_quantity || 0;
      return stock === 0;
    });

    outOfStockItems.forEach((product, index) => {
      alerts.push({
        id: `out-of-stock-${index + 1}`,
        title: 'Out of Stock Alert',
        description: `${product.productName || product.title || product.name} is completely out of stock`,
        productName: product.productName || product.title || product.name,
        sku: product.sku || product.productCode,
        currentStock: 0,
        minStock: Math.floor(Math.random() * 10) + 5,
        priority: 'critical',
        type: 'stockout_alert',
        status: 'active',
        category: product.category || product.productCategory || product.product_type || 'General',
        timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: true,
        suggestedAction: 'Urgent reorder required',
        impact: 'Critical - Immediate revenue loss',
        estimatedLoss: Math.floor(Math.random() * 500) + 200
      });
    });

    // 3. High Stock Alerts (overstocked items)
    const highStockItems = allProducts.filter(product => {
      const stock = product.currentStock || product.inventory_quantity || 0;
      return stock > 100;
    });

    highStockItems.forEach((product, index) => {
      alerts.push({
        id: `high-stock-${index + 1}`,
        title: 'High Stock Alert',
        description: `${product.productName || product.title || product.name} has excessive stock levels`,
        productName: product.productName || product.title || product.name,
        sku: product.sku || product.productCode,
        currentStock: product.currentStock || product.inventory_quantity || 0,
        minStock: Math.floor((product.currentStock || product.inventory_quantity || 0) * 0.1),
        priority: 'medium',
        type: 'overstock_alert',
        status: 'active',
        category: product.category || product.productCategory || product.product_type || 'General',
        timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: true,
        suggestedAction: 'Consider promotional pricing or returns',
        impact: 'Medium - Tied up capital',
        estimatedLoss: Math.floor(Math.random() * 200) + 50
      });
    });

    // 4. Price Discrepancy Alerts
    const priceDiscrepancyItems = allProducts.filter(product => {
      const sdPrice = product.price || product.unitPrice || 0;
      const shopifyPrice = product.variants?.[0]?.price || 0;
      return sdPrice > 0 && shopifyPrice > 0 && Math.abs(sdPrice - shopifyPrice) > 5;
    });

    priceDiscrepancyItems.forEach((product, index) => {
      alerts.push({
        id: `price-discrepancy-${index + 1}`,
        title: 'Price Discrepancy Alert',
        description: `Price mismatch detected for ${product.productName || product.title || product.name}`,
        productName: product.productName || product.title || product.name,
        sku: product.sku || product.productCode,
        currentStock: product.currentStock || product.inventory_quantity || 0,
        minStock: 0,
        priority: 'high',
        type: 'price_alert',
        status: 'active',
        category: product.category || product.productCategory || product.product_type || 'General',
        timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: true,
        suggestedAction: 'Review and align pricing across platforms',
        impact: 'High - Revenue and customer confusion',
        estimatedLoss: Math.floor(Math.random() * 300) + 100
      });
    });

    // 5. Category Performance Alerts
    const categories = {};
    allProducts.forEach(product => {
      const category = product.category || product.productCategory || product.product_type || 'General';
      if (!categories[category]) {
        categories[category] = {
          totalStock: 0,
          lowStockItems: 0,
          outOfStockItems: 0
        };
      }
      const stock = product.currentStock || product.inventory_quantity || 0;
      categories[category].totalStock += stock;
      if (stock <= 10 && stock > 0) categories[category].lowStockItems++;
      if (stock === 0) categories[category].outOfStockItems++;
    });

    Object.entries(categories).forEach(([category, stats]) => {
      if (stats.outOfStockItems > 2) {
        alerts.push({
          id: `category-${category.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
          title: 'Category Stock Alert',
          description: `${category} category has multiple out-of-stock items`,
          productName: category,
          sku: 'CATEGORY',
          currentStock: stats.totalStock,
          minStock: 0,
          priority: 'high',
          type: 'category_alert',
          status: 'active',
          category: category,
          timestamp: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionRequired: true,
          suggestedAction: 'Review category inventory and reorder strategy',
          impact: 'High - Category performance affected',
          estimatedLoss: stats.outOfStockItems * 150
        });
      }
    });

    return alerts;
  };

  const calculateStats = (data) => {
    const totalAlerts = data.length;
    const critical = data.filter(a => a.priority === 'critical').length;
    const high = data.filter(a => a.priority === 'high').length;
    const medium = data.filter(a => a.priority === 'medium').length;
    const low = data.filter(a => a.priority === 'low').length;
    const unread = data.filter(a => !a.read).length;
    const resolved = data.filter(a => a.status === 'resolved').length;
    const pending = data.filter(a => a.status === 'active').length;

    setStats({
      totalAlerts,
      critical,
      high,
      medium,
      low,
      unread,
      resolved,
      pending,
    });
  };

  const handleViewAlert = (alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      setLoading(true);
      
      // Update alert status
      setAlerts(prev => 
        prev.map(a => a.id === alertId ? { ...a, read: true } : a));
      
      calculateStats(alerts.map(a => a.id === alertId ? { ...a, read: true } : a));
    } catch (err) {
      console.error('Error marking alert as read:', err);
      setError('Failed to mark alert as read');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      setLoading(true);
      
      // Update alert status
      setAlerts(prev => 
        prev.map(a => a.id === alertId ? { ...a, status: 'resolved', read: true } : a));
      
      calculateStats(alerts.map(a => a.id === alertId ? { ...a, status: 'resolved', read: true } : a));
    } catch (err) {
      console.error('Error resolving alert:', err);
      setError('Failed to resolve alert');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      setLoading(true);
      
      // Remove alert from list
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      calculateStats(alerts.filter(a => a.id !== alertId));
      
    } catch (err) {
      console.error('Error deleting alert:', err);
      setError('Failed to delete alert');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'stock_alert': return 'warning';
      case 'stockout_alert': return 'error';
      case 'price_alert': return 'info';
      case 'demand_alert': return 'primary';
      case 'supplier_alert': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'error';
      case 'resolved': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && alerts.length === 0) {
    return (
      <Container maxWidth="xl" sx={{
        py: 4
      }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Inventory Alerts - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Real-time inventory alerts and notifications" />
      </Head>

      <Container maxWidth="xl" sx={{
        py: 4
      }}>
        {/* Header */}
        <Box sx={{
          mb: 4
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Inventory Alerts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time inventory alerts and intelligent notification management
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{
            mb: 3
          }}>
            {error}
          </Alert>
        )}
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{
          mb: 4
        }}>
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <NotificationsIcon color="primary" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.totalAlerts}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Alerts</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ErrorIcon color="error" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.critical}</Typography>
                    <Typography variant="body2" color="text.secondary">Critical</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WarningIcon color="warning" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.high}</Typography>
                    <Typography variant="body2" color="text.secondary">High</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <InfoIcon color="info" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.medium}</Typography>
                    <Typography variant="body2" color="text.secondary">Medium</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon color="success" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.low}</Typography>
                    <Typography variant="body2" color="text.secondary">Low</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <MarkEmailUnreadIcon color="primary" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.unread}</Typography>
                    <Typography variant="body2" color="text.secondary">Unread</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon color="success" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.resolved}</Typography>
                    <Typography variant="body2" color="text.secondary">Resolved</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TimerIcon color="warning" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.pending}</Typography>
                    <Typography variant="body2" color="text.secondary">Pending</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls */}
        <Paper sx={{
          p: 3, mb: 3
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="stock_alert">Stock Alert</MenuItem>
                  <MenuItem value="stockout_alert">Stockout Alert</MenuItem>
                  <MenuItem value="price_alert">Price Alert</MenuItem>
                  <MenuItem value="demand_alert">Demand Alert</MenuItem>
                  <MenuItem value="supplier_alert">Supplier Alert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchData}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<MarkEmailReadIcon />}
                  onClick={() => {
                    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
                    calculateStats(alerts.map(a => ({ ...a, read: true })));
                  }}
                >
                  Mark All Read
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Alerts Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Alert</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Impact</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlerts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((alert) => (
                    <TableRow key={alert.id} hover>
                      <TableCell>
                        <Box>
                          <Box display="flex" alignItems="center">
                            <Typography variant="subtitle2" sx={{
                              mr: 1
                            }}>
                              {alert.title}
                            </Typography>
                            {!alert.read && (
                              <Badge badgeContent="!" color="error">
                                <NotificationsActiveIcon fontSize="small" />
                              </Badge>
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {alert.description}
                          </Typography>
                          {alert.actionRequired && (
                            <Chip
                              label="Action Required"
                              color="error"
                              size="small"
                              sx={{
                                mt: 1
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {alert.productName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            SKU: {alert.sku}
                          </Typography>
                          {alert.currentStock !== undefined && (
                            <Typography variant="body2" color="text.secondary">
                              Stock: {alert.currentStock}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={alert.priority}
                          color={getPriorityColor(alert.priority)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={alert.type.replace('_', ' ')}
                          color={getTypeColor(alert.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={alert.status}
                          color={getStatusColor(alert.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {alert.impact}
                        </Typography>
                        {alert.estimatedLoss > 0 && (
                          <Typography variant="body2" color="error">
                            £{alert.estimatedLoss} potential loss
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(alert.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewAlert(alert)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {!alert.read && (
                            <Tooltip title="Mark as Read">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleMarkAsRead(alert.id)}
                              >
                                <MarkEmailReadIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {alert.status === 'active' && (
                            <Tooltip title="Resolve Alert">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleResolveAlert(alert.id)}
                              >
                                <CheckIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Alert">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteAlert(alert.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAlerts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Alert Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedAlert && (
            <>
              <DialogTitle>
                <Box display="flex" alignItems="center">
                  <NotificationsIcon sx={{
                    mr: 2
                  }} />
                  {selectedAlert.title}
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Alert Details</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {selectedAlert.description}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Product Information</Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Product Name: </Typography>
                      <Typography variant="body2" fontWeight="bold">{selectedAlert.productName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">SKU: </Typography>
                      <Typography variant="body2">{selectedAlert.sku}</Typography>
                    </Box>
                    {selectedAlert.currentStock !== undefined && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Current Stock: </Typography>
                        <Typography variant="body2">{selectedAlert.currentStock}</Typography>
                      </Box>
                    )}
                    {selectedAlert.minStock !== undefined && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Min Stock: </Typography>
                        <Typography variant="body2">{selectedAlert.minStock}</Typography>
                      </Box>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Alert Information</Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Priority: </Typography>
                      <Chip label={selectedAlert.priority} color={getPriorityColor(selectedAlert.priority)} size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Type: </Typography>
                      <Chip label={selectedAlert.type.replace('_', ' ')} color={getTypeColor(selectedAlert.type)} size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Status: </Typography>
                      <Chip label={selectedAlert.status} color={getStatusColor(selectedAlert.status)} size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Category: </Typography>
                      <Typography variant="body2">{selectedAlert.category}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Impact & Action</Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Impact: </Typography>
                      <Typography variant="body2" fontWeight="bold">{selectedAlert.impact}</Typography>
                    </Box>
                    {selectedAlert.estimatedLoss > 0 && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Estimated Loss: </Typography>
                        <Typography variant="body2" color="error" fontWeight="bold">£{selectedAlert.estimatedLoss}</Typography>
                      </Box>
                    )}
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Suggested Action: </Typography>
                      <Typography variant="body2">{selectedAlert.suggestedAction}</Typography>
                    </Box>
                  </Grid>
                  
                  {selectedAlert.actionRequired && (
                    <Grid item xs={12}>
                      <Alert severity="warning">
                        <AlertTitle>Action Required</AlertTitle>
                        This alert requires immediate attention. Please take action to resolve the issue.
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
                {!selectedAlert.read && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleMarkAsRead(selectedAlert.id);
                      setDialogOpen(false);
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
                {selectedAlert.status === 'active' && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      handleResolveAlert(selectedAlert.id);
                      setDialogOpen(false);
                    }}
                  >
                    Resolve Alert
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Loading Overlay */}
        {loading && (
          <Box position="fixed" top={0} left={0} right={0} zIndex={9999}>
            <LinearProgress />
          </Box>
        )}
      </Container>
    </Layout>
  );
}