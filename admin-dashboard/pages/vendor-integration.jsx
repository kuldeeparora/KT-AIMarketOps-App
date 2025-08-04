import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  LinearProgress,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  Api as ApiIcon,
  Sync as SyncIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  DataUsage as DataUsageIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  AttachMoney as AttachMoneyIcon,
  Euro as EuroIcon,
  CurrencyPound as CurrencyPoundIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Help as HelpIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon,
  SupervisedUserCircle as SupervisedUserIcon
} from '@mui/icons-material';

export default function VendorIntegration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [integrations, setIntegrations] = useState([]);
  const [syncStatus, setSyncStatus] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [apiConnections, setApiConnections] = useState([]);

  useEffect(() => {
    fetchIntegrationData();
  }, []);

  const fetchIntegrationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock data
      const mockIntegrations = generateMockIntegrations();
      const mockSyncStatus = generateMockSyncStatus();
      const mockApiConnections = generateMockApiConnections();

      setIntegrations(mockIntegrations);
      setSyncStatus(mockSyncStatus);
      setApiConnections(mockApiConnections);

    } catch (err) {
      console.error('Error fetching integration data:', err);
      setError('Failed to fetch integration data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockIntegrations = () => {
    return [
      {
        id: 1,
        name: 'SellerDynamics',
        type: 'inventory',
        status: 'connected',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        syncInterval: 30,
        dataPoints: 15420,
        successRate: 98.5,
        apiVersion: 'v2.1',
        endpoint: 'https://api.sellerdynamics.com/v2'
      },
      {
        id: 2,
        name: 'Shopify',
        type: 'ecommerce',
        status: 'connected',
        lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        syncInterval: 15,
        dataPoints: 8920,
        successRate: 99.2,
        apiVersion: 'v3.0',
        endpoint: 'https://kenttraders.myshopify.com/admin/api'
      },
      {
        id: 3,
        name: 'Amazon Seller Central',
        type: 'marketplace',
        status: 'connecting',
        lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        syncInterval: 60,
        dataPoints: 3240,
        successRate: 95.8,
        apiVersion: 'v1.0',
        endpoint: 'https://sellingpartner.amazon.com/api'
      },
      {
        id: 4,
        name: 'eBay',
        type: 'marketplace',
        status: 'disconnected',
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        syncInterval: 120,
        dataPoints: 1560,
        successRate: 0,
        apiVersion: 'v1.0',
        endpoint: 'https://api.ebay.com/v1'
      }
    ];
  };

  const generateMockSyncStatus = () => {
    return {
      lastFullSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      nextSync: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(),
      totalRecords: 28940,
      syncedRecords: 28420,
      failedRecords: 520,
      syncProgress: 98.2,
      activeConnections: 3,
      totalConnections: 4
    };
  };

  const generateMockApiConnections = () => {
    return [
      {
        id: 1,
        name: 'Inventory API',
        endpoint: '/api/inventory',
        method: 'GET',
        status: 'active',
        responseTime: 245,
        successRate: 99.1,
        lastCall: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        name: 'Orders API',
        endpoint: '/api/orders',
        method: 'POST',
        status: 'active',
        responseTime: 189,
        successRate: 98.7,
        lastCall: new Date(Date.now() - 2 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        name: 'Products API',
        endpoint: '/api/products',
        method: 'GET',
        status: 'active',
        responseTime: 312,
        successRate: 99.5,
        lastCall: new Date(Date.now() - 1 * 60 * 1000).toISOString()
      }
    ];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#10B981';
      case 'connecting': return '#F59E0B';
      case 'disconnected': return '#EF4444';
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircleIcon sx={{ color: '#10B981' }} />;
      case 'connecting':
        return <CircularProgress size={20} sx={{ color: '#F59E0B' }} />;
      case 'disconnected':
      case 'inactive':
        return <ErrorIcon sx={{ color: '#EF4444' }} />;
      default:
        return <InfoIcon sx={{ color: '#6B7280' }} />;
    }
  };

  const handleSyncNow = (integrationId) => {
    // Trigger sync logic
    console.log('Syncing integration:', integrationId);
  };

  const handleTestConnection = (integrationId) => {
    // Test connection logic
    console.log('Testing connection:', integrationId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
      <Head>
        <title>Vendor Integration - Kent Traders Admin</title>
        <meta name="description" content="Vendor integration management and API connections" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #E8E8EA 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Vendor Integration
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Manage vendor integrations, API connections, and data synchronization across multiple platforms
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Integration Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(79, 140, 255, 0.3)',
                  }}
                >
                  <ApiIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {integrations.length}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Active Integrations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <SyncIcon sx={{ color: '#10B981', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Sync Progress
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {syncStatus.syncProgress}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {syncStatus.syncedRecords} of {syncStatus.totalRecords}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <DataUsageIcon sx={{ color: '#F59E0B', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Data Points
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {integrations.reduce((sum, integration) => sum + integration.dataPoints, 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total synchronized
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <SpeedIcon sx={{ color: '#4F8CFF', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Avg Response
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {Math.round(apiConnections.reduce((sum, conn) => sum + conn.responseTime, 0) / apiConnections.length)}ms
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  API performance
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Integrations List */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <AssignmentIcon sx={{ color: '#4F8CFF' }} />
                  Vendor Integrations
                </Typography>
                <List>
                  {integrations
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((integration, index) => (
                    <React.Fragment key={integration.id}>
                      <ListItem
                        sx={{
                          border: '1px solid',
                          borderRadius: 2,
                          mb: 2,
                          backgroundColor: '#2A2A2D',
                        }}
                      >
                        <ListItemIcon>
                          {getStatusIcon(integration.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                {integration.name}
                              </Typography>
                              <Chip
                                label={integration.status}
                                size="small"
                                sx={{
                                  backgroundColor: `${getStatusColor(integration.status)}20`,
                                  color: getStatusColor(integration.status),
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box mt={1}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                {integration.endpoint}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={2} mt={1}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Data Points: {integration.dataPoints.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Success Rate: {integration.successRate}%
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  API v{integration.apiVersion}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        <Box display="flex" gap={1}>
                          <Tooltip title="Sync Now">
                            <IconButton
                              size="small"
                              onClick={() => handleSyncNow(integration.id)}
                              sx={{ color: '#4F8CFF' }}
                            >
                              <SyncIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Test Connection">
                            <IconButton
                              size="small"
                              onClick={() => handleTestConnection(integration.id)}
                              sx={{ color: '#F59E0B' }}
                            >
                              <PlayArrowIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                      {index < integrations.length - 1 && <Divider sx={{ my: 1 }} />}
                    </React.Fragment>
                  ))}
                </List>
                <TablePagination
                  component="div"
                  count={integrations.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  sx={{ color: 'text.primary' }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* API Connections */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CodeIcon sx={{ color: '#4F8CFF' }} />
                  API Connections
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>API</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Response</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiConnections.map((connection) => (
                        <TableRow key={connection.id}>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                              {connection.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {connection.method} {connection.endpoint}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={connection.status}
                              size="small"
                              sx={{
                                backgroundColor: `${getStatusColor(connection.status)}20`,
                                color: getStatusColor(connection.status),
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {connection.responseTime}ms
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
