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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize
} from '@mui/material';
import {
  Support as SupportIcon,
  Help as HelpIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Forum as ForumIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoIcon,
  Book as BookIcon
} from '@mui/icons-material';

export default function Support() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Login Issue',
      description: 'Unable to access admin dashboard',
      status: 'open',
      priority: 'high',
      category: 'technical',
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-01-15 14:20:00',
      assignedTo: 'support@kenttraders.com'
    },
    {
      id: 2,
      title: 'Inventory Sync Problem',
      description: 'Products not syncing with marketplace',
      status: 'in_progress',
      priority: 'medium',
      category: 'inventory',
      createdAt: '2024-01-14 09:15:00',
      updatedAt: '2024-01-15 11:45:00',
      assignedTo: 'admin@kenttraders.com'
    },
    {
      id: 3,
      title: 'Report Generation Error',
      description: 'Sales reports not generating correctly',
      status: 'resolved',
      priority: 'low',
      category: 'reports',
      createdAt: '2024-01-13 16:30:00',
      updatedAt: '2024-01-14 10:15:00',
      assignedTo: 'support@kenttraders.com'
    }
  ]);

  const [newTicketDialog, setNewTicketDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  const [supportStats, setSupportStats] = useState({
    totalTickets: 15,
    openTickets: 3,
    resolvedTickets: 12,
    averageResponseTime: '2.5 hours'
  });

  const handleCreateTicket = () => {
    const ticket = {
      id: tickets.length + 1,
      ...newTicket,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: 'support@kenttraders.com'
    };
    setTickets([ticket, ...tickets]);
    setNewTicket({
      title: '',
      description: '',
      category: '',
      priority: 'medium'
    });
    setNewTicketDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <>
      <Head>
        <title>Support - Kent Traders Admin</title>
        <meta name="description" content="Support and help center for Kent Traders Admin Dashboard" />
      </Head>
      <Layout>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Support Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get help and support for your Kent Traders platform
            </Typography>
          </Box>

          {/* Support Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <SupportIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom>
                  {supportStats.totalTickets}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Tickets
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom>
                  {supportStats.openTickets}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Open Tickets
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom>
                  {supportStats.resolvedTickets}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Resolved
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <HistoryIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom>
                  {supportStats.averageResponseTime}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Avg Response Time
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<MessageIcon />}
                      fullWidth
                      onClick={() => setNewTicketDialog(true)}
                    >
                      New Ticket
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<ArticleIcon />}
                      fullWidth
                    >
                      Knowledge Base
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<VideoIcon />}
                      fullWidth
                    >
                      Video Tutorials
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<ForumIcon />}
                      fullWidth
                    >
                      Community Forum
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Support"
                      secondary="support@kenttraders.com"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone Support"
                      secondary="+44 20 7946 0958"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ChatIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Live Chat"
                      secondary="Available 24/7"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BookIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Documentation"
                      secondary="Complete user guides"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* Support Tickets */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Support Tickets
              </Typography>
              <Button
                variant="contained"
                startIcon={<MessageIcon />}
                onClick={() => setNewTicketDialog(true)}
              >
                Create New Ticket
              </Button>
            </Box>
            <List>
              {tickets.map((ticket) => (
                <ListItem key={ticket.id} divider>
                  <ListItemIcon>
                    <MessageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={ticket.title}
                    secondary={`${ticket.description} - Created: ${ticket.createdAt}`}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={ticket.status.replace('_', ' ')}
                      color={getStatusColor(ticket.status)}
                      size="small"
                    />
                    <Chip
                      label={ticket.priority}
                      color={getPriorityColor(ticket.priority)}
                      size="small"
                    />
                    <Chip
                      label={ticket.category}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Support Alerts */}
          <Box sx={{ mt: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Support Updates
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>System Maintenance:</strong> Scheduled maintenance on January 20th, 2024 from 2:00 AM to 4:00 AM GMT.
                </Typography>
              </Alert>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>New Feature Available:</strong> Advanced inventory analytics is now live for all users.
                </Typography>
              </Alert>
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Known Issue:</strong> Some users may experience slow loading times during peak hours.
                </Typography>
              </Alert>
            </Paper>
          </Box>

          {/* New Ticket Dialog */}
          <Dialog open={newTicketDialog} onClose={() => setNewTicketDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Support Ticket</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <TextField
                  fullWidth
                  label="Ticket Title"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newTicket.category}
                    label="Category"
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  >
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="inventory">Inventory</MenuItem>
                    <MenuItem value="reports">Reports</MenuItem>
                    <MenuItem value="billing">Billing</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTicket.priority}
                    label="Priority"
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  placeholder="Please describe your issue in detail..."
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setNewTicketDialog(false)}>Cancel</Button>
              <Button 
                variant="contained"
                onClick={handleCreateTicket}
                disabled={!newTicket.title || !newTicket.description || !newTicket.category}
              >
                Create Ticket
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Layout>
    </>
  );
} 