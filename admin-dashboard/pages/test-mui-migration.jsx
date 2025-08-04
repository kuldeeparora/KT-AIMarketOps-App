import React, { useState } from 'react';
import {
  useTheme
} from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Rating,
  Slider,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  AvatarGroup,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  IconButton,
  Fab,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Backdrop,
  Skeleton,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Success as SuccessIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';

export default function TestMUIMigration() {
  const { mode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [rating, setRating] = useState(3);
  const [sliderValue, setSliderValue] = useState(50);
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const actions = [
    { icon: <AddIcon />, name: 'Add' },
    { icon: <EditIcon />, name: 'Edit' },
    { icon: <DeleteIcon />, name: 'Delete' }
  ];

  return (
    <Container maxWidth="lg" sx={{
    py: 4
  }}>
      <Typography variant="h3" gutterBottom>
        MUI Migration Test Page
      </Typography>
      
      <Typography variant="body,1" color="text.secondary" paragraph>
        This page tests all migrated MUI components to ensure they work correctly with the unified theme.
      </Typography>

      {/* Theme Toggle */}
      <Box sx={{
    mb: 4
  }}>
        <Button variant="contained" onClick={toggleTheme}>
          Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
        <Typography variant="caption" sx={{
    ml: 2
  }}>
          Current theme: {mode}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Basic Components */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Basic Components
              </Typography>
              
              <Stack spacing={2}>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Primary Button
                </Button>
                <Button variant="outlined" startIcon={<EditIcon />}>
                  Secondary Button
                </Button>
                <Button variant="text" startIcon={<DeleteIcon />}>
                  Text Button
                </Button>
                
                <TextField
                  label="Text Field"
                  placeholder="Enter text..."
                  fullWidth
                />
                
                <FormControl fullWidth>
                  <InputLabel>Select Option</InputLabel>
                  <Select
                    value={value}
                    label="Select Option"
                    onChange={(e) => setValue(e.target.value)}
                  >
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{
                  display: 'flex', gap: 1, flexWrap: 'wrap'
                }}>
                  <Chip label="Default Chip" />
                  <Chip label="Primary Chip" color="primary" />
                  <Chip label="Success Chip" color="success" />
                  <Chip label="Warning Chip" color="warning" />
                  <Chip label="Error Chip" color="error" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Feedback Components */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Feedback Components
              </Typography>
              
              <Stack spacing={2}>
                <Alert severity="info">This is an info alert</Alert>
                <Alert severity="success">This is a success alert</Alert>
                <Alert severity="warning">This is a warning alert</Alert>
                <Alert severity="error">This is an error alert</Alert>
                
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 2
                }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2">Loading...</Typography>
                </Box>
                
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                />
                
                <Typography gutterBottom>Slider: {sliderValue}</Typography>
                <Slider
                  value={sliderValue}
                  onChange={(event, newValue) => setSliderValue(newValue)}
                  aria-label="Slider"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Navigation Components */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Navigation Components
              </Typography>
              
              <Stack spacing={2}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link underline="hover" color="inherit" href="#">
                    Home
                  </Link>
                  <Link underline="hover" color="inherit" href="#">
                    Core
                  </Link>
                  <Typography color="text.primary">Breadcrumbs</Typography>
                </Breadcrumbs>
                
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Tab 1" />
                  <Tab label="Tab 2" />
                  <Tab label="Tab 3" />
                </Tabs>
                
                <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Accordion 1</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      This is the content of accordion 1.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                
                <Button
                  variant="outlined"
                  onClick={handleMenuOpen}
                  endIcon={<ExpandMoreIcon />}
                >
                  Open Menu
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                  <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                </Menu>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Display Components */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Data Display Components
              </Typography>
              
              <Stack spacing={2}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccountIcon />
                    </ListItemIcon>
                    <ListItemText primary="List Item 1" secondary="Secondary text" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="List Item 2" secondary="Secondary text" />
                  </ListItem>
                </List>
                
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Item 1</TableCell>
                        <TableCell>
                          <Chip label="Active" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Item 2</TableCell>
                        <TableCell>
                          <Chip label="Pending" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{
    display: 'flex', gap: 1
  }}>
                  <Avatar>KA</Avatar>
                  <AvatarGroup max={4}>
                    <Avatar>KA</Avatar>
                    <Avatar>JD</Avatar>
                    <Avatar>SM</Avatar>
                  </AvatarGroup>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Components */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Form Components
              </Typography>
              
              <Stack spacing={2}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label="Checkbox 1" />
                  <FormControlLabel control={<Checkbox />} label="Checkbox 2" />
                </FormGroup>
                
                <RadioGroup value="option1">
                  <FormControlLabel value="option1" control={<Radio />} label="Radio 1" />
                  <FormControlLabel value="option2" control={<Radio />} label="Radio 2" />
                </RadioGroup>
                
                <FormControlLabel control={<Switch />} label="Switch" />
                
                <Box sx={{
    display: 'flex', gap: 2, alignItems: 'center'
  }}>
                  <IconButton color="primary">
                    <AddIcon />
                  </IconButton>
                  <IconButton color="secondary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Components */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Advanced Components
              </Typography>
              
              <Stack spacing={2}>
                <Button variant="contained" onClick={() => setOpen(true)}>
                  Open Dialog
                </Button>
                
                <Button variant="outlined" onClick={() => setDrawerOpen(true)}>
                  Open Drawer
                </Button>
                
                <Button variant="text" onClick={() => setBackdropOpen(true)}>
                  Show Backdrop
                </Button>
                
                <Fab color="primary" aria-label="add">
                  <AddIcon />
                </Fab>
                
                <SpeedDial
                  ariaLabel="SpeedDial"
                  sx={{
                    position: 'absolute', bottom: 16, right: 16
                  }}
                  icon={<SpeedDialIcon />}
                  open={speedDialOpen}
                  onOpen={() => setSpeedDialOpen(true)}
                  onClose={() => setSpeedDialOpen(false)}
                >
                  {actions.map((action) => (
                    <SpeedDialAction
                      key={action.name}
                      icon={action.icon}
                      tooltipTitle={action.name}
                    />
                  ))}
                </SpeedDial>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialogs and Modals */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>
          <Typography>
            This is a dialog content. It can contain any components.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{
          width: 250, p: 2
        }}>
          <Typography variant="h6" gutterBottom>
            Drawer Content
          </Typography>
          <Typography>
            This is a drawer that slides in from the right.
          </Typography>
        </Box>
      </Drawer>

      <Backdrop
        sx={{
          color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={backdropOpen}
        onClick={() => setBackdropOpen(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Skeleton Loading */}
      <Card sx={{
    mt: 4
  }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Skeleton Loading
          </Typography>
          <Stack spacing={1}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" height={118} />
          </Stack>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card sx={{
    mt: 4
  }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Pagination
          </Typography>
          <Pagination count={10} color="primary" />
        </CardContent>
      </Card>
    </Container>
  );
} 