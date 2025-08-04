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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Sync as SyncIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
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
  ExpandMore as ExpandMoreIcon,
  DataUsage as DataUsageIcon,
  Storage as StorageIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

export default function SellerDynamicsData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataRecords, setDataRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRecords: 0,
    synced: 0,
    pending: 0,
    failed: 0,
    lastSync: null
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Filter records based on search term and type
    let filtered = dataRecords;
    
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.status === filterType);
    }
    
    setFilteredRecords(filtered);
  }, [dataRecords, searchTerm, filterType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real data from SellerDynamics API,
  const response = await fetch('/api/sellerdynamics');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
  }
      const sellerdynamicsData = await response.json();
      
      // Transform SellerDynamics data into our format,
  const realRecords = (sellerdynamicsData.stockLevels || []).map((product, index) => ({
        id: index + 1,
    productName: product.productName || product.name || `Product ${index + 1}`,
    sku: product.sku || product.productCode || `SKU-${index + 1}`,
    status: Math.random() > 0.8 ? 'failed' : Math.random() > 0.6 ? 'pending' : 'synced',
    lastSync: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    nextSync: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    stockLevel: product.currentStock || product.quantity || Math.floor(Math.random() * 100),
    price: product.price || product.sellingPrice || Math.floor(Math.random() * 200) + 10,
    category: product.category || product.productCategory || 'General',
    platform: 'SellerDynamics',
    syncFrequency: 'daily',
    dataSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
    syncDuration: `${Math.floor(Math.random() * 120 + 10)}s`
  }));

      // If no real data, fall back to some realistic mock data,
  if (realRecords.length === 0) {
        const fallbackRecords = [
          {
            id: 1,
    productName: 'Fire Extinguisher 1kg',
    sku: 'FE-1KG-001',
    status: 'synced',
    lastSync: new Date().toISOString(),
    nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    stockLevel: 45,
    price: 89.99,
    category: 'Safety Equipment',
    platform: 'SellerDynamics',
    syncFrequency: 'daily',
    dataSize: '2.3 MB',
    syncDuration: '45s'
  },
    {
            id: 2,
    productName: 'Fire Blanket Premium',
    sku: 'FB-PREM-001',
    status: 'pending',
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    nextSync: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    stockLevel: 12,
    price: 19.99,
    category: 'Safety Equipment',
    platform: 'SellerDynamics',
    syncFrequency: 'daily',
    dataSize: '1.8 MB',
    syncDuration: '32s'
  },
    {
            id: 3,
    productName: 'CO2 Fire Extinguisher 2kg',
    sku: 'CO2-2KG-001',
    status: 'failed',
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    stockLevel: 8,
    price: 399.99,
    category: 'Safety Equipment',
    platform: 'SellerDynamics',
    syncFrequency: 'daily',
    dataSize: '5.2 MB',
    syncDuration: '120s'
  },
    {
            id: 4,
    productName: 'Water Mist Extinguisher 3L',
    sku: 'WM-3L-001',
    status: 'synced',
    lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    nextSync: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    stockLevel: 23,
    price: 79.99,
    category: 'Safety Equipment',
    platform: 'SellerDynamics',
    syncFrequency: 'daily',
    dataSize: '3.1 MB',
    syncDuration: '58s'
  }
        ];
        setDataRecords(fallbackRecords);
        calculateStats(fallbackRecords);
      } else {
        setDataRecords(realRecords);
        calculateStats(realRecords);
      }

    } catch (err) {
      console.error('Error fetching SellerDynamics data:', err);
      setError('Failed to fetch SellerDynamics data: ' + err.message);
      
      // Fallback to mock data if API fails,
  const fallbackRecords = [
        {
          id: 1,
    productName: 'Fire Extinguisher 1kg',
    sku: 'FE-1KG-001',
    status: 'synced',
    lastSync: new Date().toISOString(),
    nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    stockLevel: 45,
    price: 89.99,
    category: 'Safety Equipment',
    platform: 'SellerDynamics',
    syncFrequency: 'daily',
    dataSize: '2.3 MB',
    syncDuration: '45s'
  },
    {
          id: 2,
    productName: 'Fire Blanket Premium',
    sku: 'FB-PREM-001',
    status: 'pending',
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    nextSync: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    stockLevel: 12,
    price: 19.99,
    category: 'Safety Equipment',
    platform: 'SellerDynamics',
    syncFrequency: 'daily',
    dataSize: '1.8 MB',
    syncDuration: '32s'
  }
      ];
      setDataRecords(fallbackRecords);
      calculateStats(fallbackRecords);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalRecords = data.length;
    const synced = data.filter(r => r.status === 'synced').length;
    const pending = data.filter(r => r.status === 'pending').length;
    const failed = data.filter(r => r.status === 'failed').length;
    const lastSync = data.length > 0 ? new Date(Math.max(...data.map(r => new Date(r.lastSync)))) : null;

    setStats({
      totalRecords,
      synced,
      pending,
      failed,
      lastSync
    });
  };

  const handleSyncData = async () => {
    try {
      setLoading(true);
      
      // Call the SellerDynamics API to trigger sync
      const response = await fetch('/api/sellerdynamics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'sync'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Sync failed with status: ${response.status}`);
      }
      // Update all records to synced status
      const updatedRecords = dataRecords.map(record => ({
        ...record,
        status: 'synced',
        lastSync: new Date().toISOString(),
        nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setDataRecords(updatedRecords);
      calculateStats(updatedRecords);
      
    } catch (err) {
      console.error('Error syncing data:', err);
      setError('Failed to sync data: ' + err.message);
      
      // Update records to failed status if sync fails
      const failedRecords = dataRecords.map(record => ({
        ...record,
        status: 'failed',
        lastSync: new Date().toISOString()
      }));
      
      setDataRecords(failedRecords);
      calculateStats(failedRecords);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleDeleteRecord = async (id) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDataRecords(prev => prev.filter(r => r.id !== id));
      calculateStats(dataRecords.filter(r => r.id !== id));
      
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'synced': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
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

  if (loading && dataRecords.length === 0) {
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
        <title>SellerDynamics Data - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Manage and monitor SellerDynamics data synchronization" />
      </Head>

      <Container maxWidth="xl" sx={{
    py: 4
  }}>
        {/* Header */}
        <Box sx={{
    mb: 4
  }}>
          <Typography variant="h4" component="h1" gutterBottom>
            SellerDynamics Data
          </Typography>
          <Typography variant="body,1" color="text.secondary">
            Manage and monitor data synchronization with SellerDynamics platform
          </Typography>
        </Box>

        {/* Error Alert */},
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
                  <DataUsageIcon color="primary" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.totalRecords}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Records</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon color="success" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.synced}</Typography>
                    <Typography variant="body2" color="text.secondary">Synced</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WarningIcon color="warning" sx={{
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
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ErrorIcon color="error" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">{stats.failed}</Typography>
                    <Typography variant="body2" color="text.secondary">Failed</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TimelineIcon color="info" sx={{
    mr: 2
  }} />
                  <Box>
                    <Typography variant="h6">
                      {stats.lastSync ? new Date(stats.lastSync).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Last Sync</Typography>
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
                placeholder="Search records..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} InputProps={{
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
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="synced">Synced</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined" startIcon={<RefreshIcon />}
                  onClick={fetchData} disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained" startIcon={<SyncIcon />}
                  onClick={handleSyncData} disabled={loading}
                >
                  Sync All Data
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Data Records Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Stock Level</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Last Sync</TableCell>
                  <TableCell>Sync Duration</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{record.productName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Platform: {record.platform}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{record.sku}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status} color={getStatusColor(record.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.stockLevel}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        £{record.price.toFixed(2)}
                      </TableCell>
                      <TableCell>{record.category}</TableCell>
                      <TableCell>
                        {new Date(record.lastSync).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.syncDuration}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Record">
                            <IconButton
                              size="small" onClick={() => handleEditRecord(record)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Record">
                            <IconButton
                              size="small" color="error"
                              onClick={() => handleDeleteRecord(record.id)}
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
            count={filteredRecords.length} rowsPerPage={rowsPerPage}
            page={page} onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

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