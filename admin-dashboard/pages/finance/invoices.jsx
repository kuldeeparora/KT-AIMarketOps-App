import React, { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Money as MoneyIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

export default function Invoices() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({});
  const [addInvoiceDialog, setAddInvoiceDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoicesData();
  }, []);

  const fetchInvoicesData = async () => {
    setLoading(true);
    try {
      // Mock invoices data
      const mockInvoices = [
        {
          id: 'INV-001',
          customer: 'ABC Company',
          amount: 2500,
          status: 'paid',
          dueDate: '2024-01-15',
          issueDate: '2024-01-01',
          items: [
            { description: 'Premium Widget Pro', quantity: 10, price: 250 }
          ]
        },
        {
          id: 'INV-002',
          customer: 'XYZ Corp',
          amount: 1800,
          status: 'pending',
          dueDate: '2024-01-20',
          issueDate: '2024-01-05',
          items: [
            { description: 'Smart Gadget Plus', quantity: 5, price: 360 }
          ]
        },
        {
          id: 'INV-003',
          customer: 'Tech Solutions Ltd',
          amount: 3200,
          status: 'overdue',
          dueDate: '2024-01-10',
          issueDate: '2023-12-20',
          items: [
            { description: 'Enterprise Bundle', quantity: 2, price: 1600 }
          ]
        },
        {
          id: 'INV-004',
          customer: 'Global Industries',
          amount: 4500,
          status: 'paid',
          dueDate: '2024-01-25',
          issueDate: '2024-01-10',
          items: [
            { description: 'Professional Suite', quantity: 3, price: 1500 }
          ]
        },
        {
          id: 'INV-005',
          customer: 'Startup Ventures',
          amount: 1200,
          status: 'pending',
          dueDate: '2024-01-30',
          issueDate: '2024-01-12',
          items: [
            { description: 'Basic Package', quantity: 4, price: 300 }
          ]
        }
      ];

      const mockStats = {
        totalInvoices: 5,
        totalAmount: 12000,
        paidAmount: 7000,
        pendingAmount: 3000,
        overdueAmount: 3200,
        paidCount: 2,
        pendingCount: 2,
        overdueCount: 1
      };

      setInvoices(mockInvoices);
      setStats(mockStats);
    } catch (err) {
      setError('Failed to load invoices data');
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircleIcon color="success" />;
      case 'pending': return <WarningIcon color="warning" />;
      case 'overdue': return <ErrorIcon color="error" />;
      default: return <WarningIcon color="warning" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Invoices - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Invoice management and tracking" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h4" component="h1">
                Invoice Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create, manage, and track your invoices
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddInvoiceDialog(true)}
            >
              Create Invoice
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ReceiptIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{stats.totalInvoices}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Invoices</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <MoneyIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">£{stats.totalAmount?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PaymentIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">£{stats.paidAmount?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Paid Amount</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WarningIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">£{stats.overdueAmount?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Overdue Amount</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Invoice Status Breakdown */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Invoice Status
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Paid (${stats.paidCount})`}
                      secondary={`£${stats.paidAmount?.toLocaleString()}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Pending (${stats.pendingCount})`}
                      secondary={`£${stats.pendingAmount?.toLocaleString()}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ErrorIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Overdue (${stats.overdueCount})`}
                      secondary={`£${stats.overdueAmount?.toLocaleString()}`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Invoices
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Issue Date</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.id}</TableCell>
                          <TableCell>{invoice.customer}</TableCell>
                          <TableCell>£{invoice.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={invoice.status}
                              color={getStatusColor(invoice.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => setSelectedInvoice(invoice)}>
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton>
                              <DownloadIcon />
                            </IconButton>
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* All Invoices Table */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">All Invoices</Typography>
              <Box display="flex" gap={1}>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Export
                </Button>
                <Button variant="outlined" startIcon={<PrintIcon />}>
                  Print
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>£{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={invoice.status}
                          color={getStatusColor(invoice.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => setSelectedInvoice(invoice)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton>
                          <DownloadIcon />
                        </IconButton>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>

      {/* Add Invoice Dialog */}
      <Dialog open={addInvoiceDialog} onClose={() => setAddInvoiceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Invoice</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Customer Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Customer Email" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Invoice Description" multiline rows={3} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Amount" type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Due Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddInvoiceDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Invoice</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
} 