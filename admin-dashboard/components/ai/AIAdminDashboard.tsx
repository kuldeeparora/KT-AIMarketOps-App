import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Analytics,
  Psychology,
  SmartToy,
  TrendingUp,
  Speed,
  Security,
  Assessment,
  PlayArrow,
  Stop,
  Refresh,
  Settings,
  Visibility,
  VisibilityOff,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material';

interface SystemStatus {
  name: string;
  status: 'operational' | 'warning' | 'error' | 'offline';
  health: number;
  responseTime: number;
  uptime: number;
  lastUpdated: string;
}

interface AISystem {
  id: string;
  name: string;
  description: string;
  status: SystemStatus;
  metrics: any;
}

interface AIAdminDashboardProps {
  selectedSystem?: string | null;
}

const AIAdminDashboard: React.FC<AIAdminDashboardProps> = ({ selectedSystem: initialSelectedSystem }) => {
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(initialSelectedSystem || null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  // Mock data for demonstration - replace with actual API calls
  const mockSystems: AISystem[] = [
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics',
      description: 'Demand forecasting, pricing optimization, customer behavior prediction',
      status: {
        name: 'Predictive Analytics',
        status: 'operational',
        health: 95,
        responseTime: 45,
        uptime: 99.9,
        lastUpdated: new Date().toISOString(),
      },
      metrics: {
        demandForecastAccuracy: 95.2,
        pricingOptimizationSuccess: 87.5,
        customerPredictionAccuracy: 92.1,
        inventoryOptimizationEfficiency: 89.3,
      },
    },
    {
      id: 'autonomous-decision-maker',
      name: 'Autonomous Decision Maker',
      description: '99% accuracy inventory management and customer service automation',
      status: {
        name: 'Autonomous Decision Maker',
        status: 'operational',
        health: 99,
        responseTime: 12,
        uptime: 99.95,
        lastUpdated: new Date().toISOString(),
      },
      metrics: {
        decisionAccuracy: 99.1,
        inventoryManagementEfficiency: 96.8,
        customerServiceAutomation: 94.2,
        businessProcessOptimization: 91.7,
      },
    },
    {
      id: 'real-time-personalization',
      name: 'Real-time Personalization',
      description: 'Dynamic content generation and ML-powered recommendations',
      status: {
        name: 'Real-time Personalization',
        status: 'operational',
        health: 92,
        responseTime: 38,
        uptime: 99.8,
        lastUpdated: new Date().toISOString(),
      },
      metrics: {
        personalizationAccuracy: 92.3,
        recommendationRelevance: 89.7,
        adaptivePricingSuccess: 85.4,
        userExperienceOptimization: 91.2,
      },
    },
    {
      id: 'multi-modal-ai',
      name: 'Multi-modal AI',
      description: 'Voice processing, image recognition, and cross-modal integration',
      status: {
        name: 'Multi-modal AI',
        status: 'operational',
        health: 88,
        responseTime: 156,
        uptime: 99.7,
        lastUpdated: new Date().toISOString(),
      },
      metrics: {
        voiceProcessingAccuracy: 90.5,
        imageRecognitionAccuracy: 87.3,
        textToSpeechQuality: 89.1,
        crossModalFusionAccuracy: 85.9,
      },
    },
    {
      id: 'performance-optimizer',
      name: 'Performance Optimizer',
      description: '<100ms response time and 99.9% uptime optimization',
      status: {
        name: 'Performance Optimizer',
        status: 'operational',
        health: 98,
        responseTime: 23,
        uptime: 99.99,
        lastUpdated: new Date().toISOString(),
      },
      metrics: {
        averageResponseTime: 23,
        uptimePercentage: 99.99,
        concurrentUsersSupported: 10500,
        cacheHitRatio: 94.2,
      },
    },
    {
      id: 'unified-system',
      name: 'Unified AI/AGI System',
      description: 'Central orchestration hub for all AI/AGI capabilities',
      status: {
        name: 'Unified AI/AGI System',
        status: 'operational',
        health: 100,
        responseTime: 67,
        uptime: 99.95,
        lastUpdated: new Date().toISOString(),
      },
      metrics: {
        systemHealth: 100,
        totalModules: 6,
        healthyModules: 6,
        crossSystemIntegration: 95.8,
      },
    },
  ];

  useEffect(() => {
    // Simulate loading systems
    setTimeout(() => {
      setSystems(mockSystems);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (initialSelectedSystem) {
      setSelectedSystem(initialSelectedSystem);
    }
  }, [initialSelectedSystem]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <Error />;
      default: return <Error />;
    }
  };

  const handleSystemAction = async (systemId: string, action: string) => {
    try {
      // Here you would make actual API calls to your AI systems
      console.log(`Performing ${action} on system ${systemId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update system status
      setSystems(prev => prev.map(system => 
        system.id === systemId 
          ? { ...system, status: { ...system.status, health: Math.min(100, system.status.health + 5) }}
          : system
      ));
      
    } catch (error) {
      console.error(`Error performing ${action} on ${systemId}:`, error);
    }
  };

  const runSystemTest = async (systemId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate running tests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTestResults({
        systemId,
        timestamp: new Date().toISOString(),
        results: {
          status: 'passed',
          testsRun: 5,
          testsPassed: 5,
          responseTime: Math.floor(Math.random() * 100) + 20,
          accuracy: Math.floor(Math.random() * 10) + 90,
        },
      });
      
    } catch (error) {
      console.error(`Error testing system ${systemId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSystemMetrics = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    return system?.metrics || {};
  };

  const renderSystemCard = (system: AISystem) => (
    <Card key={system.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {system.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {system.description}
            </Typography>
          </Box>
          <Chip
            icon={getStatusIcon(system.status.status)}
            label={system.status.status}
            color={getStatusColor(system.status.status) as any}
            size="small"
          />
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            System Health
          </Typography>
          <LinearProgress
            variant="determinate"
            value={system.status.health}
            sx={{ height: 8, borderRadius: 4 }}
            color={system.status.health > 90 ? 'success' : system.status.health > 70 ? 'warning' : 'error'}
          />
          <Typography variant="caption" color="text.secondary">
            {system.status.health}% healthy
          </Typography>
        </Box>

        <Grid container spacing={1} mb={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Response Time
            </Typography>
            <Typography variant="body2">
              {system.status.responseTime}ms
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Uptime
            </Typography>
            <Typography variant="body2">
              {system.status.uptime}%
            </Typography>
          </Grid>
        </Grid>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            size="small"
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={() => handleSystemAction(system.id, 'start')}
          >
            Start
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Stop />}
            onClick={() => handleSystemAction(system.id, 'stop')}
          >
            Stop
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => runSystemTest(system.id)}
          >
            Test
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => setSelectedSystem(system.id)}
          >
            Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderSystemDetails = () => {
    if (!selectedSystem) return null;
    
    const system = systems.find(s => s.id === selectedSystem);
    if (!system) return null;

    const metrics = getSystemMetrics(selectedSystem);

    return (
      <Dialog
        open={!!selectedSystem}
        onClose={() => setSelectedSystem(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{system.name}</Typography>
            <Chip
              icon={getStatusIcon(system.status.status)}
              label={system.status.status}
              color={getStatusColor(system.status.status) as any}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {system.description}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Performance Metrics
          </Typography>
          
          <Grid container spacing={2}>
            {Object.entries(metrics).map(([key, value]) => (
              <Grid item xs={6} key={key}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Typography>
                  <Typography variant="h6">
                    {typeof value === 'number' ? `${value}${key.includes('Percentage') || key.includes('Ratio') || key.includes('Accuracy') ? '%' : ''}` : String(value)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            System Actions
          </Typography>
          
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={() => handleSystemAction(selectedSystem, 'start')}
            >
              Start System
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Stop />}
              onClick={() => handleSystemAction(selectedSystem, 'stop')}
            >
              Stop System
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => runSystemTest(selectedSystem)}
            >
              Run Tests
            </Button>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => setShowSettings(true)}
            >
              Configure
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSystem(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderSettingsDialog = () => (
    <Dialog
      open={showSettings}
      onClose={() => setShowSettings(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>AI System Configuration</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Target Response Time</InputLabel>
          <Select
            value={100}
            label="Target Response Time"
          >
            <MenuItem value={50}>50ms</MenuItem>
            <MenuItem value={100}>100ms</MenuItem>
            <MenuItem value={200}>200ms</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Target Uptime</InputLabel>
          <Select
            value={99.9}
            label="Target Uptime"
          >
            <MenuItem value={99.5}>99.5%</MenuItem>
            <MenuItem value={99.9}>99.9%</MenuItem>
            <MenuItem value={99.99}>99.99%</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Max Concurrent Users"
          type="number"
          defaultValue={10000}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth>
          <InputLabel>AI Consciousness Level</InputLabel>
          <Select
            value="advanced"
            label="AI Consciousness Level"
          >
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
            <MenuItem value="expert">Expert</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowSettings(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => setShowSettings(false)}>
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Loading AI Systems...
          </Typography>
          <LinearProgress sx={{ width: 200, mx: 'auto' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          AI/AGI Systems Dashboard
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh All
          </Button>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setShowSettings(true)}
          >
            Settings
          </Button>
        </Box>
      </Box>

      {testResults && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setTestResults(null)}
        >
          Test completed for {testResults.systemId}: {testResults.results.testsPassed}/{testResults.results.testsRun} tests passed
        </Alert>
      )}

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="All Systems" />
        <Tab label="Performance" />
        <Tab label="Analytics" />
        <Tab label="Monitoring" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {systems.map(system => (
            <Grid item xs={12} md={6} lg={4} key={system.id}>
              {renderSystemCard(system)}
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Performance
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Average Response Time
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {Math.round(systems.reduce((sum, s) => sum + s.status.responseTime, 0) / systems.length)}ms
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Overall Uptime
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {Math.min(...systems.map(s => s.status.uptime)).toFixed(2)}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Systems Operational
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {systems.filter(s => s.status.status === 'operational').length}/{systems.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Health Overview
                </Typography>
                {systems.map(system => (
                  <Box key={system.id} mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">{system.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {system.status.health}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={system.status.health}
                      sx={{ height: 6 }}
                      color={system.status.health > 90 ? 'success' : system.status.health > 70 ? 'warning' : 'error'}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Analytics Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Advanced analytics and insights from all AI systems will be displayed here.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Real-time Monitoring
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Live monitoring of all AI/AGI systems, consciousness tracking, and performance metrics.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {renderSystemDetails()}
      {renderSettingsDialog()}
    </Box>
  );
};

export default AIAdminDashboard; 