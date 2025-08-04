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
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Slider
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
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
  VerifiedUser as VerifiedUserIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  DataUsage as DataUsageIcon,
  Storage as StorageIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Sync as SyncIcon,
  BugReport as BugReportIcon,
  Build as BuildIcon,
  Test as TestIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  Block as BlockIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon,
  SupervisedUserCircle as SupervisedUserIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  Web as WebIcon,
  Article as ArticleIcon,
  Description as DescriptionIcon,
  Tag as TagIcon,
  Label as LabelIcon,
  Link as LinkIcon,
  Share as ShareIcon,
  Campaign as CampaignIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

export default function SeoAutomation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seoData, setSeoData] = useState({});
  const [keywords, setKeywords] = useState([]);
  const [performance, setPerformance] = useState({});
  const [optimizations, setOptimizations] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock SEO data
      const mockSeoData = generateMockSeoData();
      const mockKeywords = generateMockKeywords();
      const mockPerformance = generateMockPerformance();
      const mockOptimizations = generateMockOptimizations();
      const mockAutomationRules = generateMockAutomationRules();

      setSeoData(mockSeoData);
      setKeywords(mockKeywords);
      setPerformance(mockPerformance);
      setOptimizations(mockOptimizations);
      setAutomationRules(mockAutomationRules);

    } catch (err) {
      console.error('Error fetching SEO data:', err);
      setError('Failed to fetch SEO data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSeoData = () => {
    return {
      overallScore: 87,
      pageSpeed: 92,
      mobileScore: 89,
      accessibility: 94,
      bestPractices: 91,
      seoScore: 85,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      totalPages: 156,
      indexedPages: 142,
      crawlErrors: 3,
      brokenLinks: 7,
      duplicateContent: 2,
      missingMeta: 5
    };
  };

  const generateMockKeywords = () => {
    return [
      {
        id: 1,
        keyword: 'smart watch',
        position: 3,
        change: 2,
        volume: 12000,
        difficulty: 45,
        cpc: 2.50,
        status: 'ranking'
      },
      {
        id: 2,
        keyword: 'wireless headphones',
        position: 8,
        change: -1,
        volume: 8500,
        difficulty: 62,
        cpc: 3.20,
        status: 'ranking'
      },
      {
        id: 3,
        keyword: 'laptop accessories',
        position: 15,
        change: 3,
        volume: 6500,
        difficulty: 38,
        cpc: 1.80,
        status: 'ranking'
      },
      {
        id: 4,
        keyword: 'tech gadgets',
        position: 22,
        change: -2,
        volume: 4200,
        difficulty: 71,
        cpc: 4.10,
        status: 'ranking'
      },
      {
        id: 5,
        keyword: 'electronic devices',
        position: 5,
        change: 1,
        volume: 9800,
        difficulty: 55,
        cpc: 2.90,
        status: 'ranking'
      }
    ];
  };

  const generateMockPerformance = () => {
    return {
      pageSpeed: {
        desktop: 92,
        mobile: 89,
        trend: 'up'
      },
      coreWebVitals: {
        lcp: 2.1,
        fid: 45,
        cls: 0.08
      },
      traffic: {
        organic: 15420,
        paid: 3240,
        direct: 8920,
        referral: 2150
      },
      conversions: {
        rate: 3.2,
        total: 492,
        value: 15680
      }
    };
  };

  const generateMockOptimizations = () => {
    return [
      {
        id: 1,
        type: 'content',
        title: 'Optimize Product Descriptions',
        description: 'Improve product descriptions with better keyword integration',
        priority: 'high',
        impact: '15% traffic increase',
        effort: 'medium',
        status: 'pending'
      },
      {
        id: 2,
        type: 'technical',
        title: 'Fix Mobile Responsiveness',
        description: 'Resolve mobile layout issues on product pages',
        priority: 'high',
        impact: '20% mobile conversion',
        effort: 'low',
        status: 'in-progress'
      },
      {
        id: 3,
        type: 'content',
        title: 'Add Meta Descriptions',
        description: 'Add missing meta descriptions to 45 pages',
        priority: 'medium',
        impact: '10% CTR improvement',
        effort: 'low',
        status: 'completed'
      },
      {
        id: 4,
        type: 'technical',
        title: 'Optimize Images',
        description: 'Compress and optimize product images',
        priority: 'medium',
        impact: '25% page speed improvement',
        effort: 'high',
        status: 'pending'
      }
    ];
  };

  const generateMockAutomationRules = () => {
    return [
      {
        id: 1,
        name: 'Auto Meta Description',
        description: 'Automatically generate meta descriptions for new pages',
        status: 'active',
        triggers: ['new-page', 'content-update'],
        actions: ['generate-meta', 'optimize-title'],
        lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        name: 'Keyword Monitoring',
        description: 'Monitor keyword rankings and alert on significant changes',
        status: 'active',
        triggers: ['weekly-check', 'ranking-drop'],
        actions: ['send-alert', 'update-report'],
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        name: 'Content Optimization',
        description: 'Suggest content improvements based on SEO analysis',
        status: 'active',
        triggers: ['content-analysis', 'competitor-check'],
        actions: ['generate-suggestions', 'update-content'],
        lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        name: 'Technical SEO Audit',
        description: 'Automated technical SEO checks and fixes',
        status: 'inactive',
        triggers: ['weekly-audit', 'error-detection'],
        actions: ['fix-issues', 'generate-report'],
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'pending': return '#F59E0B';
      case 'in-progress': return '#4F8CFF';
      case 'completed': return '#10B981';
      case 'ranking': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getChangeIcon = (change) => {
    return change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  const getChangeColor = (change) => {
    return change > 0 ? '#10B981' : '#EF4444';
  };

  return (
    <Layout>
      <Head>
        <title>SEO Automation - Kent Traders Admin</title>
        <meta name="description" content="AI-powered SEO automation and optimization tools" />
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
            SEO Automation
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            AI-powered SEO automation, keyword tracking, and performance optimization for maximum search visibility
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* SEO Score Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4F8CFF 0%, #6BA1FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(79, 140, 255, 0.3)',
                  }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'white' 
                    }}
                  >
                    {seoData.overallScore}
                  </Typography>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  Overall Score
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Excellent performance
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <SpeedIcon sx={{ color: '#10B981', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Page Speed
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {seoData.pageSpeed}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Mobile: {seoData.mobileScore}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <VisibilityIcon sx={{ color: '#F59E0B', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Indexed Pages
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {seoData.indexedPages}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  of {seoData.totalPages} total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                background: 'background.paper',
                border: '1px solid',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUpIcon sx={{ color: '#4F8CFF', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Organic Traffic
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {performance.traffic?.organic?.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  +12% this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Keywords and Performance */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Keyword Rankings */}
          <Grid item xs={12} lg={8}>
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
                  <SearchIcon sx={{ color: '#4F8CFF' }} />
                  Keyword Rankings
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Keyword</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Position</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Change</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Volume</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Difficulty</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>CPC</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {keywords.map((keyword) => (
                        <TableRow key={keyword.id}>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {keyword.keyword}
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            #{keyword.position}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              {getChangeIcon(keyword.change)}
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: getChangeColor(keyword.change),
                                  fontWeight: 600,
                                }}
                              >
                                {keyword.change > 0 ? '+' : ''}{keyword.change}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            {keyword.volume.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${keyword.difficulty}%`}
                              size="small"
                              sx={{
                                backgroundColor: keyword.difficulty < 50 ? '#10B98120' : 
                                               keyword.difficulty < 70 ? '#F59E0B20' : '#EF444420',
                                color: keyword.difficulty < 50 ? '#10B981' : 
                                       keyword.difficulty < 70 ? '#F59E0B' : '#EF4444',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>
                            £{keyword.cpc}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Core Web Vitals */}
          <Grid item xs={12} lg={4}>
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
                  <SpeedIcon sx={{ color: '#4F8CFF' }} />
                  Core Web Vitals
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        LCP (Largest Contentful Paint)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {performance.coreWebVitals?.lcp}s
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((performance.coreWebVitals?.lcp / 2.5) * 100, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#2A2A2D',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: performance.coreWebVitals?.lcp <= 2.5 ? '#10B981' : '#EF4444',
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        FID (First Input Delay)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {performance.coreWebVitals?.fid}ms
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((performance.coreWebVitals?.fid / 100) * 100, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#2A2A2D',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: performance.coreWebVitals?.fid <= 100 ? '#10B981' : '#EF4444',
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        CLS (Cumulative Layout Shift)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {performance.coreWebVitals?.cls}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((performance.coreWebVitals?.cls / 0.1) * 100, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#2A2A2D',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: performance.coreWebVitals?.cls <= 0.1 ? '#10B981' : '#EF4444',
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* SEO Optimizations */}
        <Grid container spacing={3}>
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
                  <AutoAwesomeIcon sx={{ color: '#4F8CFF' }} />
                  SEO Optimizations
                </Typography>
                <Stack spacing={2}>
                  {optimizations.map((optimization) => (
                    <Box
                      key={optimization.id}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderRadius: 2,
                        backgroundColor: '#2A2A2D',
                      }}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                          {optimization.title}
                        </Typography>
                        <Chip
                          label={optimization.priority}
                          size="small"
                          sx={{
                            backgroundColor: `${getPriorityColor(optimization.priority)}20`,
                            color: getPriorityColor(optimization.priority),
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                        {optimization.description}
                      </Typography>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>
                          {optimization.impact}
                        </Typography>
                        <Chip
                          label={optimization.status}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(optimization.status)}20`,
                            color: getStatusColor(optimization.status),
                            fontSize: '0.6rem',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Automation Rules */}
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
                  <SettingsIcon sx={{ color: '#4F8CFF' }} />
                  Automation Rules
                </Typography>
                <Stack spacing={2}>
                  {automationRules.map((rule) => (
                    <Accordion
                      key={rule.id}
                      sx={{
                        backgroundColor: 'transparent',
                        border: '1px solid',
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                        sx={{ color: 'text.primary' }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          <Typography variant="body2" fontWeight={500}>
                            {rule.name}
                          </Typography>
                          <Chip
                            label={rule.status}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(rule.status)}20`,
                              color: getStatusColor(rule.status),
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="caption" sx={{ color: '#71717A', mb: 2, display: 'block' }}>
                          {rule.description}
                        </Typography>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Triggers:
                          </Typography>
                          <Box display="flex" gap={1} mt={1} mb={2}>
                            {rule.triggers.map((trigger, index) => (
                              <Chip
                                key={index}
                                label={trigger}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#3A3A3D',
                                  color: 'text.secondary',
                                  fontSize: '0.6rem',
                                }}
                              />
                            ))}
                          </Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Actions:
                          </Typography>
                          <Box display="flex" gap={1} mt={1}>
                            {rule.actions.map((action, index) => (
                              <Chip
                                key={index}
                                label={action}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#3A3A3D',
                                  color: 'text.secondary',
                                  fontSize: '0.6rem',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
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
