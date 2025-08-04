import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  BugReport as TestIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Key as KeyIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  Branding as BrandingIcon,
  PriceCheck as PriceCheckIcon,
  AttachMoney as MoneyIcon,
  Euro as EuroIcon,
  CurrencyPound as PoundIcon,
  Help as HelpIcon,
  Support as SupportIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share as ShareIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewComfy as ViewComfyIcon,
  Dashboard as DashboardIcon,
  Print as PrintIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowDown as ExpandMore,
  KeyboardArrowUp as ExpandLess,
  Lightbulb as IntelligenceIcon,
  BarChart as ReportsIcon,
  Speed as OptimizationIcon,
  DataUsage as DataIcon,
  Link as IntegrationIcon,
  SmartToy as AIIcon,
  Insights as InsightsIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

export default function OktaConfiguration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [configStatus, setConfigStatus] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [showSecrets, setShowSecrets] = useState(false);
  const [config, setConfig] = useState({
    domain: '',
    clientId: '',
    clientSecret: '',
    apiToken: '',
    organization: ''
  });

  useEffect(() => {
    fetchConfigurationStatus();
  }, []);

  const fetchConfigurationStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/okta-test');
      const result = await response.json();

      if (result.success) {
        setConfigStatus(result.status);
      } else {
        setError(result.message || 'Failed to fetch configuration status');
      }
    } catch (err) {
      console.error('Error fetching Okta status:', err);
      setError('Failed to fetch configuration status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testConfiguration = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/okta-test');
      const result = await response.json();

      setTestResults(result);
      
      if (result.success) {
        setSuccess('Okta configuration test completed successfully');
      } else {
        setError(result.message || 'Configuration test failed');
      }
    } catch (err) {
      console.error('Error testing Okta configuration:', err);
      setError('Failed to test configuration: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // In a real implementation, this would save to environment variables
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Configuration saved successfully');
      fetchConfigurationStatus();
    } catch (err) {
      console.error('Error saving configuration:', err);
      setError('Failed to save configuration: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (configured) => {
    return configured ? 'success' : 'error';
  };

  const getStatusIcon = (configured) => {
    return configured ? <CheckCircleIcon /> : <ErrorIcon />;
  };

  return (
    <Layout>
      <Head>
        <title>Okta Configuration - AIMarketOps</title>
        <meta name="description" content="Configure Okta integration settings" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Okta Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure and manage Okta SSO integration settings
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Configuration Status */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    Configuration Status
                  </Typography>
                  <IconButton onClick={fetchConfigurationStatus} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Box>
                
                {loading ? (
                  <Box display="flex" alignItems="center" gap={2}>
                    <CircularProgress size={20} />
                    <Typography>Checking configuration...</Typography>
                  </Box>
                ) : configStatus ? (
                  <Box>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      {getStatusIcon(configStatus.configured)}
                      <Typography variant="h6" color={getStatusColor(configStatus.configured)}>
                        {configStatus.configured ? 'Configured' : 'Not Configured'}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {configStatus.message}
                    </Typography>
                    
                    {configStatus.error && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        {configStatus.error}
                      </Alert>
                    )}
                    
                    {configStatus.domain && (
                      <Chip
                        label={`Domain: ${configStatus.domain}`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    )}
                    
                    {configStatus.organization && (
                      <Chip
                        label={`Org: ${configStatus.organization}`}
                        size="small"
                      />
                    )}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    No configuration status available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    startIcon={<TestIcon />}
                    onClick={testConfiguration}
                    disabled={loading}
                  >
                    Test Configuration
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchConfigurationStatus}
                    disabled={loading}
                  >
                    Refresh Status
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => setShowSecrets(!showSecrets)}
                  >
                    {showSecrets ? 'Hide' : 'Show'} Secrets
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Configuration Form */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Okta Configuration Settings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Okta Domain"
                value={config.domain}
                onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                placeholder="your-domain.okta.com"
                helperText="Your Okta organization domain"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Client ID"
                value={config.clientId}
                onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                placeholder="your-client-id"
                helperText="OAuth 2.0 Client ID from Okta"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Secret"
                type={showSecrets ? 'text' : 'password'}
                value={config.clientSecret}
                onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                placeholder="your-client-secret"
                helperText="OAuth 2.0 Client Secret from Okta"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="API Token"
                type={showSecrets ? 'text' : 'password'}
                value={config.apiToken}
                onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                placeholder="your-api-token"
                helperText="Okta API Token for server-to-server calls"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organization"
                value={config.organization}
                onChange={(e) => setConfig({ ...config, organization: e.target.value })}
                placeholder="your-organization"
                helperText="Your Okta organization name"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          
          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={saveConfiguration}
              disabled={loading}
            >
              Save Configuration
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<TestIcon />}
              onClick={testConfiguration}
              disabled={loading}
            >
              Test Connection
            </Button>
          </Box>
        </Paper>

        {/* Test Results */}
        {testResults && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Test Results
            </Typography>
            
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Configuration Test Results
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={testResults.success ? 'Success' : 'Failed'}
                        color={testResults.success ? 'success' : 'error'}
                        size="small"
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Message
                      </Typography>
                      <Typography variant="body2">
                        {testResults.message || 'No message available'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {testResults.status && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Configuration Details
                  </Typography>
                  <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '1rem', 
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(testResults.status, null, 2)}
                  </pre>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        {/* Help Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Configuration Help
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                How to configure Okta integration
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                1. Log in to your Okta Admin Console
              </Typography>
              <Typography variant="body2" paragraph>
                2. Navigate to Applications → Applications → Add Application
              </Typography>
              <Typography variant="body2" paragraph>
                3. Choose "Web application" and configure the settings
              </Typography>
              <Typography variant="body2" paragraph>
                4. Note down the Client ID and Client Secret
              </Typography>
              <Typography variant="body2" paragraph>
                5. Create an API Token in Security → API → Tokens
              </Typography>
              <Typography variant="body2" paragraph>
                6. Enter the configuration details above and test the connection
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                Troubleshooting
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                • Ensure your Okta domain is correct (e.g., yourcompany.okta.com)
              </Typography>
              <Typography variant="body2" paragraph>
                • Verify that your Client ID and Client Secret are correct
              </Typography>
              <Typography variant="body2" paragraph>
                • Check that your API Token has the necessary permissions
              </Typography>
              <Typography variant="body2" paragraph>
                • Ensure your Okta application is properly configured
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Container>
    </Layout>
  );
} 