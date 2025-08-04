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
  ListItemText
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Money as MoneyIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

export default function PnLStatement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pnlData, setPnlData] = useState({});
  const [period, setPeriod] = useState('month');
  const [exportDialog, setExportDialog] = useState(false);

  useEffect(() => {
    fetchPnLData();
  }, [period]);

  const fetchPnLData = async () => {
    setLoading(true);
    try {
      // Mock P&L data
      const mockPnLData = {
        period: period,
        revenue: {
          total: 125000,
          breakdown: [
            { category: 'Product Sales', amount: 85000, percentage: 68 },
            { category: 'Services', amount: 25000, percentage: 20 },
            { category: 'Subscriptions', amount: 15000, percentage: 12 }
          ]
        },
        expenses: {
          total: 85000,
          breakdown: [
            { category: 'Cost of Goods Sold', amount: 45000, percentage: 53 },
            { category: 'Operating Expenses', amount: 25000, percentage: 29 },
            { category: 'Marketing', amount: 8000, percentage: 9 },
            { category: 'Administrative', amount: 7000, percentage: 8 }
          ]
        },
        grossProfit: 40000,
        netProfit: 40000,
        profitMargin: 32,
        growth: {
          revenue: 15.3,
          profit: 12.8,
          expenses: 8.2
        },
        monthlyData: [
          { month: 'Jan', revenue: 95000, expenses: 72000, profit: 23000 },
          { month: 'Feb', revenue: 105000, expenses: 78000, profit: 27000 },
          { month: 'Mar', revenue: 115000, expenses: 82000, profit: 33000 },
          { month: 'Apr', revenue: 125000, expenses: 85000, profit: 40000 }
        ]
      };

      setPnlData(mockPnLData);
    } catch (err) {
      setError('Failed to load P&L data');
    } finally {
      setLoading(false);
    }
  };

  const getGrowthColor = (value) => {
    return value > 0 ? 'success' : 'error';
  };

  const getGrowthIcon = (value) => {
    return value > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;
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
        <title>P&L Statement - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Profit and Loss statement" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h4" component="h1">
                Profit & Loss Statement
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive financial performance analysis
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <FormControl size="small">
                <InputLabel>Period</InputLabel>
                <Select
                  value={period}
                  label="Period"
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => setExportDialog(true)}>
                Export
              </Button>
              <Button variant="outlined" startIcon={<PrintIcon />}>
                Print
              </Button>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <MoneyIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">£{pnlData.revenue?.total?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      {getGrowthIcon(pnlData.growth?.revenue)}
                      <Typography 
                        variant="body2" 
                        color={getGrowthColor(pnlData.growth?.revenue)}
                        sx={{ ml: 0.5 }}
                      >
                        {pnlData.growth?.revenue}%
                      </Typography>
                    </Box>
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
                    <Typography variant="h6">£{pnlData.expenses?.total?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      {getGrowthIcon(pnlData.growth?.expenses)}
                      <Typography 
                        variant="body2" 
                        color={getGrowthColor(pnlData.growth?.expenses)}
                        sx={{ ml: 0.5 }}
                      >
                        {pnlData.growth?.expenses}%
                      </Typography>
                    </Box>
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
                    <Typography variant="h6">£{pnlData.netProfit?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Net Profit</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      {getGrowthIcon(pnlData.growth?.profit)}
                      <Typography 
                        variant="body2" 
                        color={getGrowthColor(pnlData.growth?.profit)}
                        sx={{ ml: 0.5 }}
                      >
                        {pnlData.growth?.profit}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AssessmentIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{pnlData.profitMargin}%</Typography>
                    <Typography variant="body2" color="text.secondary">Profit Margin</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={pnlData.profitMargin}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* P&L Statement Table */}
        <Card sx={{ mb: 4 }}>
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
                    <TableCell align="right">£{pnlData.revenue?.total?.toLocaleString()}</TableCell>
                    <TableCell align="right">100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Cost of Goods Sold</strong></TableCell>
                    <TableCell align="right">£{(pnlData.revenue?.total * 0.36).toLocaleString()}</TableCell>
                    <TableCell align="right">36%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Gross Profit</strong></TableCell>
                    <TableCell align="right">£{pnlData.grossProfit?.toLocaleString()}</TableCell>
                    <TableCell align="right">64%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Operating Expenses</strong></TableCell>
                    <TableCell align="right">£{(pnlData.expenses?.total * 0.47).toLocaleString()}</TableCell>
                    <TableCell align="right">30%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Marketing Expenses</strong></TableCell>
                    <TableCell align="right">£{(pnlData.expenses?.total * 0.09).toLocaleString()}</TableCell>
                    <TableCell align="right">6%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Administrative Expenses</strong></TableCell>
                    <TableCell align="right">£{(pnlData.expenses?.total * 0.08).toLocaleString()}</TableCell>
                    <TableCell align="right">5%</TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: 'success.light' }}>
                    <TableCell><strong>Net Profit</strong></TableCell>
                    <TableCell align="right"><strong>£{pnlData.netProfit?.toLocaleString()}</strong></TableCell>
                    <TableCell align="right"><strong>{pnlData.profitMargin}%</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Revenue and Expense Breakdown */}
        <Grid container spacing={3}>
          {/* Revenue Breakdown */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Breakdown
                </Typography>
                <List>
                  {pnlData.revenue?.breakdown?.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.category}
                        secondary={`£${item.amount.toLocaleString()} (${item.percentage}%)`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{ width: 100 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Expense Breakdown */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expense Breakdown
                </Typography>
                <List>
                  {pnlData.expenses?.breakdown?.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.category}
                        secondary={`£${item.amount.toLocaleString()} (${item.percentage}%)`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{ width: 100 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Monthly Trend */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Performance Trend
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Monthly trend chart placeholder</Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Export Dialog */}
      <Dialog open={exportDialog} onClose={() => setExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export P&L Statement</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Export Format</InputLabel>
                <Select label="Export Format">
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Include charts and graphs"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Include detailed breakdown"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Cancel</Button>
          <Button variant="contained">Export</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
} 