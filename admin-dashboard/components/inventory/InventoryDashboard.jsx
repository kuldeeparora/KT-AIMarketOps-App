import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Inventory,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  TrendingUp,
  Category,
  Store
} from '@mui/icons-material';

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      const data = await response.json();
      
      if (data.success) {
        setInventory(data.data);
      } else {
        setError(data.error || 'Failed to fetch inventory data');
      }
    } catch (err) {
      setError('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'success';
      case 'moderate': return 'info';
      case 'low': return 'warning';
      case 'critical': return 'error';
      case 'out-of-stock': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <CheckCircle fontSize="small" />;
      case 'moderate': return <TrendingUp fontSize="small" />;
      case 'low': return <Warning fontSize="small" />;
      case 'critical': return <Error fontSize="small" />;
      case 'out-of-stock': return <Error fontSize="small" />;
      default: return <Inventory fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        <IconButton color="inherit" size="small" onClick={fetchInventory}>
          <Refresh />
        </IconButton>
      }>
        {error}
      </Alert>
    );
  }

  if (!inventory) {
    return <Alert severity="info">No inventory data available</Alert>;
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Inventory Dashboard
        </Typography>
        <Tooltip title="Refresh inventory data">
          <IconButton onClick={fetchInventory}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Inventory color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Items
                  </Typography>
                  <Typography variant="h4">
                    {inventory.totalItems}
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
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Stock
                  </Typography>
                  <Typography variant="h4">
                    {inventory.totalStock}
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
                <Warning color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4">
                    {inventory.lowStockItems}
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
                <Error color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Out of Stock
                  </Typography>
                  <Typography variant="h4">
                    {inventory.outOfStockItems}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category and Marketplace Breakdown */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
                Categories
              </Typography>
              {Object.entries(inventory.categories).map(([category, data]) => (
                <Box key={category} display="flex" justifyContent="space-between" mb={1}>
                  <Typography>{category}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.count} items • {data.stock} stock
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Store sx={{ mr: 1, verticalAlign: 'middle' }} />
                Marketplaces
              </Typography>
              {Object.entries(inventory.marketplaces).map(([marketplace, data]) => (
                <Box key={marketplace} display="flex" justifyContent="space-between" mb={1}>
                  <Typography>{marketplace}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.count} items • {data.stock} stock
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Product Inventory
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Marketplace</TableCell>
                  <TableCell align="right">Stock Level</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{product.name}</Typography>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.marketplace}</TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        color={product.stockLevel < 10 ? 'error' : 'textPrimary'}
                      >
                        {product.stockLevel}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">£{product.price}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(product.status)}
                        label={product.status}
                        color={getStatusColor(product.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {product.reorderNeeded && (
                        <Chip
                          label="Reorder"
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InventoryDashboard; 