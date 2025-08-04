import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  Button,
  CircularProgress} from '@mui/material';
import {
  DataUsage as DataIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon} from '@mui/icons-material';

const DATA_SOURCES = {
  sellerdynamics: {
    name: 'SellerDynamics',
    description: 'Real-time inventory data from SellerDynamics API',
    color: 'primary',
    icon: '🔄',
    endpoint: '/api/sellerdynamics',
  },
  shopify: {
    name: 'Shopify',
    description: 'Product catalog and inventory from Shopify',
    color: 'secondary',
    icon: '🛍️',
    endpoint: '/api/shopify-inventory',
  },
  mock: {
    name: 'Mock Data',
    description: 'Simulated data for development and testing',
    color: 'default',
    icon: '🧪',
    endpoint: '/api/sellerdynamics',
  },
  combined: {
    name: 'Combined View',
    description: 'Merge data from multiple sources',
    color: 'success',
    icon: '🔗',
    endpoint: '/api/shared/cross-module-data',
  },
};

export default function DataSourceSelector({
  onDataSourceChange,
  currentSource = 'sellerdynamics',
  showStatus = true,
  compact = false}) {
  const [selectedSource, setSelectedSource] = useState(currentSource);
  const [sourceStatus, setSourceStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkDataSources();
  }, []);

  const checkDataSources = async () => {
    setIsLoading(true);
    const status = {};

    try {
      // Check SellerDynamics
      try {
        const sdResponse = await fetch('/api/sellerdynamics');
        const sdData = await sdResponse.json();
        status.sellerdynamics = {
          available: true,
          count: sdData.stockLevels?.length || 0,
          lastUpdated: new Date().toISOString()};
  } catch (error) {
        status.sellerdynamics = {
          available: false,
          error: error.message};
  }

      // Check Shopify
      try {
        const shopifyResponse = await fetch('/api/shopify-inventory');
        const shopifyData = await shopifyResponse.json();
        status.shopify = {
          available: true,
          count: shopifyData.products?.length || 0,
          lastUpdated: new Date().toISOString()};
  } catch (error) {
        status.shopify = {
          available: false,
          error: error.message};
  }

      // Check Relationships
      try {
        const relResponse = await fetch('/api/sellerdynamics/relationships');
        const relData = await relResponse.json();
        status.relationships = {
          available: relData.success,
          count: relData.data?.totalProducts || 0,
          lastUpdated: new Date().toISOString()};
  } catch (error) {
        status.relationships = {
          available: false,
          error: error.message};
  }

      setSourceStatus(status);
    } catch (error) {
      console.error('Error checking data sources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceChange = event => {
    const newSource = event.target.value;
    setSelectedSource(newSource);
    onDataSourceChange?.(newSource);
  };

  const getStatusIcon = source => {
    const status = sourceStatus[source];
    if (!status) return <WarningIcon color='warning' />;

    if (status.available) {
      return <CheckIcon color='success' />;
    } else {
      return <ErrorIcon color='error' />;
    }
  };

  const getStatusColor = source => {
    const status = sourceStatus[source];
    if (!status) return 'warning';
    return status.available ? 'success' : 'error';
  };

  const getStatusText = source => {
    const status = sourceStatus[source];
    if (!status) return 'Unknown';
    if (status.available) {
      return `${status.count} items`;
    } else {
      return 'Unavailable';
    }
  };

  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
    alignItems: 'center',
          gap: 2,
          mb: 2}}
      >
        <Typography variant='body,2' color='text.secondary'>
          Data Source:{' '}
        </Typography>
        <FormControl
          size='small'
          sx={{
            minWidth: 200}}
        >
          <Select value={selectedSource} onChange={handleSourceChange} displayEmpty>
            {Object.entries(DATA_SOURCES).map(([key, source]) => (
              <MenuItem key={key} value={key}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1}}
                >
                  <span>{source.icon}</span>
                  <span>{source.name}</span>
                  {showStatus && getStatusIcon(key)}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          size='small'
          onClick={checkDataSources} disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
        >
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        mb: 3}}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
    alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2}}
        >
          <Typography variant='h6' component='div'>
            <DataIcon
              sx={{
                mr: 1,
                verticalAlign: 'middle'}}
            />
            Data Source Configuration
          </Typography>
          <Button
            variant='outlined'
            size='small'
            onClick={checkDataSources} disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
          >
            Refresh Status
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3}}
        >
          <Typography variant='body,2' color='text.secondary'>
            Primary Data Source:{' '}
          </Typography>
          <FormControl
            sx={{
              minWidth: 250}}
          >
            <Select value={selectedSource} onChange={handleSourceChange} displayEmpty>
              {Object.entries(DATA_SOURCES).map(([key, source]) => (
                <MenuItem key={key} value={key}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1}}
                  >
                    <span>{source.icon}</span>
                    <span>{source.name}</span>
                    {showStatus && getStatusIcon(key)}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {showStatus && (
          <Box>
            <Typography variant='subtitle2' gutterBottom>
              Data Source Status:{' '}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1}}
            >
              {Object.entries(DATA_SOURCES).map(([key, source]) => (
                <Chip
                  key={key} icon={getStatusIcon(key)}
                  label={`${source.name}: ${getStatusText(key)}`}
                  color={getStatusColor(key)} variant='outlined'
                  size='small'
                />
              ))}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            mt: 2}}
        >
          <Typography variant='body,2' color='text.secondary'>
            <strong>Current Source: </strong> {DATA_SOURCES[selectedSource]?.name}
          </Typography>
          <Typography variant='body,2' color='text.secondary'>
            <strong>Description: </strong> {DATA_SOURCES[selectedSource]?.description}
          </Typography>
          <Typography variant='body,2' color='text.secondary'>
            <strong>Endpoint: </strong> {DATA_SOURCES[selectedSource]?.endpoint}
          </Typography>
        </Box>

        {Object.values(sourceStatus).some(status => !status.available) && (
          <Alert
            severity='warning'
            sx={{
              mt: 2}}
          >
            Some data sources are unavailable. Check your API configuration and network
            connectivity.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
