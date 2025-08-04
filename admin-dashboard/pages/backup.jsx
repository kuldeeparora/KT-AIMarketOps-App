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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload as BackupIcon,
  CloudDownload as RestoreIcon,
  Schedule as ScheduleIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon
} from '@mui/icons-material';

export default function Backup() {
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    includeDatabase: true,
    includeFiles: true,
    includeSettings: true,
    compression: true,
    encryption: true
  });

  const [backupHistory, setBackupHistory] = useState([
    {
      id: 1,
      name: 'Full Backup - 2024-01-15',
      type: 'full',
      size: '2.3 GB',
      status: 'completed',
      timestamp: '2024-01-15 02:00:00',
      duration: '15 minutes'
    },
    {
      id: 2,
      name: 'Incremental Backup - 2024-01-14',
      type: 'incremental',
      size: '150 MB',
      status: 'completed',
      timestamp: '2024-01-14 02:00:00',
      duration: '3 minutes'
    },
    {
      id: 3,
      name: 'Full Backup - 2024-01-13',
      type: 'full',
      size: '2.1 GB',
      status: 'failed',
      timestamp: '2024-01-13 02:00:00',
      duration: '0 minutes'
    }
  ]);

  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);

  const handleSettingChange = (setting, value) => {
    setBackupSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleStartBackup = () => {
    setIsBackupRunning(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackupRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const handleRestoreBackup = (backup) => {
    setSelectedBackup(backup);
    setDialogOpen(true);
  };

  const getBackupStats = () => {
    const totalBackups = backupHistory.length;
    const successfulBackups = backupHistory.filter(b => b.status === 'completed').length;
    const failedBackups = backupHistory.filter(b => b.status === 'failed').length;
    const totalSize = backupHistory
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + parseFloat(b.size.split(' ')[0]), 0);

    return {
      total: totalBackups,
      successful: successfulBackups,
      failed: failedBackups,
      totalSize: `${totalSize.toFixed(1)} GB`
    };
  };

  const stats = getBackupStats();

  return (
    <>
      <Head>
        <title>Backup - Kent Traders Admin</title>
        <meta name="description" content="Backup and restore management for Kent Traders Admin Dashboard" />
      </Head>
      <Layout>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Backup & Restore
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage automated backups and restore your system data
            </Typography>
          </Box>

          {/* Backup Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <BackupIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom>
                  {stats.total}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Backups
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom>
                  {stats.successful}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Successful
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom>
                  {stats.failed}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Failed
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <StorageIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom>
                  {stats.totalSize}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Size
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Backup Actions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Manual Backup
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={isBackupRunning ? <CircularProgress size={20} /> : <PlayIcon />}
                    onClick={handleStartBackup}
                    disabled={isBackupRunning}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {isBackupRunning ? 'Backup in Progress...' : 'Start Manual Backup'}
                  </Button>
                  {isBackupRunning && (
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress variant="determinate" value={backupProgress} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Progress: {backupProgress}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Create a manual backup of your current system state
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Backup Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Automatic Backups"
                      secondary="Enable scheduled automatic backups"
                    />
                    <Switch
                      checked={backupSettings.autoBackup}
                      onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <StorageIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Include Database"
                      secondary="Backup all database data"
                    />
                    <Switch
                      checked={backupSettings.includeDatabase}
                      onChange={(e) => handleSettingChange('includeDatabase', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <StorageIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Include Files"
                      secondary="Backup uploaded files and media"
                    />
                    <Switch
                      checked={backupSettings.includeFiles}
                      onChange={(e) => handleSettingChange('includeFiles', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Include Settings"
                      secondary="Backup system configuration"
                    />
                    <Switch
                      checked={backupSettings.includeSettings}
                      onChange={(e) => handleSettingChange('includeSettings', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* Backup History */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Backup History
            </Typography>
            <List>
              {backupHistory.map((backup) => (
                <ListItem key={backup.id} divider>
                  <ListItemIcon>
                    {backup.status === 'completed' ? (
                      <CheckCircleIcon color="success" />
                    ) : backup.status === 'failed' ? (
                      <ErrorIcon color="error" />
                    ) : (
                      <WarningIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={backup.name}
                    secondary={`${backup.timestamp} - ${backup.duration} - ${backup.size}`}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={backup.type}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={backup.status}
                      color={backup.status === 'completed' ? 'success' : 'error'}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRestoreBackup(backup)}
                      disabled={backup.status !== 'completed'}
                    >
                      <RestoreIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Backup Alerts */}
          <Box sx={{ mt: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Backup Alerts
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Next Scheduled Backup:</strong> Daily backup scheduled for 02:00 AM tomorrow.
                </Typography>
              </Alert>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Storage Warning:</strong> Backup storage is 85% full. Consider cleaning old backups.
                </Typography>
              </Alert>
              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Last Backup:</strong> Successfully completed on 2024-01-15 at 02:00 AM.
                </Typography>
              </Alert>
            </Paper>
          </Box>

          {/* Restore Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogContent>
              {selectedBackup && (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Are you sure you want to restore from "{selectedBackup.name}"?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    This will overwrite your current system data. This action cannot be undone.
                  </Typography>
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Warning:</strong> Restoring will replace all current data with the backup data.
                    </Typography>
                  </Alert>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                color="warning"
                onClick={() => {
                  console.log('Restoring backup:', selectedBackup);
                  setDialogOpen(false);
                }}
              >
                Restore Backup
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Layout>
    </>
  );
} 