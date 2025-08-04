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
  TextField,
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
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRoles = [
        {
          id: 1,
          name: 'Administrator',
          description: 'Full system access',
          permissions: ['read', 'write', 'delete', 'admin'],
          users: 3,
          status: 'active'
        },
        {
          id: 2,
          name: 'Manager',
          description: 'Manage inventory and orders',
          permissions: ['read', 'write'],
          users: 5,
          status: 'active'
        },
        {
          id: 3,
          name: 'Viewer',
          description: 'Read-only access',
          permissions: ['read'],
          users: 8,
          status: 'active'
        }
      ];
      
      setRoles(mockRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Head>
        <title>Role Management - Kent Traders Admin</title>
        <meta name="description" content="Manage user roles and permissions" />
      </Head>

      <Layout>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Role Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage user roles and permissions
            </Typography>
          </Box>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {loading ? (
              <Box sx={{ p: 3 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Loading roles...
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Role Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Permissions</TableCell>
                        <TableCell align="right">Users</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roles
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((role) => (
                        <TableRow key={role.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {role.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            {role.permissions.map((permission) => (
                              <Chip
                                key={permission}
                                label={permission}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell align="right">{role.users}</TableCell>
                          <TableCell>
                            <Chip
                              label={role.status}
                              color={role.status === 'active' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit Role">
                              <IconButton size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Role">
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={roles.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </TableContainer>
              </>
            )}
          </Paper>
        </Container>
      </Layout>
    </>
  );
}
