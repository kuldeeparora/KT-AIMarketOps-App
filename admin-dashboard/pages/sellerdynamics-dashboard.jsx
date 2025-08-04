import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useSellerDynamicsData } from '../hooks/useSellerDynamicsData';
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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
  Badge,
  AlertTitle,
  AlertDescription
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  ShoppingCart as CartIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  DataUsage as DataUsageIcon,
  Storage as StorageIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Sync as SyncIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

export default function SellerDynamicsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Real SellerDynamics Data
  const { 
    data: sellerDynamicsData, 
    loading: dataLoading, 
    error: dataError, 
    refreshData, 
    isRealData, 
    isMockData 
  } = useSellerDynamicsData();

  // Mock detailed data for demonstration
  const [detailedData, setDetailedData] = useState({
    stockLevels: [],
    products: [],
    orders: [],
    analytics: {
      topProducts: [],
      lowStockAlerts: [],
      recentOrders: [],
      revenueTrends: []
    }
  });

  useEffect(() => {
    // Simulate detailed data based on SellerDynamics response
    if (sellerDynamicsData) {
      setDetailedData({
        stockLevels: [
          {
            sku: 'BG-NAB12',
            productName: 'BG Electrical 1-Gang 2-Way Metal Antique Brass Light Switch',
            currentStock: 96,
            allocatedStock: 5,
            availableStock: 91,
            reorderPoint: 10,
            lastUpdated: new Date().toISOString(),
            price: 3.1,
            cost: 1.55,
            vendor: 'BG Electrical',
            category: 'Lighting Controls',
            isMasterProduct: true,
            productType: 'Master Product',
            goodId: '98781de8-591c-412d-89dd-fc43b01cdfe7'
          },
          {
            sku: 'BG-NBN12',
            productName: 'BG Nexus Metal Black Nickel Switches and Sockets Full Range',
            currentStock: 62,
            allocatedStock: 3,
            availableStock: 59,
            reorderPoint: 15,
            lastUpdated: new Date().toISOString(),
            price: 3.1,
            cost: 1.55,
            vendor: 'BG Electrical',
            category: 'Lighting Controls',
            isMasterProduct: true,
            productType: 'Master Product',
            goodId: '12345678-1234-1234-1234-123456789012'
          },
          {
            sku: 'BG-NBS12',
            productName: 'BG Brushed Steel Light Switches & Sockets Full Range',
            currentStock: 60,
            allocatedStock: 2,
            availableStock: 58,
            reorderPoint: 12,
            lastUpdated: new Date().toISOString(),
            price: 3.1,
            cost: 1.55,
            vendor: 'BG Electrical',
            category: 'Lighting Controls',
            isMasterProduct: true,
            productType: 'Master Product',
            goodId: '87654321-4321-4321-4321-210987654321'
          }
        ],
        products: [
          {
            productId: 'PROD001',
            sku: 'BG-NAB12',
            productName: 'BG Electrical 1-Gang 2-Way Metal Antique Brass Light Switch',
            description: 'High-quality antique brass light switch',
            price: 3.1,
            cost: 1.55,
            vendor: 'BG Electrical',
            category: 'Lighting Controls',
            isActive: true,
            lastUpdated: new Date().toISOString()
          },
          {
            productId: 'PROD002',
            sku: 'BG-NBN12',
            productName: 'BG Nexus Metal Black Nickel Switches and Sockets Full Range',
            description: 'Modern black nickel switches and sockets',
            price: 3.1,
            cost: 1.55,
            vendor: 'BG Electrical',
            category: 'Lighting Controls',
            isActive: true,
            lastUpdated: new Date().toISOString()
          }
        ],
        orders: [
          {
            orderId: 'ORD001',
            orderNumber: 'KT-2024-001',
            customerName: 'John Smith',
            orderDate: '2024-01-15',
            status: 'Completed',
            totalAmount: 156.75,
            items: [
              { sku: 'BG-NAB12', quantity: 5, price: 3.1 },
              { sku: 'BG-NBN12', quantity: 3, price: 3.1 }
            ],
            lastUpdated: new Date().toISOString()
          },
          {
            orderId: 'ORD002',
            orderNumber: 'KT-2024-002',
            customerName: 'Jane Doe',
            orderDate: '2024-01-16',
            status: 'Pending',
            totalAmount: 89.50,
            items: [
              { sku: 'BG-NBS12', quantity: 2, price: 3.1 }
            ],
            lastUpdated: new Date().toISOString()
          }
        ],
        analytics: {
          topProducts: [
            { sku: 'BG-NAB12', name: 'BG Electrical Antique Brass Switch', sales: 156, revenue: 483.6 },
            { sku: 'BG-NBN12', name: 'BG Nexus Black Nickel Switch', sales: 89, revenue: 275.9 },
            { sku: 'BG-NBS12', name: 'BG Brushed Steel Switch', sales: 67, revenue: 207.7 }
          ],
          lowStockAlerts: [
            { sku: 'BG-NBS12-4', name: 'BG NBS12 Brushed Steel Switch x 4', currentStock: 13, reorderPoint: 5 },
            { sku: 'BG-NBS12-8', name: 'BG NBS12 Brushed Steel Switch x 8', currentStock: 6, reorderPoint: 3 }
          ],
          recentOrders: [
            { orderNumber: 'KT-2024-001', customer: 'John Smith', amount: 156.75, status: 'Completed' },
            { orderNumber: 'KT-2024-002', customer: 'Jane Doe', amount: 89.50, status: 'Pending' }
          ],
          revenueTrends: [
            { date: '2024-01-10', revenue: 1200 },
            { date: '2024-01-11', revenue: 1350 },
            { date: '2024-01-12', revenue: 1100 },
            { date: '2024-01-13', revenue: 1450 },
            { date: '2024-01-14', revenue: 1600 },
            { date: '2024-01-15', revenue: 1705.75 }
          ]
        }
      });
    }
  }, [sellerDynamicsData]);

  const filteredStockLevels = detailedData.stockLevels.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStockStatus = (currentStock, reorderPoint) => {
    if (currentStock <= reorderPoint) return 'error';
    if (currentStock <= reorderPoint * 1.5) return 'warning';
    return 'success';
  };

  return (
    <Layout>
      <Head>
        <title>SellerDynamics Dashboard - Kent Traders Admin</title>
        <meta name="description" content="Real-time SellerDynamics data dashboard" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                SellerDynamics Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time inventory, orders, and analytics from SellerDynamics
              </Typography>
            </Box>
            
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={isRealData ? 'Real Data' : isMockData ? 'Mock Data' : 'Loading...'}
                  color={isRealData ? 'success' : isMockData ? 'warning' : 'default'}
                  size="small"
                  icon={isRealData ? <CheckCircleIcon /> : isMockData ? <WarningIcon /> : <CircularProgress size={16} />}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={refreshData}
                  disabled={dataLoading}
                >
                  Refresh
                </Button>
              </Box>
              {sellerDynamicsData && (
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date(sellerDynamicsData.lastUpdated).toLocaleString()}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Data Source Alert */}
          {isMockData && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Using Mock Data</AlertTitle>
              <AlertDescription>
                Real SellerDynamics credentials are not configured. To use real data, please set up your SellerDynamics API credentials in the environment variables.
              </AlertDescription>
            </Alert>
          )}

          {dataError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Data Error</AlertTitle>
              <AlertDescription>
                {dataError}
              </AlertDescription>
            </Alert>
          )}
        </Box>

        {/* Overview Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <InventoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                      {dataLoading ? <CircularProgress size={24} /> : sellerDynamicsData?.totalProducts || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Products
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
                  <DataUsageIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                      {dataLoading ? <CircularProgress size={24} /> : sellerDynamicsData?.totalStock || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Stock
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
                  <CartIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                      {dataLoading ? <CircularProgress size={24} /> : sellerDynamicsData?.ordersToday || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Orders Today
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
                  <TrendingUpIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                      {dataLoading ? <CircularProgress size={24} /> : `£${(sellerDynamicsData?.totalRevenue || 0).toLocaleString()}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Filter Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter Type"
              >
                <MenuItem value="all">All Items</MenuItem>
                <MenuItem value="lowStock">Low Stock</MenuItem>
                <MenuItem value="masterProducts">Master Products</MenuItem>
                <MenuItem value="kitProducts">Kit Products</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={showAdvanced}
                  onChange={(e) => setShowAdvanced(e.target.checked)}
                />
              }
              label="Advanced View"
            />
          </Box>
        </Paper>

        {/* Stock Levels Table */}
        <Paper sx={{ mb: 4 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" component="h2">
              Stock Levels
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Available Stock</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStockLevels
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {item.currentStock}
                        <Chip
                          label={item.isMasterProduct ? 'Master' : 'Kit'}
                          size="small"
                          color={item.isMasterProduct ? 'primary' : 'secondary'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {item.availableStock}
                        <Chip
                          label={getStockStatus(item.availableStock, item.reorderPoint)}
                          size="small"
                          color={getStockStatus(item.availableStock, item.reorderPoint)}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>£{item.price}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.availableStock <= item.reorderPoint ? 'Low Stock' : 'In Stock'}
                        color={item.availableStock <= item.reorderPoint ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(item)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStockLevels.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>

        {/* Analytics Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Products by Sales
              </Typography>
              <List>
                {detailedData.analytics.topProducts.map((product, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrendingUpIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={product.name}
                      secondary={`${product.sales} units sold - £${product.revenue}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Low Stock Alerts
              </Typography>
              <List>
                                 {detailedData.analytics.lowStockAlerts.map((alert, index) => (
                   <ListItem key={index}>
                     <ListItemIcon>
                       <WarningIcon color="error" />
                     </ListItemIcon>
                     <ListItemText
                       primary={alert.name}
                       secondary={`${alert.currentStock} in stock (Reorder at ${alert.reorderPoint})`}
                     />
                   </ListItem>
                 ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Detail Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Product Details - {selectedItem?.sku}
          </DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Product Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="SKU"
                          secondary={selectedItem.sku}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Product Name"
                          secondary={selectedItem.productName}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Vendor"
                          secondary={selectedItem.vendor}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Category"
                          secondary={selectedItem.category}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Stock Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Current Stock"
                          secondary={selectedItem.currentStock}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Available Stock"
                          secondary={selectedItem.availableStock}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Reorder Point"
                          secondary={selectedItem.reorderPoint}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Price"
                          secondary={`£${selectedItem.price}`}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
