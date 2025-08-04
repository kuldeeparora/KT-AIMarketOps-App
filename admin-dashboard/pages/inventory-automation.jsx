import React, { useState, useEffect } from 'react';
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
  Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon, PlayArrow as PlayIcon, Stop as StopIcon, Pause as PauseIcon, Visibility as VisibilityIcon, Settings as SettingsIcon, TrendingUp as TrendingUpIcon, Inventory as InventoryIcon, ShoppingCart as CartIcon, Analytics as AnalyticsIcon, AutoAwesome as AutoAwesomeIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon, ExpandMore as ExpandMoreIcon, Schedule as ScheduleIcon, Timer as TimerIcon, Notifications as NotificationsIcon, CloudUpload as CloudUploadIcon, CloudDownload as CloudDownloadIcon, Sync as SyncIcon
} from '@mui/icons-material';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function InventoryAutomation() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [automations, setAutomations] = useState([]);
  const [filteredAutomations, setFilteredAutomations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalAutomations: 0,
    active: 0,
    paused: 0,
    completed: 0,
    totalSavings: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('🔍 Filtering automations. Original:', automations.length, 'Search:', searchTerm, 'Filter:', filterType);
    
    // Filter automations based on search term and type,
    let filtered = automations;
    
    if (searchTerm) {
      filtered = filtered.filter(automation => 
        automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        automation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        automation.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(automation => automation.type === filterType);
    }
    
    console.log('🔍 Filtered automations:', filtered.length);
    setFilteredAutomations(filtered);
  }, [automations, searchTerm, filterType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching automation data...');

      // Fetch real automation data from API
      const response = await fetch('/api/automations?_t=' + Date.now(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('📊 API Response:', result);

      if (result.success) {
        console.log('✅ Setting automations data:', result.data);
        setAutomations(result.data);
        calculateStats(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch automation data');
      }

    } catch (err) {
      console.error('❌ Error fetching automation data:', err);
      setError('Failed to fetch automation data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    console.log('📈 Calculating stats for data:', data);
    
    const totalAutomations = data.length;
    const active = data.filter(a => a.status === 'active').length;
    const paused = data.filter(a => a.status === 'paused').length;
    const completed = data.filter(a => a.status === 'completed').length;
    const totalSavings = data.reduce((sum, a) => sum + a.costSavings, 0);

    const stats = {
      totalAutomations,
      active,
      paused,
      completed,
      totalSavings
    };

    console.log('📊 Calculated stats:', stats);
    setStats(stats);
  };

  const handleCreateAutomation = () => {
    setSelectedAutomation(null);
    setDialogOpen(true);
  };

  const handleEditAutomation = (automation) => {
    setSelectedAutomation(automation);
    setDialogOpen(true);
  };

  const handleToggleAutomation = async (automation) => {
    try {
      setLoading(true);
      
      // Update automation status via API
      const response = await fetch('/api/automations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: automation.id,
          updates: {
            status: automation.status === 'active' ? 'paused' : 'active'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result.success) {
        // Update local state,
        const newStatus = automation.status === 'active' ? 'paused' : 'active';
        setAutomations(prev => 
          prev.map(a => a.id === automation.id ? { ...a, status: newStatus } : a));
        
        calculateStats(automations.map(a => a.id === automation.id ? { ...a, status: newStatus } : a));
      } else {
        throw new Error(result.error || 'Failed to toggle automation');
      }
      
    } catch (err) {
      console.error('Error toggling automation:', err);
      setError('Failed to toggle automation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAutomation = async (id) => {
    try {
      setLoading(true);
      
      // Delete automation via API,
      const response = await fetch('/api/automations', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result.success) {
        // Update local state,
        setAutomations(prev => prev.filter(a => a.id !== id));
        calculateStats(automations.filter(a => a.id !== id));
      } else {
        throw new Error(result.error || 'Failed to delete automation');
      }
      
    } catch (err) {
      console.error('Error deleting automation:', err);
      setError('Failed to delete automation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'reorder': return 'primary';
      case 'pricing': return 'secondary';
      case 'sync': return 'info';
      case 'forecasting': return 'success';
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

  if (loading && automations.length === 0) {
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
        <title>Inventory Automation - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Automated inventory management workflows and processes" />
      </Head>

      <Container maxWidth="xl" sx={{
        py: 4
      }}>
        {/* Header */}
        <Box sx={{
          mb: 4
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Inventory Automation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage automated workflows and processes for inventory optimization
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
                  <AutoAwesomeIcon color="primary" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.totalAutomations}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Automations</Typography>
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
                    <Typography variant="h6">{stats.active}</Typography>
                    <Typography variant="body2" color="text.secondary">Active</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PauseIcon color="warning" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">{stats.paused}</Typography>
                    <Typography variant="body2" color="text.secondary">Paused</Typography>
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
                  <TrendingUpIcon color="success" sx={{
                    mr: 2
                  }} />
                  <Box>
                    <Typography variant="h6">£{stats.totalSavings.toFixed(0)}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Savings</Typography>
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
                placeholder="Search automations..."
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
                  <MenuItem value="reorder">Reorder</MenuItem>
                  <MenuItem value="pricing">Pricing</MenuItem>
                  <MenuItem value="sync">Sync</MenuItem>
                  <MenuItem value="forecasting">Forecasting</MenuItem>
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
                  onClick={handleCreateAutomation}
                >
                  Create Automation
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Automations Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Automation Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Trigger</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell align="right">Success Rate</TableCell>
                  <TableCell align="right">Time Saved (hrs)</TableCell>
                  <TableCell align="right">Cost Savings</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {console.log('🔍 Rendering automations:', filteredAutomations)},
                {filteredAutomations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((automation) => (
                    <TableRow key={automation.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{automation.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {automation.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={automation.type}
                          color={getTypeColor(automation.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={automation.status}
                          color={getStatusColor(automation.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{
                          textTransform: 'capitalize'
                        }}>
                          {automation.trigger.replace('_', ' ')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{
                          textTransform: 'capitalize'
                        }}>
                          {automation.frequency.replace('_', ' ')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {(automation.successRate * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell align="right">
                        {automation.timeSaved}
                      </TableCell>
                      <TableCell align="right">
                        £{automation.costSavings.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(automation.lastRun).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <Tooltip title={automation.status === 'active' ? 'Pause Automation' : 'Start Automation'}>
                            <IconButton
                              size="small" onClick={() => handleToggleAutomation(automation)}
                              color={automation.status === 'active' ? 'warning' : 'success'}
                            >
                              {automation.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Automation">
                            <IconButton
                              size="small" onClick={() => handleEditAutomation(automation)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Automation">
                            <IconButton
                              size="small" color="error"
                              onClick={() => handleDeleteAutomation(automation.id)}
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
            count={filteredAutomations.length} rowsPerPage={rowsPerPage}
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