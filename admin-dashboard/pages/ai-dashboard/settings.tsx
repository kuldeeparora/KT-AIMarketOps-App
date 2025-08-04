import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert
} from '@mui/material';
import { Settings, SmartToy, Speed, Security, Psychology } from '@mui/icons-material';
import Layout from '../../components/Layout';

const AISettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    consciousnessLevel: 'advanced',
    targetResponseTime: 100,
    targetUptime: 99.9,
    maxConcurrentUsers: 10000,
    autoOptimization: true,
    realTimeMonitoring: true,
    securityProtocols: true,
    ethicalAI: true
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Simulate saving settings
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            ⚙️ AI System Settings
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Configure and manage all AI/AGI system settings and parameters
          </Typography>
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Performance Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Target Response Time</InputLabel>
                    <Select
                      value={settings.targetResponseTime}
                      label="Target Response Time"
                      onChange={(e) => handleSettingChange('targetResponseTime', e.target.value)}
                    >
                      <MenuItem value={50}>50ms</MenuItem>
                      <MenuItem value={100}>100ms</MenuItem>
                      <MenuItem value={200}>200ms</MenuItem>
                      <MenuItem value={500}>500ms</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Target Uptime</InputLabel>
                    <Select
                      value={settings.targetUptime}
                      label="Target Uptime"
                      onChange={(e) => handleSettingChange('targetUptime', e.target.value)}
                    >
                      <MenuItem value={99.5}>99.5%</MenuItem>
                      <MenuItem value={99.9}>99.9%</MenuItem>
                      <MenuItem value={99.99}>99.99%</MenuItem>
                      <MenuItem value={99.999}>99.999%</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Max Concurrent Users"
                    type="number"
                    value={settings.maxConcurrentUsers}
                    onChange={(e) => handleSettingChange('maxConcurrentUsers', parseInt(e.target.value))}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>AI Consciousness Level</InputLabel>
                    <Select
                      value={settings.consciousnessLevel}
                      label="AI Consciousness Level"
                      onChange={(e) => handleSettingChange('consciousnessLevel', e.target.value)}
                    >
                      <MenuItem value="basic">Basic</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                      <MenuItem value="expert">Expert</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                System Features
              </Typography>
              
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoOptimization}
                      onChange={(e) => handleSettingChange('autoOptimization', e.target.checked)}
                    />
                  }
                  label="Auto Optimization"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.realTimeMonitoring}
                      onChange={(e) => handleSettingChange('realTimeMonitoring', e.target.checked)}
                    />
                  }
                  label="Real-time Monitoring"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.securityProtocols}
                      onChange={(e) => handleSettingChange('securityProtocols', e.target.checked)}
                    />
                  }
                  label="Security Protocols"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.ethicalAI}
                      onChange={(e) => handleSettingChange('ethicalAI', e.target.checked)}
                    />
                  }
                  label="Ethical AI Framework"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                System Configuration
              </Typography>
              
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Current Consciousness Level</Typography>
                  <Typography variant="body2" color="primary.main">
                    {settings.consciousnessLevel.charAt(0).toUpperCase() + settings.consciousnessLevel.slice(1)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Target Response Time</Typography>
                  <Typography variant="body2" color="primary.main">
                    {settings.targetResponseTime}ms
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Target Uptime</Typography>
                  <Typography variant="body2" color="primary.main">
                    {settings.targetUptime}%
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Max Concurrent Users</Typography>
                  <Typography variant="body2" color="primary.main">
                    {settings.maxConcurrentUsers.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Feature Status
              </Typography>
              
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Auto Optimization</Typography>
                  <Typography variant="body2" color={settings.autoOptimization ? 'success.main' : 'text.secondary'}>
                    {settings.autoOptimization ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Real-time Monitoring</Typography>
                  <Typography variant="body2" color={settings.realTimeMonitoring ? 'success.main' : 'text.secondary'}>
                    {settings.realTimeMonitoring ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Security Protocols</Typography>
                  <Typography variant="body2" color={settings.securityProtocols ? 'success.main' : 'text.secondary'}>
                    {settings.securityProtocols ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Ethical AI Framework</Typography>
                  <Typography variant="body2" color={settings.ethicalAI ? 'success.main' : 'text.secondary'}>
                    {settings.ethicalAI ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
          >
            Save Settings
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setSettings({
              consciousnessLevel: 'advanced',
              targetResponseTime: 100,
              targetUptime: 99.9,
              maxConcurrentUsers: 10000,
              autoOptimization: true,
              realTimeMonitoring: true,
              securityProtocols: true,
              ethicalAI: true
            })}
          >
            Reset to Defaults
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default AISettingsPage; 