import React, { useState, useEffect } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  Divider,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function InventoryUnified() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [totalInventoryCount, setTotalInventoryCount] = useState(0);
  const [dataSourceMeta, setDataSourceMeta] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('edit');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    status: 'in-stock',
    quantity: 0,
    price: 0,
    cost: 0,
    location: {
      warehouse: '',
      aisle: '',
      shelf: ''
    },
    source: 'SellerDynamics',
    type: 'Master Product'
  });
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    console.log('🔍 [Inventory] useEffect called - fetching inventory data');
    fetchInventoryData();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, filterCategory, filterSource, filterStatus, filterType]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [Inventory] Fetching inventory data from API...');
      const response = await fetch('/api/inventory/unified?page=1&limit=50');
      const result = await response.json();
      
      console.log('🔍 [Inventory] API Response:', result);
      
      if (result.success && result.data) {
        setInventory(result.data);
        setTotalInventoryCount(result.pagination?.totalItems || 0);
        setDataSourceMeta(result.meta || null);
        console.log('🔍 [Inventory] Inventory data loaded successfully');
        console.log('🔍 [Inventory] Total items:', result.pagination?.totalItems || 0);
        console.log('🔍 [Inventory] Current page items:', result.data.length);
        console.log('🔍 [Inventory] Data source meta:', result.meta);
      } else {
        setError('Failed to load inventory data');
        console.error('🔍 [Inventory] API Error:', result);
      }
    } catch (err) {
      console.error('🔍 [Inventory] Fetch error:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = [...inventory];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Source filter
    if (filterSource !== 'all') {
      filtered = filtered.filter(item => item.source === filterSource);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => {
        if (filterStatus === 'in-stock') return item.currentStock > 0;
        if (filterStatus === 'out-of-stock') return item.currentStock === 0;
        if (filterStatus === 'low-stock') return item.currentStock > 0 && item.currentStock <= 10;
        return true;
      });
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.productType === filterType);
    }

    setFilteredInventory(filtered);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.productName || '',
      sku: item.sku || '',
      category: item.category || '',
      status: item.currentStock > 0 ? 'in-stock' : 'out-of-stock',
      quantity: item.currentStock || 0,
      price: item.price || 0,
      cost: item.cost || 0,
      location: item.location || { warehouse: '', aisle: '', shelf: '' },
      source: item.source || 'SellerDynamics',
      type: item.productType || 'Master Product'
    });
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      sku: '',
      category: '',
      status: 'in-stock',
      quantity: 0,
      price: 0,
      cost: 0,
      location: { warehouse: '', aisle: '', shelf: '' },
      source: 'SellerDynamics',
      type: 'Master Product'
    });
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleDeleteItem = (itemId) => {
    // Implement delete functionality
    console.log('Delete item:', itemId);
  };

  const handleSaveItem = () => {
    // Implement save functionality
    console.log('Save item:', formData);
    setDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'success';
      case 'out-of-stock': return 'error';
      case 'low-stock': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-stock': return <CheckCircleIcon />;
      case 'out-of-stock': return <ErrorIcon />;
      case 'low-stock': return <WarningIcon />;
      default: return <InfoIcon />;
    }
  };

  const groupByCategory = (items) => {
    return items.reduce((groups, item) => {
      const category = item.category || 'Uncategorized';
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
      return groups;
    }, {});
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6">Error Loading Inventory</Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Unified Inventory Management - AIMarketOps</title>
        <meta name="description" content="Comprehensive inventory tracking and management across all channels" />
      </Head>
      
      <Container maxWidth="xl" sx={{ 
          py: 4,
          backgroundColor: 'background.default',
          color: 'text.primary'
        }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Unified Inventory Management
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Comprehensive inventory tracking and management across all channels
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton 
                onClick={fetchInventoryData}
                disabled={loading}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <RefreshIcon />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Box>
          </Box>
          
          {/* Data Source Status Banner */}
          {dataSourceMeta && (
            <Alert 
              severity={dataSourceMeta.integrationStatus?.status === 'Live Mode' ? 'success' : 'warning'}
              icon={dataSourceMeta.integrationStatus?.status === 'Live Mode' ? <CheckCircleIcon /> : <WarningIcon />}
              sx={{ mb: 3 }}
            >
              <Box display="flex" alignItems="center" justifyContent="between" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {dataSourceMeta.integrationStatus?.status === 'Live Mode' ? '🟢 Live Data Active' : '🟡 Mock Data Mode'}
                  </Typography>
                  <Typography variant="body2">
                    {dataSourceMeta.integrationStatus?.status === 'Live Mode' 
                      ? `SellerDynamics: ${dataSourceMeta.sellerdynamicsCount} products • Shopify: ${dataSourceMeta.shopifyCount} products • Both providing live data`
                      : 'Using simulated inventory data • Check API configuration'
                    }
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <Chip 
                    label={`SD: ${dataSourceMeta.sellerdynamicsCount}`} 
                    color="primary" 
                    size="small" 
                  />
                  <Chip 
                    label={`Shopify: ${dataSourceMeta.shopifyCount}`} 
                    color="secondary" 
                    size="small" 
                  />
                </Box>
              </Box>
            </Alert>
          )}
          
          {/* Debug Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Debug Info: Component loaded, loading={loading.toString()}, error={error || 'none'}, inventory count={inventory.length}, current page items={filteredInventory.length}
            </Typography>
          </Box>
          
          {/* Status Indicators */}
          <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
            <Chip 
              icon={<InventoryIcon />}
              label={`Total Items: ${totalInventoryCount}`}
              color="primary"
              size="small"
            />
            <Chip 
              icon={<CheckCircleIcon />}
              label={`Filtered Items: ${filteredInventory.length}`}
              color="success"
              size="small"
            />
            {dataSourceMeta && (
              <>
                <Chip 
                  icon={dataSourceMeta.integrationStatus?.status === 'Live Mode' ? <CheckCircleIcon /> : <WarningIcon />}
                  label={dataSourceMeta.integrationStatus?.status === 'Live Mode' ? 'Live Data' : 'Mock Data'}
                  color={dataSourceMeta.integrationStatus?.status === 'Live Mode' ? 'success' : 'warning'}
                  size="small"
                  variant="outlined"
                />
                <Chip 
                  icon={<InfoIcon />}
                  label={`SellerDynamics: ${dataSourceMeta.sellerdynamicsCount || 0}`}
                  color="primary"
                  size="small"
                />
                <Chip 
                  icon={<InfoIcon />}
                  label={`Shopify: ${dataSourceMeta.shopifyCount || 0}`}
                  color="secondary"
                  size="small"
                />
              </>
            )}
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
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
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  label="Source"
                >
                  <MenuItem value="all">All Sources</MenuItem>
                  <MenuItem value="SellerDynamics">SellerDynamics</MenuItem>
                  <MenuItem value="Shopify">Shopify</MenuItem>
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
                  <MenuItem value="in-stock">In Stock</MenuItem>
                  <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                  <MenuItem value="low-stock">Low Stock</MenuItem>
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
                  <MenuItem value="Master Product">Master Product</MenuItem>
                  <MenuItem value="Kit Product">Kit Product</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Box display="flex" gap={1}>
                <Tooltip title="Table View">
                  <IconButton
                    onClick={() => setViewMode('table')}
                    color={viewMode === 'table' ? 'primary' : 'default'}
                  >
                    <ViewListIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Card View">
                  <IconButton
                    onClick={() => setViewMode('card')}
                    color={viewMode === 'card' ? 'primary' : 'default'}
                  >
                    <ViewModuleIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Inventory Content */}
        {viewMode === 'table' ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {item.productName}
                        </Typography>
                        <Chip
                          label={item.source === 'SellerDynamics' ? 'SD Live' : 'Shopify Live'}
                          color={item.source === 'SellerDynamics' ? 'success' : 'info'}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: '20px' }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {item.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.category || 'General'} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.currentStock || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(item.currentStock > 0 ? 'in-stock' : 'out-of-stock')}
                        label={item.currentStock > 0 ? 'In Stock' : 'Out of Stock'}
                        color={getStatusColor(item.currentStock > 0 ? 'in-stock' : 'out-of-stock')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.source} 
                        size="small" 
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {item.productType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditItem(item)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteItem(item.id)}
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
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredInventory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        ) : (
          <Grid container spacing={3}>
            {filteredInventory
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card sx={{
                  backgroundColor: 'background.paper',
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" noWrap>
                        {item.productName}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(item.currentStock > 0 ? 'in-stock' : 'out-of-stock')}
                        label={item.currentStock > 0 ? 'In Stock' : 'Out of Stock'}
                        color={getStatusColor(item.currentStock > 0 ? 'in-stock' : 'out-of-stock')}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      SKU: {item.sku}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Stock: {item.currentStock || 0}
                    </Typography>
                    <Box display="flex" gap={1} mt={2}>
                      <Chip 
                        label={item.category || 'General'} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={item.source} 
                        size="small" 
                        color="info"
                        variant="outlined"
                      />
                    </Box>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditItem(item)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Edit/Add Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {dialogMode === 'add' ? 'Add New Item' : 'Edit Item'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItem} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}