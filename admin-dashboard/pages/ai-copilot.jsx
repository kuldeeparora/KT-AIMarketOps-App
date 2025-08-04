import React, { useState, useEffect, useRef } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Badge,
  Avatar
} from '@mui/material';
import { Send as SendIcon, SmartToy as AIIcon, Lightbulb as LightbulbIcon, TrendingUp as TrendingUpIcon, Inventory as InventoryIcon, ShoppingCart as OrderIcon, Analytics as AnalyticsIcon, Settings as SettingsIcon, Chat as ChatIcon, AutoAwesome as AutoAwesomeIcon, Psychology as PsychologyIcon, Speed as SpeedIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon, ExpandMore as ExpandMoreIcon, Refresh as RefreshIcon, Download as DownloadIcon, Upload as UploadIcon } from '@mui/icons-material';
import Head from 'next/head';

export default function AiCopilot() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [aiStatus, setAiStatus] = useState('ready');
  const [selectedFeature, setSelectedFeature] = useState('chat');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize AI Copilot with welcome message
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: "Hello! I'm your AI Copilot. I can help you with inventory management, order processing, analytics insights, and business optimization. How can I assist you today?",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Show me low stock items",
        "Analyze recent sales trend,s",
        "Optimize inventory levels",
        "Generate sales report"]};
    setMessages([welcomeMessage]);
    
    // Generate initial suggestions
    generateSuggestions();
  }, []);

  const generateSuggestions = () => {
    const newSuggestions = [
      {
        id: 1,
        title: "Inventory Analysis",
        description: "Analyze stock levels and identify optimization opportunities",
        icon: <InventoryIcon />,
        action: () => handleSuggestionClick("Analyze my current inventory levels and suggest optimizations")},
      {
        id: 2,
        title: "Sales Insights",
        description: "Get insights into recent sales performance and trend,s",
        icon: <AnalyticsIcon />,
        action: () => handleSuggestionClick("Show me sales insights for the last 30 days")},
      {
        id: 3,
        title: "Order Management",
        description: "Review and optimize order processing workflow",
        icon: <OrderIcon />,
        action: () => handleSuggestionClick("Help me optimize my order management process")},
      {
        id: 4,
        title: "Business Optimization",
        description: "Get AI-powered recommendations for business improvement",
        icon: <AutoAwesomeIcon />,
        action: () => handleSuggestionClick("What are the top 3 ways I can improve my business efficiency?")}];
    setSuggestions(newSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    handleSendMessage(suggestion);
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()};

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setAiStatus('thinking');

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = generateAIResponse(message);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        suggestions: aiResponse.suggestions || []};

      setMessages(prev => [...prev, aiMessage]);
      setAiStatus('ready');
      
    } catch (err) {
      console.error('Error processing message:', err);
      setError('Failed to process message');
      setAiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
      return {
        content: "I've analyzed your inventory data. Here are the key insights:\n\n• 15 items are running low on stock\n• 3 items are completely out of stock\n• Your top-selling items have healthy stock levels\n• Recommended reorder quantities have been calculated\n\nWould you like me to create a detailed inventory report or help you set up automated reorder alerts?",
        suggestions: ["Create inventory report", "Set up reorder alerts", "Show low stock items", "Optimize stock levels"]
      };
    } else if (lowerMessage.includes('sales') || lowerMessage.includes('trend,')) {
      return {
        content: "Here's your sales analysis for the last 30 days:\n\n• Total revenue: £45,230 (+12% vs last month)\n• Top performing category: Electronics\n• Peak sales day: Saturday\n• Average order value: £89.50\n\nI've identified opportunities to increase sales by 18% through targeted marketing campaigns.",
        suggestions: ["Create marketing campaign", "Analyze customer segments", "Forecast next month", "Optimize pricing"]
      };
    } else if (lowerMessage.includes('order') || lowerMessage.includes('process')) {
      return {
        content: "Your order processing workflow analysis:\n\n• Average order processing time: 2.3 hours\n• 98% of orders are processed within 24 hours\n• Top bottleneck: Payment verification\n• Customer satisfaction: 4.7/5 stars\n\nI recommend implementing automated payment verification to reduce processing time by 40%.",
        suggestions: ["Implement automation", "Optimize workflow", "Reduce processing time", "Improve customer satisfaction"]
      };
    } else if (lowerMessage.includes('business') || lowerMessage.includes('efficiency')) {
      return {
        content: "Here are the top 3 ways to improve your business efficiency:\n\n1. **Automate Inventory Management** - Save 15 hours/week\n2. **Implement AI-Powered Pricing** - Increase margins by 8%\n3. **Optimize Order Fulfillment** - Reduce shipping costs by 12%\n\nWould you like me to help implement any of these optimizations?",
        suggestions: ["Implement automation", "Optimize pricing", "Improve fulfillment", "Create action plan"]
      };
    } else {
      return {
        content: "I understand you're asking about '" + message + "&apos;. Let me help you with that. I can assist with inventory management, sales analysis, order processing, and business optimization. What specific aspect would you like to focus on?",
        suggestions: ["Inventory analysis", "Sales insights", "Order management", "Business optimization"]
      };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'success';
      case 'thinking': return 'warning';
      case 'error': return 'error';
      default: return 'info';
  }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return <CheckCircleIcon />;
      case 'thinking': return <CircularProgress size={20} />;
      case 'error': return <ErrorIcon />;
      default: return <AIIcon />;
  }
  };

  return (
    <>
      <Head>
        <title>AI Copilot - Kent Traders Admin Dashboard</title>
        <meta name="description" content="AI-powered assistant for business optimization and automation" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            AI Copilot
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your intelligent business assistant powered by AI
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* AI Chat Interface */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                <AIIcon sx={{ mr: 1 }} />
                <Typography variant="h6">AI Assistant</Typography>
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                  <Chip
                    icon={getStatusIcon(aiStatus)}
                    label={aiStatus}
                    color={getStatusColor(aiStatus)}
                    size="small"
                  />
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <List>
                  {messages.map((message) => (
                    <ListItem key={message.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1,
                        alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start'}}>
                        {message.type === 'ai' && <AIIcon sx={{ mr: 1, color: 'primary.main' }} />}
                        <Typography variant="caption" color="text.secondary">
                          {message.type === 'user' ? 'You' : 'AI Assistant'} • {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                      <Paper sx={{ 
                        p: 2, 
                        mb: 1,
                        backgroundColor: message.type === 'user' ? 'primary.main' : 'grey.100',
                        color: message.type === 'user' ? 'white' : 'text.primary',
                        maxWidth: '80%',
                        alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start'}}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                          {message.content}
                        </Typography>
                      </Paper>
                      
                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {message.suggestions.map((suggestion, index) => (
                            <Chip
                              key={index}
                              label={suggestion}
                              size="small"
                              variant="outlined"
                              onClick={() => handleSuggestionClick(suggestion)}
                              sx={{ cursor: 'pointer' }}
                            />
                          ))}
                        </Box>
                      )}
                    </ListItem>
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              </Box>

              {/* Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Ask me anything about your business..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={loading}
                  />
                  <IconButton 
                    onClick={() => handleSendMessage()}
                    disabled={loading || !inputMessage.trim()}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions & Suggestions */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>,
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                {suggestions.map((suggestion) => (
                  <ListItem key={suggestion.id} button onClick={suggestion.action}>
                    <ListItemIcon>
                      {suggestion.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.title}
                      secondary={suggestion.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* AI Features */}
            <Paper sx={{ p: 3 }}>,
              <Typography variant="h6" gutterBottom>
                AI Features
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>,
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <PsychologyIcon color="primary" sx={{ mr: 2 }} />,
                      <Box>
                        <Typography variant="subtitle2">Smart Analytics</Typography>
                        <Typography variant="body2" color="text.secondary">
                          AI-powered insights and predictions
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <AutoAwesomeIcon color="primary" sx={{ mr: 2 }} />,
                      <Box>
                        <Typography variant="subtitle2">Automation</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Automated workflows and processes
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <SpeedIcon color="primary" sx={{ mr: 2 }} />,
                      <Box>
                        <Typography variant="subtitle2">Optimization</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Performance optimization suggestions
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}