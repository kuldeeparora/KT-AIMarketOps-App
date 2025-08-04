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
  Tabs,
  Tab,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CreditCardIcon,
  AccountBox as AccountBoxIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';

export default function Finance() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [addInvoiceDialog, setAddInvoiceDialog] = useState(false);
  const [addExpenseDialog, setAddExpenseDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // Mock financial data
      const mockFinancialData = {
        totalRevenue: 125000,
        totalExpenses: 85000,
        netProfit: 40000,
        profitMargin: 32,
        outstandingInvoices: 15600,
        overdueInvoices: 3200,
        monthlyGrowth: 12.5,
        cashFlow: 18500,
        topRevenueSources: [
          { source: 'Product Sales', amount: 85000, percentage: 68 },
          { source: 'Services', amount: 25000, percentage: 20 },
          { source: 'Subscriptions', amount: 15000, percentage: 12 }
        ],
        monthlyData: [
          { month: 'Jan', revenue: 95000, expenses: 72000, profit: 23000 },
          { month: 'Feb', revenue: 105000, expenses: 78000, profit: 27000 },
          { month: 'Mar', revenue: 115000, expenses: 82000, profit: 33000 },
          { month: 'Apr', revenue: 125000, expenses: 85000, profit: 40000 }
        ]
      };

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
        }
      ];

      const mockExpenses = [
        {
          id: 1,
          category: 'Inventory',
          description: 'Raw materials purchase',
          amount: 15000,
          date: '2024-01-15',
          status: 'approved',
          receipt: 'receipt-001.pdf'
        },
        {
          id: 2,
          category: 'Marketing',
          description: 'Google Ads campaign',
          amount: 2500,
          date: '2024-01-10',
          status: 'pending',
          receipt: 'receipt-002.pdf'
        },
        {
          id: 3,
          category: 'Operations',
          description: 'Office supplies',
          amount: 800,
          date: '2024-01-12',
          status: 'approved',
          receipt: 'receipt-003.pdf'
        }
      ];

      const mockAccounts = [
        {
          id: 1,
          name: 'Main Business Account',
          type: 'checking',
          balance: 45000,
          currency: 'GBP',
          status: 'active'
        },
        {
          id: 2,
          name: 'Savings Account',
          type: 'savings',
          balance: 25000,
          currency: 'GBP',
          status: 'active'
        },
        {
          id: 3,
          name: 'Tax Reserve',
          type: 'reserve',
          balance: 12000,
          currency: 'GBP',
          status: 'active'
        }
      ];

      setFinancialData(mockFinancialData);
      setInvoices(mockInvoices);
      setExpenses(mockExpenses);
      setAccounts(mockAccounts);
    } catch (err) {
      setError('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'approved': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircleIcon color="success" />;
      case 'pending': return <WarningIcon color="warning" />;
      case 'overdue': return <WarningIcon color="error" />;
      case 'approved': return <CheckCircleIcon color="success" />;
      default: return <WarningIcon color="warning" />;
    }
  };

  const tabs = [
    { label: 'Overview', icon: <AssessmentIcon /> },
    { label: 'P&L Statement', icon: <TrendingUpIcon /> },
    { label: 'Invoices', icon: <ReceiptIcon /> },
    { label: 'Expenses', icon: <PaymentIcon /> },
    { label: 'Accounts', icon: <AccountBalanceIcon /> },
    { label: 'Cash Flow', icon: <TimelineIcon /> },
    { label: 'Reports', icon: <BarChartIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> }
  ];

  if (loading && Object.keys(financialData).length === 0) {
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
        <title>Finance - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Financial management and accounting" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Financial Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your finances, invoices, expenses, and financial reports
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Financial Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <MoneyIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">£{financialData.totalRevenue?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PaymentIcon color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">£{financialData.totalExpenses?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">£{financialData.netProfit?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Net Profit</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccountBalanceIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{financialData.profitMargin}%</Typography>
                    <Typography variant="body2" color="text.secondary">Profit Margin</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} icon={tab.icon} />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Revenue Sources */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Sources
                  </Typography>
                  <List>
                    {financialData.topRevenueSources?.map((source, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={source.source}
                          secondary={`£${source.amount.toLocaleString()} (${source.percentage}%)`}
                        />
                        <LinearProgress
                          variant="determinate"
                          value={source.percentage}
                          sx={{ width: 100, mr: 2 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Outstanding Invoices */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Outstanding Invoices
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" color="warning.main">
                      £{financialData.outstandingInvoices?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total outstanding amount
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="error.main">
                      £{financialData.overdueInvoices?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overdue invoices
                    </Typography>
                  </Box>
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Create Invoice
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profit & Loss Statement
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Revenue</strong></TableCell>
                      <TableCell align="right">£{financialData.totalRevenue?.toLocaleString()}</TableCell>
                      <TableCell align="right">100%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Cost of Goods Sold</strong></TableCell>
                      <TableCell align="right">£{(financialData.totalRevenue * 0.6).toLocaleString()}</TableCell>
                      <TableCell align="right">60%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Gross Profit</strong></TableCell>
                      <TableCell align="right">£{(financialData.totalRevenue * 0.4).toLocaleString()}</TableCell>
                      <TableCell align="right">40%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Operating Expenses</strong></TableCell>
                      <TableCell align="right">£{financialData.totalExpenses?.toLocaleString()}</TableCell>
                      <TableCell align="right">68%</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'success.light' }}>
                      <TableCell><strong>Net Profit</strong></TableCell>
                      <TableCell align="right"><strong>£{financialData.netProfit?.toLocaleString()}</strong></TableCell>
                      <TableCell align="right"><strong>{financialData.profitMargin}%</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Invoices</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddInvoiceDialog(true)}
                >
                  Create Invoice
                </Button>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Expenses</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddExpenseDialog(true)}
                >
                  Add Expense
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Receipt</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <Chip label={expense.category} size="small" />
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>£{expense.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={expense.status}
                            color={getStatusColor(expense.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" startIcon={<DownloadIcon />}>
                            View
                          </Button>
                        </TableCell>
                        <TableCell>
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
        )}

        {activeTab === 4 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bank Accounts
              </Typography>
              <Grid container spacing={3}>
                {accounts.map((account) => (
                  <Grid item xs={12} md={4} key={account.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">{account.name}</Typography>
                        </Box>
                        <Typography variant="h4" color="primary">
                          £{account.balance.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {account.type} • {account.currency}
                        </Typography>
                        <Chip
                          label={account.status}
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeTab === 5 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cash Flow Overview
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Cash flow chart placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Cash Flow
                  </Typography>
                  <List>
                    {financialData.monthlyData?.map((month, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={month.month}
                          secondary={`Revenue: £${month.revenue.toLocaleString()} | Expenses: £${month.expenses.toLocaleString()}`}
                        />
                        <Typography
                          variant="h6"
                          color={month.profit > 0 ? 'success.main' : 'error.main'}
                        >
                          £{month.profit.toLocaleString()}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 6 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Financial Reports
                  </Typography>
                  <List>
                    <ListItem button>
                      <ListItemIcon><BarChartIcon /></ListItemIcon>
                      <ListItemText primary="Profit & Loss Report" secondary="Monthly P&L statement" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon><PieChartIcon /></ListItemIcon>
                      <ListItemText primary="Revenue Analysis" secondary="Revenue breakdown by source" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon><TimelineIcon /></ListItemIcon>
                      <ListItemText primary="Cash Flow Report" secondary="Cash flow analysis" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon><AssessmentIcon /></ListItemIcon>
                      <ListItemText primary="Expense Report" secondary="Detailed expense breakdown" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Export Options
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<DownloadIcon />}>
                        PDF Report
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<DownloadIcon />}>
                        Excel Export
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<DownloadIcon />}>
                        CSV Data
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<DownloadIcon />}>
                        QuickBooks
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 7 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Invoice Settings
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-generate invoices"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Send payment reminders"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Late payment fees"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Expense Settings
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Require receipts"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Auto-categorize expenses"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Expense approval workflow"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
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

      {/* Add Expense Dialog */}
      <Dialog open={addExpenseDialog} onClose={() => setAddExpenseDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  <MenuItem value="inventory">Inventory</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                  <MenuItem value="utilities">Utilities</MenuItem>
                  <MenuItem value="travel">Travel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Amount" type="number" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="outlined" fullWidth component="label">
                Upload Receipt
                <input type="file" hidden />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddExpenseDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Expense</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
} 