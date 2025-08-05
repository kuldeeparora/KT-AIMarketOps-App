import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { Send as SendIcon, Psychology as AiIcon } from '@mui/icons-material';

interface AIResponse {
  response: string;
  provider: string;
  timestamp: string;
}

export default function KentTradersAIAssistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{ groq?: { status: string } } | null>(null);

  // Test AI connectivity on component mount
  useEffect(() => {
    testAIConnection();
  }, []);

  const testAIConnection = async () => {
    try {
      const res = await fetch('/api/ai/test');
      const data = await res.json();
      setAiStatus(data);
    } catch (err) {
      console.error('AI connection test failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/simple-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: query,
          useProvider: 'groq', // Use Groq as primary
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setResponse({
          response: data.response,
          provider: data.provider || 'groq',
          timestamp: new Date().toISOString(),
        });
      } else {
        setError(data.message || 'AI request failed');
      }
    } catch (err) {
      setError('Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  const businessPrompts = [
    'Analyze current inventory trends',
    'Suggest cost optimization strategies', 
    'What are key market indicators to watch?',
    'Best practices for supplier management',
    'How to improve customer retention?',
  ];

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AiIcon color="primary" />
        Kent Traders AI Assistant
      </Typography>

      {/* AI Status Dashboard */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Groq AI</Typography>
            <Chip 
              label={aiStatus?.groq?.status === 'success' ? 'Online' : 'Offline'} 
              color={aiStatus?.groq?.status === 'success' ? 'success' : 'error'}
              size="small"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Pinecone</Typography>
            <Chip 
              label="Connected" 
              color="success"
              size="small"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">LangSmith</Typography>
            <Chip 
              label="Tracing Active" 
              color="primary"
              size="small"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Business Prompts */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Business Insights
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {businessPrompts.map((prompt, index) => (
              <Chip
                key={index}
                label={prompt}
                onClick={() => setQuery(prompt)}
                variant="outlined"
                clickable
                size="small"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your AI assistant about business insights, inventory management, market analysis..."
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={loading}
            />
            
            <Button
              type="submit"
              variant="contained"
              endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              disabled={loading || !query.trim()}
              fullWidth
              sx={{ mb: 2 }}
            >
              {loading ? 'AI is thinking...' : 'Get AI Insight'}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {response && (
            <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    AI Response
                  </Typography>
                  <Chip 
                    label={`${response.provider.toUpperCase()}`} 
                    size="small" 
                    color="primary"
                  />
                </Box>
                
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                  {response.response}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  Generated at {new Date(response.timestamp).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* AI Capabilities Info */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Available AI Capabilities
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                • Business Intelligence & Market Analysis<br/>
                • Inventory Management Optimization<br/>
                • Customer Behavior Insights<br/>
                • Cost Reduction Strategies
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                • Supplier Relationship Management<br/>
                • Risk Assessment & Mitigation<br/>
                • Performance Analytics<br/>
                • Automated Report Generation
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
