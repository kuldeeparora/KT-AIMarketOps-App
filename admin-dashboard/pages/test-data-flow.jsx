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
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  AlertTitle,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
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
  VerifiedUser as VerifiedUserIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  DataUsage as DataUsageIcon,
  Storage as StorageIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Sync as SyncIcon,
  BugReport as BugReportIcon,
  Build as BuildIcon,
  Assessment as TestIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  Block as BlockIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon,
  SupervisedUserCircle as SupervisedUserIcon
} from '@mui/icons-material';

export default function TestDataFlow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [activeTests, setActiveTests] = useState([]);
  const [dataFlows, setDataFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [testConfig, setTestConfig] = useState({
    apiEndpoint: '/api/sellerdynamics',
    timeout: 5000,
    retries: 3,
    validateResponse: true,
    logDetails: true
  });

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock test data
      const mockTestResults = generateMockTestResults();
      const mockDataFlows = generateMockDataFlows();
      const mockActiveTests = generateMockActiveTests();

      setTestResults(mockTestResults);
      setDataFlows(mockDataFlows);
      setActiveTests(mockActiveTests);

    } catch (err) {
      console.error('Error fetching test data:', err);
      setError('Failed to fetch test data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTestResults = () => {
    return [
      {
        id: 1,
        name: 'SellerDynamics API Test',
        status: 'passed',
        duration: 2450,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        endpoint: '/api/sellerdynamics',
        responseTime: 2450,
        dataSize: '2.3MB',
        errors: 0,
        warnings: 1,
        details: {
          totalRequests: 1,
          successfulRequests: 1,
          failedRequests: 0,
          averageResponseTime: 2450,
          dataIntegrity: 100
        }
      },
      {
        id: 2,
        name: 'Shopify Inventory Sync',
        status: 'failed',
        duration: 12000,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        endpoint: '/api/shopify-inventory',
        responseTime: 12000,
        dataSize: '0KB',
        errors: 2,
        warnings: 0,
        details: {
          totalRequests: 1,
          successfulRequests: 0,
          failedRequests: 1,
          averageResponseTime: 12000,
          dataIntegrity: 0
        }
      },
      {
        id: 3,
        name: 'Inventory Unified Test',
        status: 'passed',
        duration: 1890,
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        endpoint: '/api/inventory/unified',
        responseTime: 1890,
        dataSize: '4.1MB',
        errors: 0,
        warnings: 0,
        details: {
          totalRequests: 1,
          successfulRequests: 1,
          failedRequests: 0,
          averageResponseTime: 1890,
          dataIntegrity: 100
        }
      },
      {
        id: 4,
        name: 'Orders API Validation',
        status: 'warning',
        duration: 3200,
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        endpoint: '/api/orders',
        responseTime: 3200,
        dataSize: '1.8MB',
        errors: 0,
        warnings: 3,
        details: {
          totalRequests: 1,
          successfulRequests: 1,
          failedRequests: 0,
          averageResponseTime: 3200,
          dataIntegrity: 95
        }
      }
    ];
  };

  const generateMockDataFlows = () => {
    return [
      {
        id: 1,
        name: 'Inventory Data Flow',
        description: 'Complete inventory data pipeline from SellerDynamics to unified view',
        status: 'active',
        steps: [
          { name: 'SellerDynamics API', status: 'completed', duration: 1200 },
          { name: 'Data Transformation', status: 'completed', duration: 450 },
          { name: 'Shopify Sync', status: 'completed', duration: 800 },
          { name: 'Unified Processing', status: 'completed', duration: 300 },
          { name: 'Database Update', status: 'completed', duration: 200 }
        ],
        totalDuration: 2950,
        successRate: 100,
        lastRun: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        name: 'Order Processing Flow',
        description: 'Order data processing and validation pipeline',
        status: 'warning',
        steps: [
          { name: 'Order Fetch', status: 'completed', duration: 1500 },
          { name: 'Validation', status: 'completed', duration: 300 },
          { name: 'Inventory Check', status: 'warning', duration: 800 },
          { name: 'Status Update', status: 'completed', duration: 200 }
        ],
        totalDuration: 2800,
        successRate: 85,
        lastRun: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        name: 'Analytics Data Flow',
        description: 'Analytics and reporting data aggregation',
        status: 'active',
        steps: [
          { name: 'Data Collection', status: 'completed', duration: 2000 },
          { name: 'Processing', status: 'completed', duration: 1500 },
          { name: 'Aggregation', status: 'completed', duration: 1000 },
          { name: 'Report Generation', status: 'completed', duration: 500 }
        ],
        totalDuration: 5000,
        successRate: 100,
        lastRun: new Date(Date.now() - 2 * 60 * 1000).toISOString()
      }
    ];
  };

  const generateMockActiveTests = () => {
    return [
      {
        id: 1,
        name: 'Real-time API Monitoring',
        status: 'running',
        progress: 65,
        startTime: new Date(Date.now() - 30 * 1000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 45 * 1000).toISOString()
      },
      {
        id: 2,
        name: 'Data Integrity Check',
        status: 'queued',
        progress: 0,
        startTime: null,
        estimatedCompletion: null
      }
    ];
  };

  const runTest = async (testName) => {
    try {
      setLoading(true);
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTest = {
        id: Date.now(),
        name: testName,
        status: 'running',
        duration: 0,
        timestamp: new Date().toISOString(),
        endpoint: testConfig.apiEndpoint,
        responseTime: 0,
        dataSize: '0KB',
        errors: 0,
        warnings: 0,
        details: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          averageResponseTime: 0,
          dataIntegrity: 0
        }
      };

      setTestResults([newTest, ...testResults]);
      
      // Simulate test completion
      setTimeout(() => {
        setTestResults(prev => prev.map(test => 
          test.id === newTest.id 
            ? { ...test, status: 'passed', duration: 2450, responseTime: 2450, dataSize: '2.3MB' }
            : test
        ));
      }, 3000);

    } catch (err) {
      console.error('Error running test:', err);
      setError('Failed to run test: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return '#10B981';
      case 'failed': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'running': return '#4F8CFF';
      case 'queued': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircleIcon />;
      case 'failed': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'running': return <CircularProgress size={20} />;
      case 'queued': return <PendingIcon />;
      default: return <InfoIcon />;
    }
  };

  const getTestStats = () => {
    const total = testResults.length;
    const passed = testResults.filter(t => t.status === 'passed').length;
    const failed = testResults.filter(t => t.status === 'failed').length;
    const warning = testResults.filter(t => t.status === 'warning').length;
    const running = activeTests.filter(t => t.status === 'running').length;

    return { total, passed, failed, warning, running };
  };

  const stats = getTestStats();

  return (
    <Layout>
      <Head>
        <title>Test Data Flow - Kent Traders Admin</title>
        <meta name="description" content="Comprehensive data flow testing and monitoring interface" />
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
            Test Data Flow
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Comprehensive data flow testing, API validation, and real-time monitoring for optimal system performance
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Test Configuration */}
        <Card
          sx={{
            background: 'background.paper',
            border: '1px solid',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            mb: 4,
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
              <SettingsIcon sx={{ color: '#4F8CFF' }} />
              Test Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="API Endpoint"
                  value={testConfig.apiEndpoint}
                  onChange={(e) => setTestConfig({ ...testConfig, apiEndpoint: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2A2A2D',
                      border: '1px solid',
                      '&:hover': {
                        borderColor: '#4F8CFF',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Timeout (ms)"
                  type="number"
                  value={testConfig.timeout}
                  onChange={(e) => setTestConfig({ ...testConfig, timeout: parseInt(e.target.value) })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2A2A2D',
                      border: '1px solid',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Retries"
                  type="number"
                  value={testConfig.retries}
                  onChange={(e) => setTestConfig({ ...testConfig, retries: parseInt(e.target.value) })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2A2A2D',
                      border: '1px solid',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={testConfig.validateResponse}
                      onChange={(e) => setTestConfig({ ...testConfig, validateResponse: e.target.checked })}
                    />
                  }
                  label="Validate Response"
                  sx={{ color: 'text.secondary' }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={() => runTest('Custom API Test')}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3A6BC7 0%, #4F8CFF 100%)',
                    },
                  }}
                >
                  Run Test
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Test Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
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
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(79, 140, 255, 0.3)',
                    }}
                  >
                    <AssessmentIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: '2rem',
                      }}
                    >
                      {stats.total}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      Total Tests
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
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
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: '2rem',
                      }}
                    >
                      {stats.passed}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      Passed
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
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
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <ErrorIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: '2rem',
                      }}
                    >
                      {stats.failed}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      Failed
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
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
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <WarningIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: '2rem',
                      }}
                    >
                      {stats.warning}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      Warnings
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
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
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <SyncIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: '2rem',
                      }}
                    >
                      {stats.running}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      Running
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Test Results */}
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
                  <AssessmentIcon sx={{ color: '#4F8CFF' }} />
                  Test Results
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Test Name</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Duration</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Response Time</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Data Size</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Errors</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testResults.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell sx={{ color: 'text.primary' }}>
                            <Typography variant="body2" fontWeight={500}>
                              {test.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#71717A' }}>
                              {test.endpoint}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(test.status)}
                              label={test.status.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: `${getStatusColor(test.status)}20`,
                                color: getStatusColor(test.status),
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {test.duration}ms
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {test.responseTime}ms
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {test.dataSize}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5}>
                              {test.errors > 0 && (
                                <Chip
                                  label={test.errors}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#EF444420',
                                    color: '#EF4444',
                                  }}
                                />
                              )}
                              {test.warnings > 0 && (
                                <Chip
                                  label={test.warnings}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#F59E0B20',
                                    color: '#F59E0B',
                                  }}
                                />
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Data Flows */}
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
                  <TimelineIcon sx={{ color: '#4F8CFF' }} />
                  Data Flows
                </Typography>
                <Stack spacing={2}>
                  {dataFlows.map((flow) => (
                    <Accordion
                      key={flow.id}
                      sx={{
                        backgroundColor: 'transparent',
                        border: '1px solid',
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                        sx={{ color: 'text.primary' }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          <Typography variant="body2" fontWeight={500}>
                            {flow.name}
                          </Typography>
                          <Chip
                            label={flow.status}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(flow.status)}20`,
                              color: getStatusColor(flow.status),
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="caption" sx={{ color: '#71717A', mb: 2, display: 'block' }}>
                          {flow.description}
                        </Typography>
                        <Stack spacing={1}>
                          {flow.steps.map((step, index) => (
                            <Box key={index} display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {step.name}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Chip
                                  label={step.status}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getStatusColor(step.status)}20`,
                                    color: getStatusColor(step.status),
                                    fontSize: '0.6rem',
                                  }}
                                />
                                <Typography variant="caption" sx={{ color: '#71717A' }}>
                                  {step.duration}ms
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                          <Typography variant="caption" sx={{ color: '#71717A' }}>
                            Success Rate: {flow.successRate}%
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#71717A' }}>
                            {flow.totalDuration}ms
                          </Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
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
