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
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  AlertTitle,
  Collapse,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Block as BlockIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  VerifiedUser as VerifiedUserIcon,
  Pending as PendingIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon,
  SupervisedUserCircle as SupervisedUserIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

export default function UserManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    department: '',
    status: 'active',
    permissions: []
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock user data
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);

    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockUsers = () => {
    const roles = ['admin', 'manager', 'user', 'viewer'];
    const departments = ['Sales', 'Marketing', 'IT', 'Finance', 'Operations', 'Customer Support'];
    const statuses = ['active', 'inactive', 'pending'];
    const permissions = ['read', 'write', 'delete', 'admin'];

    return Array.from({ length: 25 }, (_, index) => {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const userPermissions = permissions.slice(0, Math.floor(Math.random() * permissions.length) + 1);

      return {
        id: `user-${index + 1}`,
        firstName: `User${index + 1}`,
        lastName: `Last${index + 1}`,
        email: `user${index + 1}@kenttraders.com`,
        phone: `+44 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        role,
        department,
        status,
        permissions: userPermissions,
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        avatar: `https://via.placeholder.com/40x40?text=${(index + 1).toString().padStart(2, '0')}`
      };
    });
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    setDialogMode('add');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user',
      department: '',
      status: 'active',
      permissions: []
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      status: user.status,
      permissions: user.permissions
    });
    setDialogOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = () => {
    if (dialogMode === 'add') {
      const newUser = {
        id: `user-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        avatar: `https://via.placeholder.com/40x40?text=${Math.floor(Math.random() * 100)}`
      };
      setUsers([...users, newUser]);
    } else {
      setUsers(users.map(user =>
        user.id === selectedUser.id ? { ...user, ...formData } : user
      ));
    }
    setDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'warning';
      case 'user': return 'primary';
      case 'viewer': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <AdminIcon />;
      case 'manager': return <SupervisedUserIcon />;
      case 'user': return <PersonIcon />;
      case 'viewer': return <VisibilityIcon />;
      default: return <PersonIcon />;
    }
  };

  return (
    <Layout>
      <>
        <Head>
          <title>User Management - Kent Traders Admin</title>
          <meta name="description" content="Comprehensive user management for Kent Traders Admin" />
        </Head>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users, roles, and permissions across the system
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Controls */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddUser}
                  fullWidth
                >
                  Add User
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchUsers}
                  fullWidth
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <PersonIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {users.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {users.filter(u => u.status === 'active').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <AdminIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {users.filter(u => u.role === 'admin').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Administrators
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <PendingIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {users.filter(u => u.status === 'pending').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Users Table */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar src={user.avatar} sx={{ mr: 2 }}>
                              {user.firstName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="bold">
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.phone}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getRoleIcon(user.role)}
                            label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            color={getStatusColor(user.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="View Details">
                              <IconButton size="small" color="primary">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit User">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditUser(user)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          {/* Add/Edit User Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {dialogMode === 'add' ? 'Add New User' : 'Edit User'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      label="Role"
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="viewer">Viewer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveUser} variant="contained">
                {dialogMode === 'add' ? 'Add User' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Loading Overlay */}
          {loading && (
            <Box position="fixed" top={0} left={0} right={0} zIndex={9999}>
              <LinearProgress />
            </Box>
          )}
        </Container>
      </>
    </Layout>
  );
}
