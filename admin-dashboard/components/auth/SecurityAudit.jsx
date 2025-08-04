import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedUserIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

export default function SecurityAudit() {
  const { data: session, status } = useSession();
  const [securityChecks, setSecurityChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performSecurityAudit();
  }, [session]);

  const performSecurityAudit = async () => {
    setLoading(true);
    const checks = [];

    // Check 1: Session Status
    checks.push({
      id: 'session-status',
      title: 'Session Status',
      description: 'Verify user session is active and valid',
      status: status === 'authenticated' ? 'pass' : status === 'loading' ? 'pending' : 'fail',
      details: status === 'authenticated' ? 'User is authenticated' : 'No active session'
    });

    // Check 2: Google OAuth Configuration
    checks.push({
      id: 'google-oauth',
      title: 'Google OAuth Configuration',
      description: 'Verify Google OAuth is properly configured',
      status: process.env.GOOGLE_CLIENT_ID ? 'pass' : 'fail',
      details: process.env.GOOGLE_CLIENT_ID ? 'Google OAuth is configured' : 'Google OAuth not configured'
    });

    // Check 3: NextAuth Secret
    checks.push({
      id: 'nextauth-secret',
      title: 'NextAuth Secret',
      description: 'Verify NextAuth secret is set',
      status: process.env.NEXTAUTH_SECRET ? 'pass' : 'fail',
      details: process.env.NEXTAUTH_SECRET ? 'NextAuth secret is configured' : 'NextAuth secret not set'
    });

    // Check 4: HTTPS (in production)
    checks.push({
      id: 'https-check',
      title: 'HTTPS Protocol',
      description: 'Verify HTTPS is enabled in production',
      status: process.env.NODE_ENV === 'production' ? (window.location.protocol === 'https:' ? 'pass' : 'fail') : 'info',
      details: process.env.NODE_ENV === 'production' 
        ? (window.location.protocol === 'https:' ? 'HTTPS is enabled' : 'HTTPS not enabled')
        : 'Development mode - HTTPS not required'
    });

    // Check 5: Domain Restrictions
    checks.push({
      id: 'domain-restrictions',
      title: 'Domain Restrictions',
      description: 'Check if email domain restrictions are configured',
      status: process.env.ALLOWED_EMAIL_DOMAINS ? 'pass' : 'warning',
      details: process.env.ALLOWED_EMAIL_DOMAINS 
        ? `Restricted to domains: ${process.env.ALLOWED_EMAIL_DOMAINS}`
        : 'No domain restrictions configured'
    });

    // Check 6: User Role
    checks.push({
      id: 'user-role',
      title: 'User Role',
      description: 'Verify user has appropriate role',
      status: session?.user?.role ? 'pass' : 'info',
      details: session?.user?.role 
        ? `User role: ${session.user.role}`
        : 'No role assigned'
    });

    // Check 7: Session Expiry
    checks.push({
      id: 'session-expiry',
      title: 'Session Configuration',
      description: 'Verify session expiry settings',
      status: process.env.SESSION_MAX_AGE ? 'pass' : 'warning',
      details: process.env.SESSION_MAX_AGE 
        ? `Session max age: ${process.env.SESSION_MAX_AGE} seconds`
        : 'Using default session settings'
    });

    // Check 8: Rate Limiting
    checks.push({
      id: 'rate-limiting',
      title: 'Rate Limiting',
      description: 'Check if rate limiting is configured',
      status: process.env.RATE_LIMIT_MAX_REQUESTS ? 'pass' : 'warning',
      details: process.env.RATE_LIMIT_MAX_REQUESTS 
        ? `Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS} requests per window`
        : 'Rate limiting not configured'
    });

    setSecurityChecks(checks);
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircleIcon color="success" />;
      case 'fail': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'info': return <InfoIcon color="info" />;
      case 'pending': return <RefreshIcon color="primary" />;
      default: return <InfoIcon color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass': return 'success';
      case 'fail': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'pending': return 'primary';
      default: return 'default';
    }
  };

  const getPassedChecks = () => securityChecks.filter(check => check.status === 'pass').length;
  const getFailedChecks = () => securityChecks.filter(check => check.status === 'fail').length;
  const getWarningChecks = () => securityChecks.filter(check => check.status === 'warning').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          🔐 Security Audit
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Comprehensive security assessment of your authentication system
        </Typography>
      </Box>

      {loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Running Security Audit...
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
                    {getPassedChecks()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Passed Checks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="error.main" gutterBottom>
                    {getFailedChecks()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed Checks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    {getWarningChecks()}
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
                    {securityChecks.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Checks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Security Status */}
          {getFailedChecks() > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Security Issues Detected
              </Typography>
              <Typography variant="body2">
                {getFailedChecks()} critical security check(s) failed. Please address these issues immediately.
              </Typography>
            </Alert>
          )}

          {getWarningChecks() > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Security Warnings
              </Typography>
              <Typography variant="body2">
                {getWarningChecks()} security check(s) have warnings. Consider addressing these for enhanced security.
              </Typography>
            </Alert>
          )}

          {getFailedChecks() === 0 && getWarningChecks() === 0 && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Security Audit Passed
              </Typography>
              <Typography variant="body2">
                All security checks passed! Your authentication system is properly configured.
              </Typography>
            </Alert>
          )}

          {/* Detailed Checks */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Security Check Details
            </Typography>
            <List>
              {securityChecks.map((check, index) => (
                <React.Fragment key={check.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(check.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="h6">
                            {check.title}
                          </Typography>
                          <Chip
                            label={check.status.toUpperCase()}
                            color={getStatusColor(check.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {check.description}
                          </Typography>
                          <Typography variant="body2">
                            {check.details}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < securityChecks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={performSecurityAudit}
            >
              Re-run Audit
            </Button>
            <Button
              variant="outlined"
              startIcon={<SecurityIcon />}
              onClick={() => window.open('/ENV-SETUP.md', '_blank')}
            >
              View Security Guide
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
} 