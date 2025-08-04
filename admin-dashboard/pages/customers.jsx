import React, { useState } from 'react';
import Head from 'next/head';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Avatar
} from '@mui/material';
import {
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

export default function Customers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const customers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+44 123 456 7890',
      orders: 5,
      totalSpent: '£1,299.99',
      lastOrder: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+44 987 654 3210',
      orders: 3,
      totalSpent: '£549.50',
      lastOrder: '2024-01-14'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+44 555 123 4567',
      orders: 2,
      totalSpent: '£189.99',
      lastOrder: '2024-01-13'
    }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
      <Head>
        <title>Customers | Kent Traders Admin</title>
        <meta name="description" content="Manage customer information" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Customers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage customer information and relationships
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">3</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Customers
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
                  <PeopleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">10</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
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
                  <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">£2,039.48</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
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
                  <PeopleIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">£679.83</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Order Value
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Orders</TableCell>
                  <TableCell>Total Spent</TableCell>
                  <TableCell>Last Order</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2 }}>
                          {customer.name.charAt(0)}
                        </Avatar>
                        {customer.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                        {customer.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                        {customer.phone}
                      </Box>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>{customer.totalSpent}</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          variant="outlined"
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          variant="outlined"
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={customers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        </Paper>
      </Container>
    </Layout>
  );
}
