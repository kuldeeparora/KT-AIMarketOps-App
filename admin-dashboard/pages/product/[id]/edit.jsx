import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
        name: 'Premium Widget',
        sku: 'WID-001',
        category: 'Electronics',
        price: '29.99',
        stock: '150',
        status: 'active',
        description: 'High-quality premium widget with advanced features.'
      };
      
      setProduct(mockProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, always succeed
      router.push(`/product/${id}`);
    } catch (error) {
      setError('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
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

  return (
    <>
      <Head>
        <title>Edit Product - Kent Traders Admin</title>
        <meta name="description" content="Edit product details" />
      </Head>

      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              sx={{ mb: 2 }}
            >
              Back to Product
            </Button>
            
            <Typography variant="h4" component="h1" gutterBottom>
              Edit Product
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update product information and settings
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="SKU"
                    name="sku"
                    value={product.sku}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={product.category}
                      label="Category"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Tools">Tools</MenuItem>
                      <MenuItem value="Clothing">Clothing</MenuItem>
                      <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: '£',
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    value={product.stock}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={product.status}
                      label="Status"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="active">
                        <Chip label="Active" color="success" size="small" />
                      </MenuItem>
                      <MenuItem value="inactive">
                        <Chip label="Inactive" color="error" size="small" />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Layout>
    </>
  );
}
