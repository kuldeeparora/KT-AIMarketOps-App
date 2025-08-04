import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  Store as StoreIcon,
  AccountBalance as AccountBalanceIcon,
  RocketLaunch as RocketLaunchIcon,
  Monitor as MonitorIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Integration as IntegrationIcon,
  SmartToy as SmartToyIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useAIMarketOpsTheme } from './AIMarketOpsTheme';
import ProtectedRoute from './auth/ProtectedRoute';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
    badge: null,
  },
  {
    text: 'Admin Approvals',
    icon: <SecurityIcon />,
    path: '/admin-approvals',
    badge: null,
  },
  {
    text: 'Features Overview',
    icon: <InfoIcon />,
    path: '/features-overview',
    badge: null,
  },
  {
    text: 'Notifications',
    icon: <NotificationsIcon />,
    path: '/notifications',
    badge: 3,
  },
  {
    text: 'Inventory',
    icon: <InventoryIcon />,
    path: '/inventory',
    badge: null,
  },
  {
    text: 'Marketplace',
    icon: <StoreIcon />,
    children: [
      {
        text: 'Marketplace Overview',
        path: '/marketplace',
        badge: null,
      },
      {
        text: 'Amazon Integration',
        path: '/marketplace/amazon',
        badge: null,
      },
      {
        text: 'eBay Integration',
        path: '/marketplace/ebay',
        badge: null,
      },
      {
        text: 'Facebook Marketplace',
        path: '/marketplace/facebook',
        badge: null,
      },
      {
        text: 'Instagram Shopping',
        path: '/marketplace/instagram',
        badge: null,
      },
      {
        text: 'Google Shopping',
        path: '/marketplace/google',
        badge: null,
      },
      {
        text: 'Product Sync',
        path: '/marketplace/sync',
        badge: null,
      },
      {
        text: 'Order Management',
        path: '/marketplace/orders',
        badge: null,
      },
      {
        text: 'Analytics',
        path: '/marketplace/analytics',
        badge: null,
      },
      {
        text: 'Settings',
        path: '/marketplace/settings',
        badge: null,
      },
    ],
  },
  {
    text: 'Finance',
    icon: <AccountBalanceIcon />,
    children: [
      {
        text: 'Finance Overview',
        path: '/finance',
        badge: null,
      },
      {
        text: 'P&L Statement',
        path: '/finance/pnl',
        badge: null,
      },
      {
        text: 'Invoices',
        path: '/finance/invoices',
        badge: null,
      },
      {
        text: 'Expenses',
        path: '/finance/expenses',
        badge: null,
      },
      {
        text: 'Accounts',
        path: '/finance/accounts',
        badge: null,
      },
      {
        text: 'Cash Flow',
        path: '/finance/cash-flow',
        badge: null,
      },
      {
        text: 'Reports',
        path: '/finance/reports',
        badge: null,
      },
      {
        text: 'Settings',
        path: '/finance/settings',
        badge: null,
      },
    ],
  },
  {
    text: 'Monitoring Dashboard',
    icon: <MonitorIcon />,
    children: [
      {
        text: 'System Overview',
        path: '/monitoring-dashboard',
        badge: null,
      },
      {
        text: 'System Status',
        path: '/monitoring-dashboard/status',
        badge: null,
      },
      {
        text: 'Alerts',
        path: '/monitoring-dashboard/alerts',
        badge: null,
      },
      {
        text: 'Performance',
        path: '/monitoring-dashboard/performance',
        badge: null,
      },
      {
        text: 'Logs',
        path: '/monitoring-dashboard/logs',
        badge: null,
      },
      {
        text: 'Notifications',
        path: '/monitoring-dashboard/notifications',
        badge: null,
      },
      {
        text: 'Settings',
        path: '/monitoring-dashboard/settings',
        badge: null,
      },
    ],
  },
  {
    text: 'AI/AGI Systems',
    icon: <SmartToyIcon />,
    children: [
      {
        text: 'AI Dashboard',
        path: '/ai-dashboard',
        badge: null,
      },
      {
        text: 'Predictive Analytics',
        path: '/ai-dashboard?system=predictive-analytics',
        badge: null,
      },
      {
        text: 'Autonomous Decisions',
        path: '/ai-dashboard?system=autonomous-decision-maker',
        badge: null,
      },
      {
        text: 'Real-time Personalization',
        path: '/ai-dashboard?system=real-time-personalization',
        badge: null,
      },
      {
        text: 'Multi-modal AI',
        path: '/ai-dashboard?system=multi-modal-ai',
        badge: null,
      },
      {
        text: 'Performance Optimizer',
        path: '/ai-dashboard?system=performance-optimizer',
        badge: null,
      },
      {
        text: 'Unified AI/AGI System',
        path: '/ai-dashboard?system=unified-system',
        badge: null,
      },
      {
        text: 'AI Analytics',
        path: '/ai-dashboard/analytics',
        badge: null,
      },
      {
        text: 'AI Monitoring',
        path: '/ai-dashboard/monitoring',
        badge: null,
      },
      {
        text: 'AI Settings',
        path: '/ai-dashboard/settings',
        badge: null,
      },
    ],
  },
  {
    text: 'Advanced Features',
    icon: <AutoAwesomeIcon />,
    children: [
      {
        text: 'Features Overview',
        path: '/advanced-features',
        badge: null,
      },
      {
        text: 'AI Features',
        path: '/advanced-features/ai',
        badge: null,
      },
      {
        text: 'Automations',
        path: '/advanced-features/automations',
        badge: null,
      },
      {
        text: 'Integrations',
        path: '/advanced-features/integrations',
        badge: null,
      },
      {
        text: 'Analytics',
        path: '/advanced-features/analytics',
        badge: null,
      },
      {
        text: 'Settings',
        path: '/advanced-features/settings',
        badge: null,
      },
    ],
  },
  {
    text: 'Inventory Management',
    icon: <InventoryIcon />,
    children: [
      {
        text: 'Unified Inventory',
        path: '/inventory-unified',
        badge: null,
      },
      {
        text: 'Inventory Advanced',
        path: '/inventory-advanced',
        badge: null,
      },
      {
        text: 'Inventory Intelligence',
        path: '/inventory-intelligence',
        badge: null,
      },
      {
        text: 'Inventory Intelligence Advanced',
        path: '/inventory-intelligence-advanced',
        badge: null,
      },
      {
        text: 'Inventory Intelligence Simple',
        path: '/inventory-intelligence-simple',
        badge: null,
      },
      {
        text: 'Inventory Alerts',
        path: '/inventory-alerts',
        badge: null,
      },
      {
        text: 'Inventory Analytics',
        path: '/inventory-analytics',
        badge: null,
      },
      {
        text: 'Inventory Optimization',
        path: '/inventory-optimization',
        badge: null,
      },
      {
        text: 'Inventory Automation',
        path: '/inventory-automation',
        badge: null,
      },
      {
        text: 'Inventory Relationships',
        path: '/inventory-relationships',
        badge: null,
      },
      {
        text: 'Inventory Reporting',
        path: '/inventory-reporting',
        badge: null,
      },
      {
        text: 'Stock Levels',
        path: '/stock-levels',
        badge: null,
      },
    ],
  },
  {
    text: 'Orders & Sales',
    icon: <ShoppingCartIcon />,
    children: [
      {
        text: 'Orders',
        path: '/orders',
        badge: null,
      },
      {
        text: 'Purchase Orders',
        path: '/purchase-orders',
        badge: null,
      },
      {
        text: 'Invoices',
        path: '/invoices',
        badge: null,
      },
      {
        text: 'Customers',
        path: '/customers',
        badge: null,
      },
      {
        text: 'Products',
        path: '/products',
        badge: null,
      },
      {
        text: 'Sales Dashboard',
        path: '/sales-dashboard',
        badge: null,
      },
    ],
  },
  {
    text: 'Analytics & Intelligence',
    icon: <AnalyticsIcon />,
    children: [
      {
        text: 'Analytics',
        path: '/analytics-enhanced',
        badge: null,
      },
      {
        text: 'Reports',
        path: '/reports',
        badge: null,
      },
      {
        text: 'Market Intelligence',
        path: '/market-intelligence',
        badge: null,
      },
    ],
  },
  {
    text: 'AI & Automation',
    icon: <SpeedIcon />,
    children: [
      {
        text: 'AI Copilot',
        path: '/ai-copilot',
        badge: null,
      },
      {
        text: 'Test Data Flow',
        path: '/test-data-flow',
        badge: null,
      },
      {
        text: 'SEO Automation',
        path: '/seo-automation',
        badge: null,
      },
    ],
  },
  {
    text: 'User Management',
    icon: <PeopleIcon />,
    children: [
      {
        text: 'User Management',
        path: '/user-management',
        badge: null,
      },
      {
        text: 'User Activity',
        path: '/user-activity',
        badge: null,
      },
      {
        text: 'Role Management',
        path: '/role-management',
        badge: null,
      },
    ],
  },
  {
    text: 'Vendor Management',
    icon: <BusinessIcon />,
    children: [
      {
        text: 'Vendor Management',
        path: '/vendor-management',
        badge: null,
      },
      {
        text: 'Vendor Integration',
        path: '/vendor-integration',
        badge: null,
      },
    ],
  },
  {
    text: 'Reports',
    icon: <AssessmentIcon />,
    children: [
      {
        text: 'Sales Reports',
        path: '/reports/sales',
        badge: null,
      },
      {
        text: 'Inventory Reports',
        path: '/reports/inventory',
        badge: null,
      },
      {
        text: 'Customer Reports',
        path: '/reports/customers',
        badge: null,
      },
      {
        text: 'Financial Reports',
        path: '/reports/financial',
        badge: null,
      },
    ],
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    children: [
      {
        text: 'General Settings',
        path: '/settings',
        badge: null,
      },
      {
        text: 'Security',
        path: '/security',
        badge: null,
      },
      {
        text: 'Backup',
        path: '/backup',
        badge: null,
      },
    ],
  },
];

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  
  // Handle theme context safely
  let mode = 'dark';
  let toggleMode = () => {};
  
  try {
    const themeContext = useAIMarketOpsTheme();
    mode = themeContext.mode;
    toggleMode = themeContext.toggleMode;
  } catch (error) {
    console.warn('Theme context not available, using defaults');
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionToggle = (sectionText) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionText]: !prev[sectionText],
    }));
  };

  const renderMenuItem = (item, level = 0) => {
    const isExpanded = expandedSections[item.text] || false;
    const hasChildren = item.children && item.children.length > 0;
    const isChild = level > 0;

    return (
      <Box key={item.text}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            href={item.path}
            onClick={hasChildren ? () => handleSectionToggle(item.text) : undefined}
            sx={{
              borderRadius: isChild ? 1 : 2,
              py: isChild ? 1 : 1.5,
              px: 2,
              pl: isChild ? 2 : 2,
              ml: isChild ? 1 : 0,
              backgroundColor: isChild ? 'rgba(42, 42, 45, 0.3)' : 'transparent',
              borderLeft: isChild ? '2px solid #3A3A3D' : 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: isChild 
                  ? 'rgba(79, 140, 255, 0.15)' 
                  : 'rgba(79, 140, 255, 0.1)',
                transform: isChild ? 'translateX(2px)' : 'translateX(4px)',
                borderLeftColor: isChild ? '#4F8CFF' : 'transparent',
              },
              '&.active': {
                backgroundColor: 'rgba(79, 140, 255, 0.15)',
                borderLeft: '3px solid #4F8CFF',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: isChild ? 35 : 40,
                color: isChild ? '#A1A1AA' : 'text.secondary',
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontSize: isChild ? '0.8rem' : '0.875rem',
                  fontWeight: isChild ? 400 : 500,
                  color: isChild ? '#A1A1AA' : 'text.primary',
                },
              }}
            />
            {hasChildren && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSectionToggle(item.text);
                }}
                sx={{
                  color: 'text.secondary',
                  transition: 'transform 0.2s ease-in-out',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
            {item.badge && (
              <Badge
                badgeContent={item.badge}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    minWidth: 18,
                    height: 18,
                  },
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List 
              component="div" 
              disablePadding
              sx={{
                backgroundColor: 'rgba(26, 26, 29, 0.5)',
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              }}
            >
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'background.paper',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
              fontSize: '1.2rem',
              fontWeight: 600,
            }}
          >
            KT
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'text.primary',
                letterSpacing: '-0.02em',
              }}
            >
              AIMarketOps
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 2 }}>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          background: 'background.paper',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
              src={session?.user?.image}
            >
              {session?.user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '0.875rem',
                }}
              >
                {session?.user?.name || 'User'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  textTransform: 'capitalize',
                }}
              >
                {session?.user?.role || 'user'}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="User Menu">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Typography variant="body2">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Typography variant="body2">Settings</Typography>
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={() => {
                  setAnchorEl(null);
                  signOut({ callbackUrl: '/auth/signin' });
                }}
              >
                <LogoutIcon sx={{ mr: 1 }} />
                <Typography variant="body2">Sign Out</Typography>
              </MenuItem>
            </Menu>
            <Tooltip title="Logout">
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                  },
                }}
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton
                onClick={toggleMode}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Remove the mounted check to fix loading issue
  // The component should render immediately

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex' }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            background: 'background.default',
            position: 'relative',
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          {/* Top Bar */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              backgroundColor: 'background.paper',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  ml: -1.5,
                  color: 'text.secondary',
                  mr: 2,
                  display: { sm: 'none' },
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Account */}
              <Tooltip title="Account">
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>

              {/* Theme Toggle */}
              <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
                <IconButton
                  onClick={toggleMode}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Page Content */}
          <Box
            sx={{
              p: 3,
              minHeight: 'calc(100vh - 80px)',
              animation: 'fadeIn 0.3s ease-in-out',
              backgroundColor: 'background.default',
              color: 'text.primary',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
