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
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Integration as IntegrationIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  SmartToy as AIIcon,
  AutoFixHigh as AutoFixIcon,
  Hub as HubIcon,
  Api as ApiIcon,
  Webhook as WebhookIcon,
  DataObject as DataObjectIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  Code as CodeIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

export default function AdvancedFeatures() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [aiFeatures, setAiFeatures] = useState([]);
  const [addFeatureDialog, setAddFeatureDialog] = useState(false);
  const [addAutomationDialog, setAddAutomationDialog] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    fetchAdvancedFeaturesData();
  }, []);

  const fetchAdvancedFeaturesData = async () => {
    setLoading(true);
    try {
      // Mock advanced features data
      const mockFeatures = [
        {
          id: 1,
          name: 'AI Product Recommendations',
          category: 'AI',
          status: 'active',
          description: 'Intelligent product recommendations based on customer behavior',
          performance: 95,
          lastUsed: '2024-01-15T10:30:00Z',
          settings: {
            enabled: true,
            autoOptimize: true,
            learningRate: 'high'
          }
        },
        {
          id: 2,
          name: 'Automated Inventory Management',
          category: 'Automation',
          status: 'active',
          description: 'Automatic stock level monitoring and reorder triggers',
          performance: 88,
          lastUsed: '2024-01-15T09:15:00Z',
          settings: {
            enabled: true,
            threshold: 10,
            autoReorder: true
          }
        },
        {
          id: 3,
          name: 'Multi-Channel Integration',
          category: 'Integration',
          status: 'active',
          description: 'Seamless integration with Amazon, eBay, and social platforms',
          performance: 92,
          lastUsed: '2024-01-15T08:45:00Z',
          settings: {
            enabled: true,
            syncInterval: '15min',
            priceSync: true
          }
        },
        {
          id: 4,
          name: 'Predictive Analytics',
          category: 'Analytics',
          status: 'inactive',
          description: 'Advanced sales forecasting and trend analysis',
          performance: 0,
          lastUsed: null,
          settings: {
            enabled: false,
            dataRetention: '90days',
            modelType: 'neural'
          }
        }
      ];

      const mockAutomations = [
        {
          id: 1,
          name: 'Price Optimization',
          type: 'scheduled',
          status: 'running',
          description: 'Automatically adjust prices based on market conditions',
          schedule: 'Daily at 2:00 AM',
          lastRun: '2024-01-15T02:00:00Z',
          nextRun: '2024-01-16T02:00:00Z',
          successRate: 94
        },
        {
          id: 2,
          name: 'Email Marketing Campaigns',
          type: 'triggered',
          status: 'running',
          description: 'Send personalized emails based on customer behavior',
          schedule: 'On customer action',
          lastRun: '2024-01-15T14:30:00Z',
          nextRun: 'Trigger-based',
          successRate: 87
        },
        {
          id: 3,
          name: 'Inventory Alerts',
          type: 'monitoring',
          status: 'paused',
          description: 'Monitor stock levels and send alerts',
          schedule: 'Every 30 minutes',
          lastRun: '2024-01-14T18:00:00Z',
          nextRun: 'Paused',
          successRate: 96
        }
      ];

      const mockIntegrations = [
        {
          id: 1,
          name: 'Shopify',
          type: 'ecommerce',
          status: 'connected',
          description: 'Primary ecommerce platform integration',
          lastSync: '2024-01-15T10:30:00Z',
          syncStatus: 'success',
          apiCalls: 1250
        },
        {
          id: 2,
          name: 'Amazon Seller Central',
          type: 'marketplace',
          status: 'connected',
          description: 'Amazon marketplace integration',
          lastSync: '2024-01-15T09:15:00Z',
          syncStatus: 'success',
          apiCalls: 890
        },
        {
          id: 3,
          name: 'QuickBooks',
          type: 'accounting',
          status: 'connected',
          description: 'Accounting software integration',
          lastSync: '2024-01-15T08:45:00Z',
          syncStatus: 'success',
          apiCalls: 450
        },
        {
          id: 4,
          name: 'Mailchimp',
          type: 'marketing',
          status: 'disconnected',
          description: 'Email marketing platform',
          lastSync: '2024-01-10T12:00:00Z',
          syncStatus: 'error',
          apiCalls: 0
        }
      ];

      const mockAiFeatures = [
        {
          id: 1,
          name: 'Smart Product Descriptions',
          type: 'content',
          status: 'active',
          description: 'AI-generated product descriptions optimized for SEO',
          accuracy: 92,
          usage: 156,
          lastUsed: '2024-01-15T11:00:00Z'
        },
        {
          id: 2,
          name: 'Customer Behavior Analysis',
          type: 'analytics',
          status: 'active',
          description: 'Analyze customer patterns and predict buying behavior',
          accuracy: 89,
          usage: 89,
          lastUsed: '2024-01-15T10:30:00Z'
        },
        {
          id: 3,
          name: 'Dynamic Pricing',
          type: 'pricing',
          status: 'active',
          description: 'AI-powered dynamic pricing based on market conditions',
          accuracy: 94,
          usage: 234,
          lastUsed: '2024-01-15T09:45:00Z'
        },
        {
          id: 4,
          name: 'Fraud Detection',
          type: 'security',
          status: 'inactive',
          description: 'AI-powered fraud detection system',
          accuracy: 0,
          usage: 0,
          lastUsed: null
        }
      ];

      setFeatures(mockFeatures);
      setAutomations(mockAutomations);
      setIntegrations(mockIntegrations);
      setAiFeatures(mockAiFeatures);
    } catch (err) {
      setError('Failed to load advanced features data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'connected': return 'success';
      case 'disconnected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon color="success" />;
      case 'inactive': return <ErrorIcon color="error" />;
      case 'running': return <PlayIcon color="success" />;
      case 'paused': return <StopIcon color="warning" />;
      case 'connected': return <CheckCircleIcon color="success" />;
      case 'disconnected': return <ErrorIcon color="error" />;
      default: return <WarningIcon color="warning" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'AI': return <AIIcon />;
      case 'Automation': return <AutoFixIcon />;
      case 'Integration': return <HubIcon />;
      case 'Analytics': return <AnalyticsIcon />;
      default: return <AutoAwesomeIcon />;
    }
  };

  const handleFeatureToggle = (featureId) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, status: feature.status === 'active' ? 'inactive' : 'active' }
        : feature
    ));
  };

  const handleAutomationToggle = (automationId) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === automationId 
        ? { 
            ...automation, 
            status: automation.status === 'running' ? 'paused' : 'running',
            nextRun: automation.status === 'running' ? 'Paused' : 'Next scheduled run'
          }
        : automation
    ));
  };

  const tabs = [
    { label: 'Overview', icon: <AutoAwesomeIcon /> },
    { label: 'AI Features', icon: <AIIcon /> },
    { label: 'Automations', icon: <AutoFixIcon /> },
    { label: 'Integrations', icon: <HubIcon /> },
    { label: 'Analytics', icon: <AnalyticsIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> }
  ];

  if (loading && features.length === 0) {
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
        <title>Advanced Features - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Advanced AI features and automation" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Advanced Features
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered features, automation, and advanced integrations
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Feature Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AIIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">
                      {aiFeatures.filter(f => f.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Active AI Features</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AutoFixIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">
                      {automations.filter(a => a.status === 'running').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Running Automations</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <HubIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">
                      {integrations.filter(i => i.status === 'connected').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Connected Integrations</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">94.2%</Typography>
                    <Typography variant="body2" color="text.secondary">Average Performance</Typography>
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
            {/* Active Features */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Features
                  </Typography>
                  <List>
                    {features.filter(f => f.status === 'active').map((feature) => (
                      <ListItem key={feature.id}>
                        <ListItemIcon>
                          {getCategoryIcon(feature.category)}
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.name}
                          secondary={`${feature.description} • Performance: ${feature.performance}%`}
                        />
                        <IconButton onClick={() => handleFeatureToggle(feature.id)}>
                          <SettingsIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Running Automations */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Running Automations
                  </Typography>
                  <List>
                    {automations.filter(a => a.status === 'running').map((automation) => (
                      <ListItem key={automation.id}>
                        <ListItemIcon>
                          <AutoFixIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={automation.name}
                          secondary={`${automation.description} • Success: ${automation.successRate}%`}
                        />
                        <IconButton onClick={() => handleAutomationToggle(automation.id)}>
                          <StopIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">AI Features</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddFeatureDialog(true)}
                >
                  Add AI Feature
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Feature</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Accuracy</TableCell>
                      <TableCell>Usage</TableCell>
                      <TableCell>Last Used</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {aiFeatures.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <AIIcon sx={{ mr: 1 }} />
                            <Typography>{feature.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={feature.type} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={feature.status}
                            color={getStatusColor(feature.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {feature.accuracy}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={feature.accuracy}
                              sx={{ width: 60 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{feature.usage}</TableCell>
                        <TableCell>
                          {feature.lastUsed 
                            ? new Date(feature.lastUsed).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleFeatureToggle(feature.id)}>
                            {feature.status === 'active' ? <StopIcon /> : <PlayIcon />}
                          </IconButton>
                          <IconButton>
                            <SettingsIcon />
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

        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Automations</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddAutomationDialog(true)}
                >
                  Create Automation
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Automation</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Schedule</TableCell>
                      <TableCell>Last Run</TableCell>
                      <TableCell>Success Rate</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {automations.map((automation) => (
                      <TableRow key={automation.id}>
                        <TableCell>{automation.name}</TableCell>
                        <TableCell>
                          <Chip label={automation.type} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={automation.status}
                            color={getStatusColor(automation.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{automation.schedule}</TableCell>
                        <TableCell>
                          {new Date(automation.lastRun).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {automation.successRate}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={automation.successRate}
                              sx={{ width: 60 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleAutomationToggle(automation.id)}>
                            {automation.status === 'running' ? <StopIcon /> : <PlayIcon />}
                          </IconButton>
                          <IconButton>
                            <SettingsIcon />
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
              <Typography variant="h6" gutterBottom>
                Integrations
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Integration</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Sync</TableCell>
                      <TableCell>Sync Status</TableCell>
                      <TableCell>API Calls</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {integrations.map((integration) => (
                      <TableRow key={integration.id}>
                        <TableCell>{integration.name}</TableCell>
                        <TableCell>
                          <Chip label={integration.type} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={integration.status}
                            color={getStatusColor(integration.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(integration.lastSync).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={integration.syncStatus}
                            color={integration.syncStatus === 'success' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{integration.apiCalls}</TableCell>
                        <TableCell>
                          <IconButton>
                            <RefreshIcon />
                          </IconButton>
                          <IconButton>
                            <SettingsIcon />
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Feature Performance Analytics
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Analytics chart placeholder</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Model Performance
                  </Typography>
                  <List>
                    {aiFeatures.map((feature) => (
                      <ListItem key={feature.id}>
                        <ListItemText
                          primary={feature.name}
                          secondary={`Accuracy: ${feature.accuracy}% • Usage: ${feature.usage} times`}
                        />
                        <LinearProgress
                          variant="determinate"
                          value={feature.accuracy}
                          sx={{ width: 100 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 5 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Advanced Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    AI Settings
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable AI features"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-optimize AI models"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Advanced learning algorithms"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Automation Settings
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable automations"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-retry failed tasks"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Advanced scheduling"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Add Feature Dialog */}
      <Dialog open={addFeatureDialog} onClose={() => setAddFeatureDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New AI Feature</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Feature Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Feature Type</InputLabel>
                <Select label="Feature Type">
                  <MenuItem value="content">Content Generation</MenuItem>
                  <MenuItem value="analytics">Analytics</MenuItem>
                  <MenuItem value="pricing">Pricing</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Accuracy Target (%)" type="number" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddFeatureDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Feature</Button>
        </DialogActions>
      </Dialog>

      {/* Add Automation Dialog */}
      <Dialog open={addAutomationDialog} onClose={() => setAddAutomationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Automation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Automation Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Automation Type</InputLabel>
                <Select label="Automation Type">
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="triggered">Triggered</MenuItem>
                  <MenuItem value="monitoring">Monitoring</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Schedule" placeholder="e.g., Daily at 2:00 AM" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddAutomationDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Automation</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
} 