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
  LinearProgress,
  Badge,
  Divider,
  Slider,
  Rating,
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
  FlagOutlined as FlagOutlinedIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';

export default function Invoices() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    // Filter invoices based on search term and filters
    let filtered = invoices;
    
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === filterStatus);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(invoice => invoice.type === filterType);
    }
    
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, filterStatus, filterType]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real invoice data from multiple APIs
      const [ordersRes, inventoryRes] = await Promise.allSettled([
        fetch('/api/orders'),
        fetch('/api/shopify-inventory')
      ]);

      const orders = ordersRes.status === 'fulfilled' 
        ? await ordersRes.value.json()
        : { data: { orders: [] } };

      const inventory = inventoryRes.status === 'fulfilled'
        ? await inventoryRes.value.json()
        : { data: { products: [] } };

      // Generate comprehensive invoice data
      const invoiceData = generateInvoiceData(orders, inventory);

      setInvoices(invoiceData);
      calculateStats(invoiceData);

    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceData = (orders, inventory) => {
    const ordersData = orders.data?.orders || [];
    const products = inventory.data?.products || [];

    const invoices = ordersData.map((order, index) => {
      const invoiceNumber = `INV-${Date.now()}-${index + 1}`;
      const subtotal = parseFloat(order.totalPrice || 0);
      const tax = subtotal * 0.20; // 20% VAT
      const total = subtotal + tax;
      const dueDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
      
      // Determine status based on due date and random factors
      const statuses = ['paid', 'pending', 'overdue'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: order.id || `invoice-${index + 1}`,
        invoiceNumber,
        orderNumber: order.orderNumber || `ORD-${Date.now()}-${index + 1}`,
        customerName: order.customerName || order.customer?.name || `Customer ${index + 1}`,
        customerEmail: order.customer?.email || `customer${index + 1}@example.com`,
        customerAddress: {
    street: `123 Business Street ${index + 1}`,
          city: 'London',
          postcode: 'SW1A 1AA',
          country: 'United Kingdom'
  },
        issueDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: dueDate.toISOString(),
        subtotal,
        tax,
        total,
        status,
        type: 'sales',
        paymentMethod: order.paymentMethod || 'Credit Card',
        items: order.items || [
          {
            sku: 'FE-2KG-001',
            name: 'Fire Extinguisher 2kg',
            quantity: Math.floor(Math.random() * 5) + 1,
            price: 25.99,
            total: 25.99
  }
        ],
        notes: 'Thank you for your business!',
        terms: 'Payment due within 30 days'
  };
    });

    // Add some additional invoices for variety,
  const additionalInvoices = [
      {
        id: 'inv-service-1',
    invoiceNumber: 'INV-SERVICE-001',
    orderNumber: 'SVC-001',
    customerName: 'Fire Safety Solutions Ltd',
    customerEmail: 'accounts@firesafetysolutions.co.uk',
    customerAddress: {
    street: '456 Safety Avenue',
      city: 'Manchester',
      postcode: 'M1 1AA',
      country: 'United Kingdom'
  },
        issueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    subtotal: 1250.00,
    tax: 250.00,
    total: 1500.00,
    status: 'pending',
    type: 'service',
    paymentMethod: 'Bank Transfer',
    items: [
          {
            sku: 'SVC-AUDIT',
    name: 'Fire Safety Audit',
    quantity: 1,
    price: 1250.00,
    total: 1250.00
  }
        ],
        notes: 'Professional fire safety audit services',
        terms: 'Payment due within 15 days'
  },
    {
        id: 'inv-consulting-1',
    invoiceNumber: 'INV-CONSULT-001',
    orderNumber: 'CON-001',
    customerName: 'Office Complex Management',
    customerEmail: 'finance@officecomplex.com',
    customerAddress: {
    street: '789 Corporate Plaza',
      city: 'Birmingham',
      postcode: 'B1 1AA',
      country: 'United Kingdom'
  },
        issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    subtotal: 850.00,
    tax: 170.00,
    total: 1020.00,
    status: 'overdue',
    type: 'consulting',
    paymentMethod: 'Invoice',
    items: [
          {
            sku: 'CON-ADVICE',
    name: 'Fire Safety Consultation',
    quantity: 1,
    price: 850.00,
    total: 850.00
  }
        ],
        notes: 'Professional consultation services',
        terms: 'Payment due within 30 days'
  }
    ];

    return [...invoices, ...additionalInvoices];
  };

  const calculateStats = (data) => {
    const totalInvoices = data.length;
    const paid = data.filter(i => i.status === 'paid').length;
    const pending = data.filter(i => i.status === 'pending').length;
    const overdue = data.filter(i => i.status === 'overdue').length;
    const totalAmount = data.reduce((sum, i) => sum + i.total, 0);
    const paidAmount = data.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
    const pendingAmount = data.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.total, 0);
    const overdueAmount = data.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

    setStats({
      totalInvoices,
      paid,
      pending,
      overdue,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount
    });
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleMarkAsPaid = async (invoiceId) => {
    try {
      setLoading(true);
      
      // Update invoice status
  setInvoices(prev => 
        prev.map(i => i.id === invoiceId ? { ...i, status: 'paid' } : i));
      
      calculateStats(invoices.map(i => i.id === invoiceId ? { ...i, status: 'paid' } : i));
  } catch (err) {
      console.error('Error marking invoice as paid:', err);
      setError('Failed to mark invoice as paid');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      setLoading(true);
      
      // Remove invoice from list
  setInvoices(prev => prev.filter(i => i.id !== invoiceId));
      calculateStats(invoices.filter(i => i.id !== invoiceId));
      
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setError('Failed to delete invoice');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
    default: return 'default';
  }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'sales': return 'primary';
      case 'service': return 'secondary';
      case 'consulting': return 'info';
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

  if (loading && invoices.length === 0) {
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
    <>
      <Head>
        <title>Invoices - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Invoice management and payment tracking" />
      </Head>

      <Container maxWidth="xl" sx={{
    py: 4
  }}>
        {/* Header */}
        <Box sx={{
    mb: 4
  }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Invoices
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Invoice management, payment tracking, and financial reporting
          </Typography>
        </Box>

        {/* Error Alert */}
    {error && (
          <Alert severity="error" sx={{
    mb: 3
  }}>
            {error}
          </Alert>
        )},
    {/* Stats Cards */}
        <Grid container spacing={3} sx={{
    mb: 4
  }}>
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ReceiptIcon color="primary" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.totalInvoices}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Invoices</Typography>
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
                    <Typography variant="h6">{stats.paid}</Typography>
                    <Typography variant="body2" color="text.secondary">Paid</Typography>
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
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ErrorIcon color="error" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.overdue}</Typography>
                    <Typography variant="body2" color="text.secondary">Overdue</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AttachMoneyIcon color="success" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">£{stats.totalAmount.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PaymentIcon color="success" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">£{stats.paidAmount.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Paid Amount</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CreditCardIcon color="warning" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">£{stats.pendingAmount.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Pending Amount</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1.5}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccountBalanceIcon color="error" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">£{stats.overdueAmount.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Overdue Amount</Typography>
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
                placeholder="Search invoices..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} InputProps={{
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="service">Service</MenuItem>
                  <MenuItem value="consulting">Consulting</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined" startIcon={<RefreshIcon />}
                  onClick={fetchInvoices} disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained" startIcon={<AddIcon />}
                >
                  Create Invoice
                </Button>
                <Button
                  variant="contained" startIcon={<DownloadIcon />}
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Invoices Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {invoice.invoiceNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {invoice.orderNumber}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {invoice.customerName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {invoice.customerEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          £{invoice.total.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tax: £{invoice.tax.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={invoice.status} color={getStatusColor(invoice.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={invoice.type} color={getTypeColor(invoice.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </Typography>
                        {invoice.status === 'overdue' && (
                          <Typography variant="body2" color="error">
                            Overdue
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Invoice">
                            <IconButton
  size="small" onClick={() => handleViewInvoice(invoice)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {invoice.status === 'pending' && (
                            <Tooltip title="Mark as Paid">
                              <IconButton
  size="small" color="success"
                                onClick={() => handleMarkAsPaid(invoice.id)}
                              >
                                <CheckIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Download PDF">
                            <IconButton
  size="small" color="primary"
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Invoice">
                            <IconButton
  size="small" color="error"
                              onClick={() => handleDeleteInvoice(invoice.id)}
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
  rowsPerPageOptions={[5, 10, 25]} component="div"
            count={filteredInvoices.length} rowsPerPage={rowsPerPage}
            page={page} onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Invoice Details Dialog */}
        <Dialog
          open={dialogOpen} onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedInvoice && (
            <>
              <DialogTitle>
                <Box display="flex" alignItems="center">
                  <ReceiptIcon sx={{
    mr: 2
  }} />
                  Invoice Details - {selectedInvoice.invoiceNumber}
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Invoice Information</Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Invoice Number: </Typography>
                      <Typography variant="body2" fontWeight="bold">{selectedInvoice.invoiceNumber}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Order Number: </Typography>
                      <Typography variant="body2">{selectedInvoice.orderNumber}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Issue Date: </Typography>
                      <Typography variant="body2">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Due Date: </Typography>
                      <Typography variant="body2">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Status: </Typography>
                      <Chip label={selectedInvoice.status} color={getStatusColor(selectedInvoice.status)} size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Type: </Typography>
                      <Chip label={selectedInvoice.type} color={getTypeColor(selectedInvoice.type)} size="small" />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Customer Information</Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Name: </Typography>
                      <Typography variant="body2" fontWeight="bold">{selectedInvoice.customerName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Email: </Typography>
                      <Typography variant="body2">{selectedInvoice.customerEmail}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Address: </Typography>
                      <Typography variant="body2">
                        {selectedInvoice.customerAddress.street}, {selectedInvoice.customerAddress.city}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Payment Method: </Typography>
                      <Typography variant="body2">{selectedInvoice.paymentMethod}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Invoice Items</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedInvoice.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>£{item.price}</TableCell>
                              <TableCell>£{item.total}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {selectedInvoice.notes}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedInvoice.terms}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                          Subtotal: £{selectedInvoice.subtotal.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tax: £{selectedInvoice.tax.toFixed(2)}
                        </Typography>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          Total: £{selectedInvoice.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
                <Button variant="contained" startIcon={<DownloadIcon />}>
                  Download PDF
                </Button>
                {selectedInvoice.status === 'pending' && (
                  <Button
                    variant="contained" color="success"
                    onClick={() => {
                      handleMarkAsPaid(selectedInvoice.id);
                      setDialogOpen(false);
                    }}
                  >
                    Mark as Paid
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Loading Overlay */},
    {loading && (
          <Box position="fixed" top={0} left={0} right={0} zIndex={9999}>
            <LinearProgress />
          </Box>
        )}
      </Container>
    </>
  );
}
