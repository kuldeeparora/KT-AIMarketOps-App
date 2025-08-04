import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProduct = {
        id: id,
        name: 'Premium Widget',
        sku: 'WID-001',
        category: 'Electronics',
        price: 29.99,
        stock: 150,
        status: 'active',
        description: 'High-quality premium widget with advanced features.',
        sales: 45,
        revenue: 1349.55
      };
      
      setProduct(mockProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading product details...
          </Typography>
        </Container>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Typography variant="h6" color="error">
            Product not found
          </Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} - Kent Traders Admin</title>
        <meta name="description" content={`Product details for ${product.name}`} />
      </Head>

      <Layout>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ mb: 2 }}
            >
              Back to Products
            </Button>
            
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Product ID: {product.id} | SKU: {product.sku}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Product Details */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Product Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {product.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      SKU
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {product.sku}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {product.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={product.status}
                      color={product.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {product.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Performance Stats */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Performance
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoneyIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Price"
                      secondary={`£${product.price.toFixed(2)}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <InventoryIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Stock"
                      secondary={`${product.stock} units`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Sales"
                      secondary={`${product.sales} units`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoneyIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Revenue"
                      secondary={`£${product.revenue.toFixed(2)}`}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                  >
                    Edit Product
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Delete Product
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}
