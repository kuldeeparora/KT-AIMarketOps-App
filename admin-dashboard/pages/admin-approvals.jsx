import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as DenyIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Schedule as PendingIcon,
  CheckCircle as ActiveIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

export default function AdminApprovals() {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/pending-approvals');
      const data = await response.json();
      
      if (data.success) {
        setPendingApprovals(data.data.pendingApprovals);
        setActiveSessions(data.data.activeSessions);
        setError(null);
      } else {
        setError('Failed to fetch approvals');
      }
    } catch (err) {
      setError('Failed to fetch approvals');
      console.error('Error fetching approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }));
      
      const response = await fetch('/api/auth/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Approved:', requestId);
        fetchApprovals(); // Refresh the list
      } else {
        setError('Failed to approve request');
      }
    } catch (err) {
      setError('Failed to approve request');
      console.error('Error approving request:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDeny = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }));
      
      const response = await fetch('/api/auth/deny', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Denied:', requestId);
        fetchApprovals(); // Refresh the list
      } else {
        setError('Failed to deny request');
      }
    } catch (err) {
      setError('Failed to deny request');
      console.error('Error denying request:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  useEffect(() => {
    fetchApprovals();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchApprovals, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Admin Approvals - Kent Traders</title>
        <meta name="description" content="Admin approval management dashboard" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Admin Approvals
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Manage login requests and active sessions
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchApprovals}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <PendingIcon color="warning" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {pendingApprovals.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Pending Approvals
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <ActiveIcon color="success" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {activeSessions.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Active Sessions
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Approvals */}
        <Paper sx={{ mb: 4 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold">
              Pending Approvals ({pendingApprovals.length})
            </Typography>
          </Box>
          
          {pendingApprovals.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                No pending approvals
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Requested</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingApprovals.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon />
                          <Typography variant="body2">
                            {request.user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.user.provider}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(request.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Approve">
                            <IconButton
                              color="success"
                              onClick={() => handleApprove(request.id)}
                              disabled={actionLoading[request.id]}
                            >
                              {actionLoading[request.id] ? (
                                <CircularProgress size={20} />
                              ) : (
                                <ApproveIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Deny">
                            <IconButton
                              color="error"
                              onClick={() => handleDeny(request.id)}
                              disabled={actionLoading[request.id]}
                            >
                              {actionLoading[request.id] ? (
                                <CircularProgress size={20} />
                              ) : (
                                <DenyIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Active Sessions */}
        <Paper>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold">
              Active Sessions ({activeSessions.length})
            </Typography>
          </Box>
          
          {activeSessions.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                No active sessions
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Approved By</TableCell>
                    <TableCell>Approved At</TableCell>
                    <TableCell>Session ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.sessionId}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon />
                          <Typography variant="body2">
                            {session.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {session.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {session.approvedBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(session.approvedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
                          {session.sessionId.substring(0, 20)}...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Layout>
  );
} 