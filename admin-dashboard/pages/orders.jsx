import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Container,
  Typography,
  Box,
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
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMarketplace, setFilterMarketplace] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    status: 'pending',
    total: 0,
    items: [],
    paymentMethod: 'credit_card',
    shippingMethod: 'standard',
    notes: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, filterStatus, filterMarketplace, filterDateFrom, filterDateTo, sortBy, sortOrder]);

  const fetchOrders = async (marketplace = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[Orders Page] Fetching real orders data for marketplace:', marketplace);
      
      const response = await fetch(`/api/orders?marketplace=${marketplace}`);
      const result = await response.json();
      
      if (result.dataSource === 'authorization_error') {
        console.warn('[Orders Page] Authorization error:', result.error);
        setError(`Authorization Required: ${result.error}`);
        setOrders([]);
        return;
      }
      
      if (result.dataSource === 'error') {
        console.error('[Orders Page] API error:', result.error);
        setError(`API Error: ${result.error}`);
        setOrders([]);
        return;
      }
      
      if (result.orders && Array.isArray(result.orders)) {
        console.log('[Orders Page] Successfully fetched orders:', {
          totalOrders: result.orders.length,
          totalRevenue: result.stats?.totalRevenue || 0,
          dataSource: result.dataSource,
          marketplace: marketplace
        });
        setOrders(result.orders);
      } else {
        console.warn('[Orders Page] No orders data available');
        setOrders([]);
        if (result.dataSource === 'real' && result.orders?.length === 0) {
          setError('No orders found. This could be due to authorization issues or no orders in the system.');
        }
      }
    } catch (err) {
      console.error('[Orders Page] Error fetching orders:', err);
      setError('Failed to fetch orders: ' + err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };



  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Marketplace filter
    if (filterMarketplace !== 'all') {
      filtered = filtered.filter(order => order.marketplace === filterMarketplace);
    }

    // Date range filter
    if (filterDateFrom) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate || order.date);
        const fromDate = new Date(filterDateFrom);
        return orderDate >= fromDate;
      });
    }

    if (filterDateTo) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate || order.date);
        const toDate = new Date(filterDateTo);
        return orderDate <= toDate;
      });
    }

    // Sort the filtered orders
    const sortedOrders = [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'orderNumber':
          aValue = a.orderNumber || a.orderId || '';
          bValue = b.orderNumber || b.orderId || '';
          break;
        case 'customerName':
          aValue = a.customerName || '';
          bValue = b.customerName || '';
          break;
        case 'orderDate':
          aValue = new Date(a.orderDate || a.date || 0);
          bValue = new Date(b.orderDate || b.date || 0);
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'marketplace':
          aValue = a.marketplace || '';
          bValue = b.marketplace || '';
          break;
        case 'totalAmount':
          aValue = a.totalAmount || a.total || 0;
          bValue = b.totalAmount || b.total || 0;
          break;
        default:
          aValue = a.orderDate || a.date || '';
          bValue = b.orderDate || b.date || '';
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      } else {
        return sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
    });
    
    setFilteredOrders(sortedOrders);
  };

  const handleAddOrder = () => {
    setDialogMode('add');
    setSelectedOrder(null);
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      status: 'pending',
      total: 0,
      items: [],
      paymentMethod: 'credit_card',
      shippingMethod: 'standard',
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditOrder = (order) => {
    setDialogMode('edit');
    setSelectedOrder(order);
    setFormData({
      customerName: order.customerName || '',
      customerEmail: order.customerEmail || '',
      customerPhone: order.customerPhone || '',
      customerAddress: order.customerAddress || '',
      status: order.status || 'pending',
      total: order.totalAmount || order.total || 0,
      items: order.items || [],
      paymentMethod: order.paymentMethod || 'credit_card',
      shippingMethod: order.shippingMethod || 'standard',
      notes: order.notes || ''
    });
    setDialogOpen(true);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  const handleSaveOrder = () => {
    if (dialogMode === 'add') {
      const newOrder = {
        id: `SD${Date.now()}`,
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      setOrders(prev => [...prev, newOrder]);
    } else {
      setOrders(prev => prev.map(order =>
        order.id === selectedOrder.id ? { ...order, ...formData } : order
      ));
    }
    setDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <PaymentIcon />;
      case 'paypal':
        return <PaymentIcon />;
      case 'bank_transfer':
        return <PaymentIcon />;
      default:
        return <PaymentIcon />;
    }
  };

  const getShippingMethodIcon = (method) => {
    switch (method) {
      case 'standard':
        return <ShippingIcon />;
      case 'express':
        return <ShippingIcon />;
      default:
        return <ShippingIcon />;
    }
  };

  return (
    <Layout>
      <Head>
        <title>Orders | Kent Traders Admin</title>
        <meta name="description" content="Manage customer orders" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track customer orders
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {loading ? <CircularProgress size={24} /> : orders.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
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
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {loading ? <CircularProgress size={24} /> : orders.filter(o => o.status === 'Pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Orders
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
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {loading ? <CircularProgress size={24} /> : orders.filter(o => o.status === 'Completed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Orders
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
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {loading ? <CircularProgress size={24} /> : `£${orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toLocaleString()}`}
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

        {/* Error Display */}
        {error && (
          <Alert 
            severity={error.includes('Authorization Required') ? 'warning' : 'error'} 
            sx={{ mb: 3 }}
            action={
              error.includes('Authorization Required') ? (
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => window.open('mailto:support@sellerdynamics.com?subject=API Authorization Request', '_blank')}
                >
                  Contact Support
                </Button>
              ) : null
            }
          >
            <Typography variant="body2">
              {error}
              {error.includes('Authorization Required') && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    To resolve this issue:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="ul" sx={{ mt: 0.5, pl: 2 }}>
                    <li>Contact SellerDynamics support to enable order access</li>
                    <li>Verify your account has permissions for GetCustomerOrders</li>
                    <li>Check if your API credentials are correct</li>
                  </Typography>
                </Box>
              )}
            </Typography>
          </Alert>
        )}

        {/* Data Source Indicator */}
        {orders.length > 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Showing {orders.length} orders from real SellerDynamics data
            </Typography>
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              No real SellerDynamics data available. Please check your API configuration.
            </Typography>
          </Alert>
        )}

        {/* Filters Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Marketplace</InputLabel>
                <Select
                  value={filterMarketplace}
                  onChange={(e) => {
                    setFilterMarketplace(e.target.value);
                    fetchOrders(e.target.value);
                  }}
                  label="Marketplace"
                >
                  <MenuItem value="all">All Marketplaces</MenuItem>
                  <MenuItem value="Amazon">Amazon</MenuItem>
                  <MenuItem value="eBay">eBay</MenuItem>
                  <MenuItem value="Shopify">Shopify</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From Date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To Date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterMarketplace('all');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                  setSortBy('orderDate');
                  setSortOrder('desc');
                  fetchOrders('all');
                }}
                fullWidth
              >
                Clear All
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell 
                    onClick={() => handleSort('orderNumber')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box display="flex" alignItems="center">
                      Order Number
                      {sortBy === 'orderNumber' && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('customerName')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box display="flex" alignItems="center">
                      Customer
                      {sortBy === 'customerName' && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('orderDate')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box display="flex" alignItems="center">
                      Date
                      {sortBy === 'orderDate' && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('marketplace')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box display="flex" alignItems="center">
                      Marketplace
                      {sortBy === 'marketplace' && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('status')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box display="flex" alignItems="center">
                      Status
                      {sortBy === 'status' && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell 
                    onClick={() => handleSort('totalAmount')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box display="flex" alignItems="center">
                      Total Amount
                      {sortBy === 'totalAmount' && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                  <TableRow key={order.orderId || order.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {order.orderNumber || order.orderId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {order.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.customerEmail || 'No email'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(order.orderDate || order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.marketplace || 'Unknown'}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {order.items?.length || 0} items
                        </Typography>
                        {order.items && order.items.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {order.items[0].productName?.substring(0, 30)}...
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        £{(order.totalAmount || order.total || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewOrder(order)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Order">
                          <IconButton
                            size="small"
                            onClick={() => handleEditOrder(order)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Paper>

        {/* Enhanced Order Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {dialogMode === 'view' ? 'Order Details' : dialogMode === 'edit' ? 'Edit Order' : 'Add New Order'}
            {selectedOrder && (
              <Typography variant="caption" display="block" color="text.secondary">
                {selectedOrder.orderNumber || selectedOrder.orderId}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Box>
                <Grid container spacing={3}>
                  {/* Order Information */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Order Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Order Number
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedOrder.orderNumber || selectedOrder.orderId}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Order Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedOrder.orderDate || selectedOrder.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={selectedOrder.status}
                        color={getStatusColor(selectedOrder.status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        £{(selectedOrder.totalAmount || selectedOrder.total || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Customer Information */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Customer Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Customer Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedOrder.customerName}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.customerEmail || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.customerPhone || 'Not provided'}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Order Items */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Order Items ({selectedOrder.items?.length || 0})
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {item.productName || item.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {item.sku}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2">
                                  {item.quantity}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2">
                                  £{item.price?.toFixed(2) || '0.00'}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight="bold">
                                  £{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  {/* Additional Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Additional Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedOrder.lastUpdated || new Date()).toLocaleString()}
                      </Typography>
                    </Box>
                    {selectedOrder.notes && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.notes}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              Close
            </Button>
            {dialogMode === 'edit' && (
              <Button variant="contained" onClick={handleSaveOrder}>
                Save Changes
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}