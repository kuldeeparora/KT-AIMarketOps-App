import React, { useState, useEffect } from 'react';

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
  ListItemIcon
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  ShoppingCart as CartIcon,
  Analytics as AnalyticsIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import Head from 'next/head';

export default function InventoryRelationships() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredRelationships, setFilteredRelationships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRelationships: 0,
    crossSell: 0,
    upSell: 0,
    bundle: 0,
    complementary: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter relationships based on search term and type
    let filtered = relationships;
    
    if (searchTerm) {
      filtered = filtered.filter(rel => 
        rel.primaryProduct.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rel.relatedProduct.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rel.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(rel => rel.type === filterType);
    }
    
    setFilteredRelationships(filtered);
  }, [relationships, searchTerm, filterType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data for relationships
      const mockRelationships = [
        {
          id: 1,
          primaryProduct: { id: 1, title: 'Wireless Headphones', sku: 'WH-001', price: 89.99 },
          relatedProduct: { id: 2, title: 'Bluetooth Speaker', sku: 'BS-001', price: 129.99 },
          type: 'cross_sell',
          strength: 'high',
          createdDate: '2024-01-15',
          lastUpdated: '2024-01-20',
          conversionRate: 0.15,
          revenueImpact: 1250.50
        },
        {
          id: 2,
          primaryProduct: { id: 3, title: 'Smartphone Case', sku: 'SC-001', price: 19.99 },
          relatedProduct: { id: 4, title: 'Screen Protector', sku: 'SP-001', price: 12.99 },
          type: 'complementary',
          strength: 'medium',
          createdDate: '2024-01-10',
          lastUpdated: '2024-01-18',
          conversionRate: 0.08,
          revenueImpact: 450.25
        },
        {
          id: 3,
          primaryProduct: { id: 5, title: 'Gaming Console', sku: 'GC-001', price: 399.99 },
          relatedProduct: { id: 6, title: 'Gaming Bundle Pack', sku: 'GBP-001', price: 499.99 },
          type: 'up_sell',
          strength: 'high',
          createdDate: '2024-01-05',
          lastUpdated: '2024-01-15',
          conversionRate: 0.25,
          revenueImpact: 2500.00
        },
        {
          id: 4,
          primaryProduct: { id: 7, title: 'Coffee Maker', sku: 'CM-001', price: 79.99 },
          relatedProduct: { id: 8, title: 'Coffee Beans Bundle', sku: 'CBB-001', price: 29.99 },
          type: 'bundle',
          strength: 'medium',
          createdDate: '2024-01-12',
          lastUpdated: '2024-01-19',
          conversionRate: 0.12,
          revenueImpact: 800.75
        }
      ];

      setRelationships(mockRelationships);
      calculateStats(mockRelationships);

    } catch (err) {
      console.error('Error fetching relationship data:', err);
      setError('Failed to fetch relationship data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalRelationships = data.length;
    const crossSell = data.filter(r => r.type === 'cross_sell').length;
    const upSell = data.filter(r => r.type === 'up_sell').length;
    const bundle = data.filter(r => r.type === 'bundle').length;
    const complementary = data.filter(r => r.type === 'complementary').length;

    setStats({
      totalRelationships,
      crossSell,
      upSell,
      bundle,
      complementary
    });
  };

  const handleCreateRelationship = () => {
    setSelectedRelationship(null);
    setDialogOpen(true);
  };

  const handleEditRelationship = (relationship) => {
    setSelectedRelationship(relationship);
    setDialogOpen(true);
  };

  const handleDeleteRelationship = async (id) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRelationships(prev => prev.filter(r => r.id !== id));
      calculateStats(relationships.filter(r => r.id !== id));
      
    } catch (err) {
      console.error('Error deleting relationship:', err);
      setError('Failed to delete relationship');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'cross_sell': return 'primary';
      case 'up_sell': return 'secondary';
      case 'bundle': return 'success';
      case 'complementary': return 'info';
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

  if (loading && relationships.length === 0) {
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
        <title>Inventory Relationships - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Manage product relationships and cross-selling strategies" />
      </Head>

      <Container maxWidth="xl" sx={{
    py: 4
  }}>
        {/* Header */}
        <Box sx={{
    mb: 4
  }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Inventory Relationships
          </Typography>
          <Typography variant="body,1" color="text.secondary">
            Manage product relationships, cross-selling, and bundle strategies
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
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <LinkIcon color="primary" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.totalRelationships}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Relationships</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CartIcon color="secondary" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.crossSell}</Typography>
                    <Typography variant="body2" color="text.secondary">Cross-Sell</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="success" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.upSell}</Typography>
                    <Typography variant="body2" color="text.secondary">Up-Sell</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <InventoryIcon color="info" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.bundle}</Typography>
                    <Typography variant="body2" color="text.secondary">Bundles</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AutoAwesomeIcon color="warning" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.complementary}</Typography>
                    <Typography variant="body2" color="text.secondary">Complementary</Typography>
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search relationships..."
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
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type Filter</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Type Filter"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="cross_sell">Cross-Sell</MenuItem>
                  <MenuItem value="up_sell">Up-Sell</MenuItem>
                  <MenuItem value="bundle">Bundle</MenuItem>
                  <MenuItem value="complementary">Complementary</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={5}>
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
                  startIcon={<AddIcon />}
                  onClick={handleCreateRelationship}
                >
                  Create Relationship
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Relationships Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Primary Product</TableCell>
                  <TableCell>Related Product</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Strength</TableCell>
                  <TableCell align="right">Conversion Rate</TableCell>
                  <TableCell align="right">Revenue Impact</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRelationships
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((relationship) => (
                    <TableRow key={relationship.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{relationship.primaryProduct.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            SKU: {relationship.primaryProduct.sku}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{relationship.relatedProduct.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            SKU: {relationship.relatedProduct.sku}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={relationship.type.replace('_', ' ')}
                          color={getTypeColor(relationship.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={relationship.strength}
                          color={getStrengthColor(relationship.strength)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {(relationship.conversionRate * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell align="right">
                        £{relationship.revenueImpact.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(relationship.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Relationship">
                            <IconButton
  size="small" onClick={() => handleEditRelationship(relationship)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Relationship">
                            <IconButton
  size="small" color="error"
                              onClick={() => handleDeleteRelationship(relationship.id)}
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
            count={filteredRelationships.length} rowsPerPage={rowsPerPage}
            page={page} onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

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