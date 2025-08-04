import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { auth, db, storage } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { listAll, ref } from 'firebase/storage';

export default function FirebaseConfigTest() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runFirebaseTests();
  }, []);

  const runFirebaseTests = async () => {
    setLoading(true);
    const testResults = [];

    // Test 1: Firebase App Initialization
    try {
      if (auth && db && storage) {
        testResults.push({
          name: 'Firebase App Initialization',
          status: 'pass',
          message: 'Firebase app initialized successfully',
        });
      } else {
        testResults.push({
          name: 'Firebase App Initialization',
          status: 'warning',
          message: 'Firebase not initialized - missing environment variables',
        });
      }
    } catch (error) {
      testResults.push({
        name: 'Firebase App Initialization',
        status: 'fail',
        message: `Failed to initialize Firebase: ${error.message}`,
      });
    }

    // Test 2: Authentication Service
    try {
      if (auth) {
        testResults.push({
          name: 'Authentication Service',
          status: 'pass',
          message: 'Firebase Auth service available',
        });
      } else {
        testResults.push({
          name: 'Authentication Service',
          status: 'warning',
          message: 'Firebase Auth service not available - check environment variables',
        });
      }
    } catch (error) {
      testResults.push({
        name: 'Authentication Service',
        status: 'fail',
        message: `Auth service error: ${error.message}`,
      });
    }

    // Test 3: Firestore Database
    try {
      if (db) {
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        testResults.push({
          name: 'Firestore Database',
          status: 'pass',
          message: 'Firestore database accessible',
        });
      } else {
        testResults.push({
          name: 'Firestore Database',
          status: 'warning',
          message: 'Firestore not available - check environment variables',
        });
      }
    } catch (error) {
      testResults.push({
        name: 'Firestore Database',
        status: 'fail',
        message: `Firestore error: ${error.message}`,
      });
    }

    // Test 4: Storage Service
    try {
      if (storage) {
        const storageRef = ref(storage, 'test');
        await listAll(storageRef);
        testResults.push({
          name: 'Storage Service',
          status: 'pass',
          message: 'Firebase Storage accessible',
        });
      } else {
        testResults.push({
          name: 'Storage Service',
          status: 'warning',
          message: 'Firebase Storage not available - check environment variables',
        });
      }
    } catch (error) {
      testResults.push({
        name: 'Storage Service',
        status: 'fail',
        message: `Storage error: ${error.message}`,
      });
    }

    // Test 5: Environment Variables
    const envVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];

    const missingVars = envVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      testResults.push({
        name: 'Environment Variables',
        status: 'pass',
        message: 'All required Firebase environment variables are set',
      });
    } else {
      testResults.push({
        name: 'Environment Variables',
        status: 'warning',
        message: `Missing environment variables: ${missingVars.join(', ')}`,
      });
    }

    // Test 6: Client-side vs Server-side
    if (typeof window !== 'undefined') {
      testResults.push({
        name: 'Client-side Rendering',
        status: 'pass',
        message: 'Running in browser environment',
      });
    } else {
      testResults.push({
        name: 'Server-side Rendering',
        status: 'info',
        message: 'Running in server environment',
      });
    }

    setTests(testResults);
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircleIcon color="success" />;
      case 'fail':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass':
        return 'success';
      case 'fail':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPassedTests = () => tests.filter(test => test.status === 'pass').length;
  const getFailedTests = () => tests.filter(test => test.status === 'fail').length;
  const getWarningTests = () => tests.filter(test => test.status === 'warning').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          🔥 Firebase Configuration Test
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Comprehensive testing of Firebase services and configuration
        </Typography>
      </Box>

      {loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CloudIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Running Firebase Tests...
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    {getPassedTests()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Passed Tests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="error.main" gutterBottom>
                    {getFailedTests()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed Tests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    {getWarningTests()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Warnings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    {tests.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Status Alerts */}
          {getFailedTests() > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Firebase Configuration Issues
              </Typography>
              <Typography variant="body2">
                {getFailedTests()} test(s) failed. Please check your Firebase configuration and environment variables.
              </Typography>
            </Alert>
          )}

          {getWarningTests() > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Firebase Configuration Warnings
              </Typography>
              <Typography variant="body2">
                {getWarningTests()} test(s) have warnings. Consider addressing these for full Firebase functionality.
              </Typography>
            </Alert>
          )}

          {getFailedTests() === 0 && getWarningTests() === 0 && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Firebase Configuration Passed
              </Typography>
              <Typography variant="body2">
                All Firebase tests passed! Your Firebase configuration is working correctly.
              </Typography>
            </Alert>
          )}

          {/* Test Results */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Test Results
            </Typography>
            <List>
              {tests.map((test, index) => (
                <React.Fragment key={test.name}>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(test.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="h6">
                            {test.name}
                          </Typography>
                          <Chip
                            label={test.status.toUpperCase()}
                            color={getStatusColor(test.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {test.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < tests.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={runFirebaseTests}
            >
              Re-run Tests
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudIcon />}
              onClick={() => window.open('/FIREBASE-SETUP-GUIDE.md', '_blank')}
            >
              View Setup Guide
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
} 