// admin-dashboard/components/ai/AIAssistant.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          context: {
            currentPage: typeof window !== 'undefined' ? window.location.pathname : '/',
            userRole: 'admin',
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.content || 'I apologize, but I couldn\'t generate a response.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '600px', 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon />
          AI Assistant
        </Typography>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Card
                  sx={{
                    maxWidth: '70%',
                    bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <CardContent sx={{ p: 2, pb: '16px !important' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: message.role === 'user' ? 'white' : 'primary.main',
                          color: message.role === 'user' ? 'primary.main' : 'white',
                        }}
                      >
                        {message.role === 'user' ? <PersonIcon /> : <AIIcon />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 1,
                            opacity: 0.7,
                            color: message.role === 'user' ? 'white' : 'text.secondary',
                          }}
                        >
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Card sx={{ bgcolor: 'grey.100' }}>
              <CardContent sx={{ p: 2, pb: '16px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    <AIIcon />
                  </Avatar>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    AI is thinking...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Error Display */}
      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Input Form */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about your business..."
              variant="outlined"
              size="small"
              disabled={isLoading}
              sx={{ flex: 1 }}
            />
            <IconButton
              type="submit"
              disabled={isLoading || !input.trim()}
              color="primary"
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Paper>
  );
}