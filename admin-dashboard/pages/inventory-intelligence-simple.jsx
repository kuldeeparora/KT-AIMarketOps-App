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
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  AlertTitle,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  AttachMoney as AttachMoneyIcon,
  Euro as EuroIcon,
  CurrencyPound as CurrencyPoundIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  Help as HelpIcon
} from '@mui/icons-material';

export default function InventoryIntelligenceSimple() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedInsight, setSelectedInsight] = useState(null);

  useEffect(() => {
    fetchIntelligenceData();
  }, []);

  const fetchIntelligenceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock intelligence data
      const mockInsights = generateMockInsights();
      const mockPredictions = generateMockPredictions();
      const mockTrends = generateMockTrends();
      const mockRecommendations = generateMockRecommendations();

      setInsights(mockInsights);
      setPredictions(mockPredictions);
      setTrends(mockTrends);
      setRecommendations(mockRecommendations);

    } catch (err) {
      console.error('Error fetching intelligence data:', err);
      setError('Failed to fetch intelligence data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockInsights = () => {
    return [
      {
        id: 1,
        type: 'trend',
        title: 'High Demand Products',
        description: 'Smart watches and wireless headphones showing 45% increase in demand',
        impact: 'high',
        confidence: 92,
        category: 'demand',
        icon: <TrendingUpIcon />,
        color: '#10B981',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actions: ['Increase stock', 'Monitor pricing', 'Update forecasts']
      },
      {
        id: 2,
        type: 'alert',
        title: 'Low Stock Alert',
        description: '15 products approaching minimum stock levels',
        impact: 'critical',
        confidence: 98,
        category: 'stock',
        icon: <WarningIcon />,
        color: '#EF4444',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        actions: ['Reorder items', 'Check suppliers', 'Update alerts']
      },
      {
        id: 3,
        type: 'opportunity',
        title: 'Seasonal Opportunity',
        description: 'Back-to-school items showing early demand signals',
        impact: 'medium',
        confidence: 85,
        category: 'seasonal',
        icon: <LightbulbIcon />,
        color: '#F59E0B',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        actions: ['Prepare inventory', 'Update marketing', 'Set pricing']
      },
      {
        id: 4,
        type: 'efficiency',
        title: 'Warehouse Optimization',
        description: 'Aisle A-12 has 30% more efficient picking patterns',
        impact: 'medium',
        confidence: 88,
        category: 'operations',
        icon: <SpeedIcon />,
        color: '#4F8CFF',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        actions: ['Replicate patterns', 'Train staff', 'Update layout']
      }
    ];
  };

  const generateMockPredictions = () => {
    return [
      {
        id: 1,
        product: 'Smart Watch Pro',
        currentStock: 45,
        predictedDemand: 120,
        confidence: 89,
        timeframe: '30 days',
        risk: 'low',
        recommendation: 'Increase stock by 75 units'
      },
      {
        id: 2,
        product: 'Wireless Headphones',
        currentStock: 23,
        predictedDemand: 85,
        confidence: 92,
        timeframe: '30 days',
        risk: 'medium',
        recommendation: 'Reorder 62 units immediately'
      },
      {
        id: 3,
        product: 'Laptop Stand',
        currentStock: 67,
        predictedDemand: 45,
        confidence: 78,
        timeframe: '30 days',
        risk: 'low',
        recommendation: 'Maintain current stock levels'
      },
      {
        id: 4,
        product: 'USB-C Hub',
        currentStock: 12,
        predictedDemand: 95,
        confidence: 95,
        timeframe: '30 days',
        risk: 'high',
        recommendation: 'Urgent reorder of 83 units'
      }
    ];
  };

  const generateMockTrends = () => {
    return [
      {
        id: 1,
        category: 'Electronics',
        trend: 'up',
        percentage: 23,
        period: 'vs last month',
        products: 45,
        revenue: '£12,450'
      },
      {
        id: 2,
        category: 'Accessories',
        trend: 'up',
        percentage: 15,
        period: 'vs last month',
        products: 32,
        revenue: '£8,230'
      },
      {
        id: 3,
        category: 'Wearables',
        trend: 'down',
        percentage: 8,
        period: 'vs last month',
        products: 18,
        revenue: '£5,120'
      },
      {
        id: 4,
        category: 'Office Supplies',
        trend: 'up',
        percentage: 31,
        period: 'vs last month',
        products: 28,
        revenue: '£9,870'
      }
    ];
  };

  const generateMockRecommendations = () => {
    return [
      {
        id: 1,
        type: 'stock',
        title: 'Optimize Stock Levels',
        description: 'Adjust minimum stock levels for 23 products based on demand patterns',
        priority: 'high',
        impact: '£15,000 potential savings',
        effort: 'medium',
        category: 'optimization'
      },
      {
        id: 2,
        type: 'pricing',
        title: 'Dynamic Pricing Strategy',
        description: 'Implement dynamic pricing for 15 high-demand products',
        priority: 'medium',
        impact: '£8,500 additional revenue',
        effort: 'high',
        category: 'revenue'
      },
      {
        id: 3,
        type: 'supplier',
        title: 'Supplier Diversification',
        description: 'Add 2 new suppliers for critical components to reduce risk',
        priority: 'medium',
        impact: 'Reduced supply chain risk',
        effort: 'medium',
        category: 'risk'
      },
      {
        id: 4,
        type: 'warehouse',
        title: 'Warehouse Layout Optimization',
        description: 'Reorganize high-demand products for faster picking',
        priority: 'low',
        impact: '20% faster order fulfillment',
        effort: 'low',
        category: 'efficiency'
      }
    ];
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#4F8CFF';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? '#10B981' : '#EF4444';
  };

  return (
    <Layout>
      <Head>
        <title>Inventory Intelligence - Kent Traders Admin</title>
        <meta name="description" content="AI-powered inventory intelligence and predictive analytics" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #E8E8EA 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Inventory Intelligence
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            AI-powered insights, predictive analytics, and smart recommendations for optimal inventory management
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* AI Insights Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <AutoAwesomeIcon sx={{ color: '#4F8CFF' }} />
              AI Insights
            </Typography>
          </Grid>
          {insights.map((insight) => (
            <Grid item xs={12} md={6} lg={3} key={insight.id}>
              <Card
                sx={{
                  background: 'background.paper',
                  border: '1px solid',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
                onClick={() => setSelectedInsight(insight)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${insight.color} 0%, ${insight.color}80 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${insight.color}40`,
                      }}
                    >
                      {insight.icon}
                    </Box>
                    <Chip
                      label={insight.impact.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: `${insight.color}20`,
                        color: insight.color,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      mb: 1,
                      fontSize: '1rem',
                    }}
                  >
                    {insight.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                      lineHeight: 1.5,
                    }}
                  >
                    {insight.description}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography 
                      variant="caption" 
                      sx={{ color: '#71717A' }}
                    >
                      {new Date(insight.timestamp).toLocaleString()}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: insight.color,
                        fontWeight: 600,
                      }}
                    >
                      {insight.confidence}% confidence
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Predictions and Trends */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Demand Predictions */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <PsychologyIcon sx={{ color: '#4F8CFF' }} />
                  Demand Predictions
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Product</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Current</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Predicted</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Risk</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {predictions.map((prediction) => (
                        <TableRow key={prediction.id}>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {prediction.product}
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {prediction.currentStock}
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {prediction.predictedDemand}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={prediction.risk}
                              size="small"
                              sx={{
                                backgroundColor: prediction.risk === 'high' ? '#EF444420' : 
                                               prediction.risk === 'medium' ? '#F59E0B20' : '#10B98120',
                                color: prediction.risk === 'high' ? '#EF4444' : 
                                       prediction.risk === 'medium' ? '#F59E0B' : '#10B981',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Trends */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <TimelineIcon sx={{ color: '#4F8CFF' }} />
                  Category Trends
                </Typography>
                <Stack spacing={2}>
                  {trends.map((trend) => (
                    <Box key={trend.id} display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${getTrendColor(trend.trend)} 0%, ${getTrendColor(trend.trend)}80 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 2px 8px ${getTrendColor(trend.trend)}40`,
                          }}
                        >
                          {getTrendIcon(trend.trend)}
                        </Box>
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'text.primary' 
                            }}
                          >
                            {trend.category}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ color: '#71717A' }}
                          >
                            {trend.products} products
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: getTrendColor(trend.trend) 
                          }}
                        >
                          {trend.trend === 'up' ? '+' : ''}{trend.percentage}%
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ color: '#71717A' }}
                        >
                          {trend.revenue}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Smart Recommendations */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <LightbulbIcon sx={{ color: '#4F8CFF' }} />
              Smart Recommendations
            </Typography>
          </Grid>
          {recommendations.map((recommendation) => (
            <Grid item xs={12} md={6} key={recommendation.id}>
              <Card
                sx={{
                  background: 'background.paper',
                  border: '1px solid',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Chip
                      label={recommendation.priority.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: recommendation.priority === 'high' ? '#EF444420' : 
                                       recommendation.priority === 'medium' ? '#F59E0B20' : '#10B98120',
                        color: recommendation.priority === 'high' ? '#EF4444' : 
                               recommendation.priority === 'medium' ? '#F59E0B' : '#10B981',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={recommendation.effort}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#3A3A3D',
                        color: 'text.secondary',
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    {recommendation.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                      lineHeight: 1.5,
                    }}
                  >
                    {recommendation.description}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#10B981',
                        fontWeight: 600,
                      }}
                    >
                      {recommendation.impact}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#4F8CFF',
                        color: '#4F8CFF',
                        '&:hover': {
                          borderColor: '#6BA1FF',
                          backgroundColor: 'rgba(79, 140, 255, 0.1)',
                        },
                      }}
                    >
                      Implement
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Loading Overlay */}
        {loading && (
          <Box position="fixed" top={0} left={0} right={0} zIndex={9999}>
            <LinearProgress />
          </Box>
        )}
      </Container>
    </Layout>
  );
}
