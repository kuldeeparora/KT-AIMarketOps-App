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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts = [
        {
          id: 1,
          name: 'Premium Widget',
          sku: 'WID-001',
          category: 'Electronics',
          price: 29.99,
          stock: 150,
          status: 'active',
          sales: 45,
          revenue: 1349.55
        },
        {
          id: 2,
          name: 'Deluxe Gadget',
          sku: 'GAD-002',
          category: 'Electronics',
          price: 49.99,
          stock: 75,
          status: 'active',
          sales: 32,
          revenue: 1599.68
        },
        {
          id: 3,
          name: 'Basic Tool',
          sku: 'TOOL-003',
          category: 'Tools',
          price: 19.99,
          stock: 200,
          status: 'active',
          sales: 89,
          revenue: 1779.11
        }
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || product.category.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Head>
        <title>Products - Kent Traders Admin</title>
        <meta name="description" content="Manage your product inventory" />
      </Head>

      <Layout>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Products
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your product inventory and track performance
            </Typography>
          </Box>

          {/* Filters and Search */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search products"
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filter}
                    label="Category"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="tools">Tools</MenuItem>
                    <MenuItem value="clothing">Clothing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Products Table */}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {loading ? (
              <Box sx={{ p: 3 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Loading products...
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Stock</TableCell>
                        <TableCell align="right">Sales</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedProducts.map((product) => (
                        <TableRow key={product.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {product.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell align="right">
                            £{product.price.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={product.stock}
                              color={product.stock < 50 ? 'warning' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{product.sales}</TableCell>
                          <TableCell align="right">
                            £{product.revenue.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.status}
                              color={getStatusColor(product.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewProduct(product)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error">
                                <DeleteIcon />
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
                  count={filteredProducts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </Paper>

          {/* Product Details Dialog */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Product Details
            </DialogTitle>
            <DialogContent>
              {selectedProduct && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      {selectedProduct.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      SKU: {selectedProduct.sku}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Category: {selectedProduct.category}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      £{selectedProduct.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Performance
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Stock: {selectedProduct.stock} units
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Sales: {selectedProduct.sales} units
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Revenue: £{selectedProduct.revenue.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              <Button variant="contained">
                Edit Product
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Layout>
    </>
  );
}
