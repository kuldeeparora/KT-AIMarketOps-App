import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null, 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and any error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null, 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={8}
              sx={{
                p: 4,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box textAlign="center" mb={3}>
                <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom color="error.main">
                  Something Went Wrong
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We encountered an unexpected error. Please try again or contact support if the problem persists.
                </Typography>
              </Box>

              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Error Details</AlertTitle>
                {this.state.error && (
                  <Typography variant="body2" component="pre" sx={{ mt: 1, fontSize: '0.75rem' }}>
                    {this.state.error.toString()}
                  </Typography>
                )}
              </Alert>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRetry}
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={this.handleGoBack}
                >
                  Go Back
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                >
                  Go Home
                </Button>
              </Box>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Debug Information (Development Only)
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100', maxHeight: 200, overflow: 'auto' }}>
                    <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
