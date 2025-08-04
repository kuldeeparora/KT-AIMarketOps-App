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
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  AlertTitle,
  Collapse,
  Rating,
  LinearProgress
} from '@mui/material';
import {
    Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Block as BlockIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  Assessment as AssessmentIcon,
  ContactSupport as ContactSupportIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon,
  SupervisedUserCircle as SupervisedUserIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon,
  Branding as BrandingIcon,
  PriceCheck as PriceCheckIcon,
  Euro as EuroIcon,
  CurrencyPound as CurrencyPoundIcon,
  Info as InfoIcon,
  Help as HelpIcon
} from '@mui/icons-material';

export default function VendorManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    status: 'active',
    rating: 0,
    paymentTerms: '',
    leadTime: '',
    minimumOrder: '',
    notes: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchTerm, filterCategory, filterStatus, filterRating]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock vendor data
      const mockVendors = generateMockVendors();
      setVendors(mockVendors);
      setFilteredVendors(mockVendors);

    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to fetch vendors: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockVendors = () => {
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Automotive', 'Sports', 'Books', 'Food & Beverage', 'Health & Beauty'];
    const statuses = ['active', 'inactive', 'pending', 'suspended'];
    const paymentTerms = ['Net 30', 'Net 60', 'Net 90', 'Cash on Delivery', 'Advance Payment'];
    const leadTimes = ['1-3 days', '3-7 days', '1-2 weeks', '2-4 weeks', '4-8 weeks'];

    return Array.from({ length: 30 }, (_, index) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentTerm = paymentTerms[Math.floor(Math.random() * paymentTerms.length)];
      const leadTime = leadTimes[Math.floor(Math.random() * leadTimes.length)];
      const rating = Math.floor(Math.random() * 5) + 1;
      const totalOrders = Math.floor(Math.random() * 1000) + 50;
      const totalSpent = Math.floor(Math.random() * 50000) + 5000;
      const onTimeDelivery = Math.floor(Math.random() * 20) + 80; // 80-100%
      const qualityScore = Math.floor(Math.random() * 20) + 80; // 80-100%

      return {
        id: `vendor-${index + 1}`,
        name: `Vendor ${index + 1}`,
        contactPerson: `Contact Person ${index + 1}`,
        email: `vendor${index + 1}@example.com`,
        phone: `+44 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        address: `${Math.floor(Math.random() * 999) + 1} ${['High Street', 'Main Road', 'Church Lane', 'Station Road', 'Market Place'][Math.floor(Math.random() * 5)]}, ${['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Sheffield', 'Bristol', 'Glasgow'][Math.floor(Math.random() * 8)]}`,
        category,
        status,
        rating,
        paymentTerms: paymentTerm,
        leadTime,
        minimumOrder: `£${Math.floor(Math.random() * 500) + 50}`,
        totalOrders,
        totalSpent,
        onTimeDelivery,
        qualityScore,
        notes: `Vendor notes for ${index + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastOrder: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  };

  const filterVendors = () => {
    let filtered = vendors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(vendor => vendor.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(vendor => vendor.status === filterStatus);
    }

    // Rating filter
    if (filterRating !== 'all') {
      const ratingValue = parseInt(filterRating);
      filtered = filtered.filter(vendor => vendor.rating >= ratingValue);
    }

    setFilteredVendors(filtered);
  };

  const handleAddVendor = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      status: 'active',
      rating: 0,
      paymentTerms: '',
      leadTime: '',
      minimumOrder: '',
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEditVendor = (vendor) => {
    setDialogMode('edit');
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      category: vendor.category,
      status: vendor.status,
      rating: vendor.rating,
      paymentTerms: vendor.paymentTerms,
      leadTime: vendor.leadTime,
      minimumOrder: vendor.minimumOrder,
      notes: vendor.notes
    });
    setDialogOpen(true);
  };

  const handleDeleteVendor = (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(vendor => vendor.id !== vendorId));
    }
  };

  const handleSaveVendor = () => {
    if (dialogMode === 'add') {
      const newVendor = {
        id: `vendor-${Date.now()}`,
        ...formData,
        totalOrders: 0,
        totalSpent: 0,
        onTimeDelivery: 100,
        qualityScore: 100,
        createdAt: new Date().toISOString(),
        lastOrder: null
      };
      setVendors([...vendors, newVendor]);
    } else {
      setVendors(vendors.map(vendor =>
        vendor.id === selectedVendor.id ? { ...vendor, ...formData } : vendor
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Electronics': return <BusinessIcon />;
      case 'Clothing': return <PersonIcon />;
      case 'Home & Garden': return <WorkIcon />;
      case 'Automotive': return <LocalShippingIcon />;
      case 'Sports': return <TrendingUpIcon />;
      case 'Books': return <AssignmentIcon />;
      case 'Food & Beverage': return <ReceiptIcon />;
      case 'Health & Beauty': return <CheckCircleIcon />;
      default: return <BusinessIcon />;
    }
  };

  const getUniqueCategories = () => {
    return [...new Set(vendors.map(vendor => vendor.category))];
  };

  const getVendorStats = () => {
    const totalVendors = vendors.length;
    const activeVendors = vendors.filter(v => v.status === 'active').length;
    const totalSpent = vendors.reduce((sum, v) => sum + v.totalSpent, 0);
    const averageRating = vendors.length > 0 ? vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length : 0;
    const topPerformers = vendors.filter(v => v.rating >= 4 && v.status === 'active').length;

    return {
      totalVendors,
      activeVendors,
      totalSpent,
      averageRating,
      topPerformers
    };
  };

  const stats = getVendorStats();

  return (
    <Layout>
      <>
        <Head>
          <title>Vendor Management - Kent Traders Admin</title>
          <meta name="description" content="Comprehensive vendor management for Kent Traders Admin" />
        </Head>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Vendor Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage vendors, track performance, and optimize supplier relationships
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Controls */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search vendors..."
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
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {getUniqueCategories().map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
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
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Rating</InputLabel>
                  <Select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    label="Rating"
                  >
                    <MenuItem value="all">All Ratings</MenuItem>
                    <MenuItem value="4">4+ Stars</MenuItem>
                    <MenuItem value="3">3+ Stars</MenuItem>
                    <MenuItem value="2">2+ Stars</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddVendor}
                  fullWidth
                >
                  Add Vendor
                </Button>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchVendors}
                  fullWidth
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <BusinessIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.totalVendors}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Vendors
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.activeVendors}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Vendors
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <AttachMoneyIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        £{(stats.totalSpent / 1000).toFixed(1)}k
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Spent
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <StarIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.averageRating.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Rating
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <TrendingUpIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.topPerformers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Top Performers
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Vendors Table */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Performance</TableCell>
                    <TableCell>Total Orders</TableCell>
                    <TableCell>Total Spent</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVendors
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2 }}>
                              {vendor.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="bold">
                                {vendor.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {vendor.contactPerson}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getCategoryIcon(vendor.category)}
                            label={vendor.category}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{vendor.email}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {vendor.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                            color={getStatusColor(vendor.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Rating value={vendor.rating} readOnly size="small" />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              Delivery: {vendor.onTimeDelivery}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Quality: {vendor.qualityScore}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{vendor.totalOrders}</TableCell>
                        <TableCell>£{vendor.totalSpent.toLocaleString()}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="View Details">
                              <IconButton size="small" color="primary">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Vendor">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditVendor(vendor)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Vendor">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteVendor(vendor.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredVendors.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          {/* Add/Edit Vendor Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {dialogMode === 'add' ? 'Add New Vendor' : 'Edit Vendor'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vendor Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Person"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      label="Category"
                    >
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Clothing">Clothing</MenuItem>
                      <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                      <MenuItem value="Automotive">Automotive</MenuItem>
                      <MenuItem value="Sports">Sports</MenuItem>
                      <MenuItem value="Books">Books</MenuItem>
                      <MenuItem value="Food & Beverage">Food & Beverage</MenuItem>
                      <MenuItem value="Health & Beauty">Health & Beauty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="suspended">Suspended</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Payment Terms"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Lead Time"
                    value={formData.leadTime}
                    onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Minimum Order"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography component="legend">Rating</Typography>
                    <Rating
                      value={formData.rating}
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, rating: newValue });
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveVendor} variant="contained">
                {dialogMode === 'add' ? 'Add Vendor' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Loading Overlay */}
          {loading && (
            <Box position="fixed" top={0} left={0} right={0} zIndex={9999}>
              <LinearProgress />
            </Box>
          )}
        </Container>
      </>
    </Layout>
  );
}
