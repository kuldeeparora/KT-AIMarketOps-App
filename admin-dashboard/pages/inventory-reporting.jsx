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
  Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon, Download as DownloadIcon, Upload as UploadIcon, Visibility as VisibilityIcon, Settings as SettingsIcon, TrendingUp as TrendingUpIcon, Inventory as InventoryIcon, ShoppingCart as CartIcon, Analytics as AnalyticsIcon, AutoAwesome as AutoAwesomeIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon, ExpandMore as ExpandMoreIcon, Assessment as AssessmentIcon, BarChart as BarChartIcon, PieChart as PieChartIcon, Timeline as TimelineIcon, Print as PrintIcon, Share as ShareIcon
} from '@mui/icons-material';
import Head from 'next/head';

export default function InventoryReporting() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalReports: 0,
    scheduled: 0,
    completed: 0,
    pending: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Filter reports based on search term and type
    let filtered = reports;
    
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(report => report.type === filterType);
    }
    
    setFilteredReports(filtered);
  }, [reports, searchTerm, filterType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data for reports
      const mockReports = [
        {
          id: 1,
          title: 'Monthly Inventory Summary',
          type: 'summary',
          status: 'completed',
          createdDate: '2024-01-01',
          lastRun: '2024-01-31',
          nextRun: '2024-02-29',
          schedule: 'monthly',
          totalProducts: 1250,
          totalValue: 45000.00,
          lowStockItems: 15,
          outOfStockItems: 3,
          revenueImpact: 12500.00
        },
        {
          id: 2,
          title: 'Weekly Stock Movement',
          type: 'movement',
          status: 'scheduled',
          createdDate: '2024-01-15',
          lastRun: '2024-01-28',
          nextRun: '2024-02-04',
          schedule: 'weekly',
          totalProducts: 1250,
          totalValue: 45000.00,
          lowStockItems: 15,
          outOfStockItems: 3,
          revenueImpact: 8500.00
        },
        {
          id: 3,
          title: 'Daily Low Stock Alert',
          type: 'alert',
          status: 'pending',
          createdDate: '2024-01-20',
          lastRun: '2024-01-30',
          nextRun: '2024-02-01',
          schedule: 'daily',
          totalProducts: 1250,
          totalValue: 45000.00,
          lowStockItems: 15,
          outOfStockItems: 3,
          revenueImpact: 3200.00
        },
        {
          id: 4,
          title: 'Quarterly Performance Analysis',
          type: 'analysis',
          status: 'completed',
          createdDate: '2024-01-01',
          lastRun: '2024-01-31',
          nextRun: '2024-04-30',
          schedule: 'quarterly',
          totalProducts: 1250,
          totalValue: 45000.00,
          lowStockItems: 15,
          outOfStockItems: 3,
          revenueImpact: 25000.00
        }
      ];

      setReports(mockReports);
      calculateStats(mockReports);

    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalReports = data.length;
    const scheduled = data.filter(r => r.status === 'scheduled').length;
    const completed = data.filter(r => r.status === 'completed').length;
    const pending = data.filter(r => r.status === 'pending').length;
    const totalRevenue = data.reduce((sum, r) => sum + r.revenueImpact, 0);

    setStats({
      totalReports,
      scheduled,
      completed,
      pending,
      totalRevenue
    });
  };

  const handleCreateReport = () => {
    setSelectedReport(null);
    setDialogOpen(true);
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleDeleteReport = async (id) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prev => prev.filter(r => r.id !== id));
      calculateStats(reports.filter(r => r.id !== id));
      
    } catch (err) {
      console.error('Error deleting report:', err);
      setError('Failed to delete report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (report) => {
    try {
      setLoading(true);
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock export functionality
      console.log(`Exporting report: ${report.title}`);
    } catch (err) {
      console.error('Error exporting report:', err);
      setError('Failed to export report');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'scheduled': return 'info';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'summary': return 'primary';
      case 'movement': return 'secondary';
      case 'alert': return 'warning';
      case 'analysis': return 'success';
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

  if (loading && reports.length === 0) {
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
        <title>Inventory Reporting - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Comprehensive inventory reporting and analytics" />
      </Head>

      <Container maxWidth="xl" sx={{
        py: 4
      }}>
        {/* Header */}
        <Box sx={{
          mb: 4
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Inventory Reporting
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate comprehensive reports and analytics for inventory management
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{
            mb: 3
          }}>
            {error}
          </Alert>
        )}
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{
          mb: 4
        }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AssessmentIcon color="primary" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.totalReports}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Reports</Typography>
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
                    <Typography variant="h6">{stats.completed}</Typography>
                    <Typography variant="body2" color="text.secondary">Completed</Typography>
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
                  <AnalyticsIcon color="info" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.scheduled}</Typography>
                    <Typography variant="body2" color="text.secondary">Scheduled</Typography>
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
                    <Typography variant="h6">£{stats.totalRevenue.toFixed(0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Revenue Impact</Typography>
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
                placeholder="Search reports..." value={searchTerm}
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
                <InputLabel>Type Filter</InputLabel>
                <Select
                  value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  label="Type Filter"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="summary">Summary</MenuItem>
                  <MenuItem value="movement">Movement</MenuItem>
                  <MenuItem value="alert">Alert</MenuItem>
                  <MenuItem value="analysis">Analysis</MenuItem>
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
                  variant="contained" startIcon={<AddIcon />}
                  onClick={handleCreateReport}
                >
                  Create Report
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Reports Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell align="right">Total Products</TableCell>
                  <TableCell align="right">Total Value</TableCell>
                  <TableCell align="right">Revenue Impact</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{report.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Created: {new Date(report.createdDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.type} color={getTypeColor(report.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.status} color={getStatusColor(report.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{
                          textTransform: 'capitalize'
                        }}>
                          {report.schedule}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {report.totalProducts.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        £{report.totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        £{report.revenueImpact.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(report.lastRun).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Report">
                            <IconButton size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Export Report">
                            <IconButton
                              size="small" onClick={() => handleExportReport(report)}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Report">
                            <IconButton
                              size="small" onClick={() => handleEditReport(report)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Report">
                            <IconButton
                              size="small" color="error"
                              onClick={() => handleDeleteReport(report.id)}
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
            count={filteredReports.length} rowsPerPage={rowsPerPage}
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