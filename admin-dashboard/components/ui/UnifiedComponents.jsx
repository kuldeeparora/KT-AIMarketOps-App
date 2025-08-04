import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  Container,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Switch,
  Slider,
  Rating,
  Autocomplete,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
  Avatar,
  AvatarGroup,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Backdrop,
  Drawer,
  AppBar,
  Toolbar,
  Menu,
  MenuItem as MenuItemComponent} from '@mui/material';
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
  Success as SuccessIcon} from '@mui/icons-material';

// Unified Card Component (Polaris Card → MUI Card)
export const UnifiedCard = ({
  title,
  children,
  actions,
  variant = 'elevation',
  elevation = 1,
  ...props
}) => {
  return (
    <Card variant={variant} elevation={elevation} {...props}>
      {title && (
        <CardHeader
          title={
            <Typography variant='h6' component='div'>
              {title}
            </Typography>
          }
        />
      )}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
};

// Unified Button Component (Polaris Button → MUI Button)
export const UnifiedButton = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  return (
    <Button
      variant={variant} color={color}
      size={size} startIcon={startIcon}
      endIcon={endIcon} disabled={disabled}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </Button>
  );
};

// Unified Text Component (Polaris Text → MUI Typography)
export const UnifiedText = ({
  children,
  variant = 'body,1',
  color = 'textPrimary',
  align = 'inherit',
  gutterBottom = false,
  noWrap = false,
  ...props
}) => {
  return (
    <Typography
      variant={variant} color={color}
      align={align} gutterBottom={gutterBottom}
      noWrap={noWrap}
      {...props}
    >
      {children}
    </Typography>
  );
};

// Unified Badge Component (Polaris Badge → MUI Chip)
export const UnifiedBadge = ({
  children,
  color = 'default',
  variant = 'filled',
  size = 'medium',
  ...props
}) => {
  return <Chip label={children} color={color} variant={variant} size={size} {...props} />;
};

// Unified Banner Component (Polaris Banner → MUI Alert)
export const UnifiedBanner = ({
  children,
  severity = 'info',
  variant = 'filled',
  action,
  ...props
}) => {
  return (
    <Alert severity={severity} variant={variant} action={action} {...props}>
      {children}
    </Alert>
  );
};

// Unified Spinner Component (Polaris Spinner → MUI CircularProgress)
export const UnifiedSpinner = ({ size = 40, color = 'primary', thickness = 4, ...props }) => {
  return <CircularProgress size={size} color={color} thickness={thickness} {...props} />;
};

// Unified TextField Component (Polaris TextField → MUI TextField)
export const UnifiedTextField = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  required = false,
  error = false,
  helperText,
  multiline = false,
  rows = 1,
  ...props
}) => {
  return (
    <TextField
      label={label} placeholder={placeholder}
      value={value} onChange={onChange}
      type={type} variant={variant}
      size={size} fullWidth={fullWidth}
      required={required} error={error}
      helperText={helperText} multiline={multiline}
      rows={rows}
      {...props}
    />
  );
};

// Unified Select Component (Polaris Select → MUI Select)
export const UnifiedSelect = ({
  label,
  value,
  onChange,
  options = [],
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  required = false,
  error = false,
  helperText,
  ...props
}) => {
  return (
    <FormControl
      variant={variant} size={size}
      fullWidth={fullWidth} required={required}
      error={error}
    >
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange} label={label} {...props}>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography variant='caption' color='error'>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

// Unified Modal Component (Polaris Modal → MUI Dialog)
export const UnifiedModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} {...props}>
      {title && (
        <DialogTitle>
          <Typography variant='h6'>{title}</Typography>
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

// Unified DataTable Component (Polaris DataTable → MUI Table)
export const UnifiedDataTable = ({
  columns = [],
  data = [],
  pagination = false,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  ...props
}) => {
  return (
    <TableContainer component={Paper} {...props}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.field}>
                <Typography variant='subtitle2' fontWeight={600}>
                  {column.headerName}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map(column => (
                <TableCell key={column.field}>
                  {column.renderCell ? column.renderCell(row) : row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          component='div'
          count={data.length} page={page}
          onPageChange={onPageChange} rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </TableContainer>
  );
};

// Unified Grid Component (Polaris Grid → MUI Grid)
export const UnifiedGrid = ({
  children,
  container = false,
  item = false,
  spacing = 2,
  ...props
}) => {
  return (
    <Grid container={container} item={item} spacing={spacing} {...props}>
      {children}
    </Grid>
  );
};

// Unified Stack Component (Polaris Stack → MUI Stack)
export const UnifiedStack = ({ children, direction = 'column', spacing = 2, ...props }) => {
  return (
    <Stack direction={direction} spacing={spacing} {...props}>
      {children}
    </Stack>
  );
};

// Unified Page Component (Polaris Page → MUI Container)
export const UnifiedPage = ({ children, maxWidth = 'lg', ...props }) => {
  return (
    <Container maxWidth={maxWidth} {...props}>
      {children}
    </Container>
  );
};

// Unified Frame Component (Polaris Frame → MUI Box)
export const UnifiedFrame = ({ children, ...props }) => {
  return <Box {...props}>{children}</Box>;
};

// Export all components for easy import
export {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  Container,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Switch,
  Slider,
  Rating,
  Autocomplete,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination};
