import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  SmartToy as SmartToyIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Extension as ExtensionIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Storefront as StorefrontIcon,
  Search as SearchIcon,
  Support as SupportIcon,
  AutoAwesome as AutoAwesomeIcon,
  RocketLaunch as RocketLaunchIcon,
  CreditCard as CreditCardIcon,
  Description as DescriptionIcon,
  PieChart as PieChartIcon,
  PsychologyAlt as PsychologyAltIcon,
  LocalMall as LocalMallIcon,
  Power as PowerIcon,
} from '@mui/icons-material';

export default function FeaturesOverview() {
  const [activeCategory, setActiveCategory] = useState('all');
  const theme = useTheme();

  const features = {
    core: [
      {
        name: 'Dashboard',
        description: 'Main dashboard with key metrics and quick actions',
        status: 'active',
        icon: <DashboardIcon />,
        href: '/'
      },
      {
        name: 'Inventory Management',
        description: 'Advanced inventory tracking with dual data sources',
        status: 'active',
        icon: <InventoryIcon />,
        href: '/inventory-advanced'
      },
      {
        name: 'Order Management',
        description: 'Complete order processing and tracking system',
        status: 'active',
        icon: <ShoppingCartIcon />,
        href: '/orders'
      },
      {
        name: 'Customer Management',
        description: 'Customer database and relationship management',
        status: 'active',
        icon: <PeopleIcon />,
        href: '/customers'
      }
    ],
    analytics: [
      {
        name: 'Analytics Dashboard',
        description: 'Business intelligence and performance metrics',
        status: 'active',
        icon: <AnalyticsIcon />,
        href: '/analytics'
      },
      {
        name: 'Sales Dashboard',
        description: 'Comprehensive sales analytics and trends',
        status: 'active',
        icon: <TrendingUpIcon />,
        href: '/sales-dashboard'
      },
      {
        name: 'Reports',
        description: 'Custom report generation and export',
        status: 'active',
        icon: <AssessmentIcon />,
        href: '/reports'
      }
    ],
    marketplace: [
      {
        name: 'Marketplace Insights',
        description: 'Amazon and eBay marketplace analytics',
        status: 'active',
        icon: <StorefrontIcon />,
        href: '/marketplace-insights-advanced'
      },
      {
        name: 'Amazon Inventory',
        description: 'Amazon inventory tracking and management',
        status: 'active',
        icon: <StoreIcon />,
        href: '/amazon-inventory'
      },
      {
        name: 'Market Intelligence',
        description: 'Competitive analysis and market trends',
        status: 'active',
        icon: <SearchIcon />,
        href: '/market-intelligence'
      }
    ],
    ai: [
      {
        name: 'AI Support Bot',
        description: 'Intelligent customer support and assistance',
        status: 'active',
        icon: <SupportIcon />,
        href: '/ai-support-bot'
      },
      {
        name: 'AI Product Generator',
        description: 'AI-powered product description generation',
        status: 'active',
        icon: <AutoAwesomeIcon />,
        href: '/ai-product-generator'
      },
      {
        name: 'AI Copilot',
        description: 'AI assistant for business operations',
        status: 'active',
        icon: <SmartToyIcon />,
        href: '/ai-copilot'
      }
    ],
    finance: [
      {
        name: 'Financial Management',
        description: 'P&L calculator, invoicing, and banking integration',
        status: 'active',
        icon: <CreditCardIcon />,
        href: '/financial-management'
      },
      {
        name: 'Invoicing',
        description: 'Professional invoice creation and management',
        status: 'active',
        icon: <DescriptionIcon />,
        href: '/invoicing'
      },
      {
        name: 'Profit & Loss',
        description: 'Detailed P&L analysis and reporting',
        status: 'active',
        icon: <PieChartIcon />,
        href: '/profit-and-loss'
      }
    ],
    advanced: [
      {
        name: 'Inventory Intelligence',
        description: 'Advanced inventory optimization and forecasting',
        status: 'active',
        icon: <PsychologyAltIcon />,
        href: '/inventory-intelligence-advanced'
      },
      {
        name: 'Enhanced Cart System',
        description: 'Advanced shopping cart functionality',
        status: 'active',
        icon: <LocalMallIcon />,
        href: '/enhanced-cart-system'
      },
      {
        name: 'Plugin Management',
        description: 'Plugin installation and configuration',
        status: 'active',
        icon: <ExtensionIcon />,
        href: '/plugins'
      }
    ]
  };

  const categories = [
    { id: 'all', name: 'All Features', icon: <StarIcon /> },
    { id: 'core', name: 'Core Features', icon: <SettingsIcon /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChartIcon /> },
    { id: 'marketplace', name: 'Marketplace', icon: <StorefrontIcon /> },
    { id: 'ai', name: 'AI Features', icon: <SmartToyIcon /> },
    { id: 'finance', name: 'Finance', icon: <CreditCardIcon /> },
    { id: 'advanced', name: 'Advanced', icon: <RocketLaunchIcon /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'beta':
        return 'warning';
      case 'coming-soon':
        return 'default';
      default:
        return 'default';
    }
  };

  const filteredFeatures = activeCategory === 'all' 
    ? Object.values(features).flat()
    : features[activeCategory] || [];

  const totalFeatures = Object.values(features).flat().length;
  const activeFeatures = Object.values(features).flat().filter(f => f.status === 'active').length;
  const betaFeatures = Object.values(features).flat().filter(f => f.status === 'beta').length;

  return (
    <>
      <Head>
        <title>Features Overview - Kent Traders Admin</title>
        <meta name="description" content="Complete overview of all available features" />
      </Head>
      
      <Layout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Features Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete overview of all available features and functionality
            </Typography>
          </Box>

          {/* Category Filter */}
          <Paper sx={{ mb: 4, p: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'contained' : 'outlined'}
                  startIcon={category.icon}
                  onClick={() => setActiveCategory(category.id)}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                    py: 1
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </Box>
          </Paper>

          {/* Features Grid */}
          <Grid container spacing={3}>
            {filteredFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ 
                        color: 'primary.main', 
                        mr: 2, 
                        mt: 0.5,
                        '& .MuiSvgIcon-root': {
                          fontSize: '2rem'
                        }
                      }}>
                        {feature.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {feature.name}
                        </Typography>
                        <Chip 
                          label={feature.status} 
                          color={getStatusColor(feature.status)}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={Link}
                      href={feature.href}
                      variant="contained"
                      size="small"
                      endIcon={<RocketLaunchIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      View Feature
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Feature Statistics */}
          <Paper sx={{ mt: 4, p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Feature Statistics
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="div" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {totalFeatures}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Features
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="div" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {activeFeatures}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Features
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="div" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {betaFeatures}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Beta Features
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="div" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                    {categories.length - 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categories
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Layout>
    </>
  );
}
