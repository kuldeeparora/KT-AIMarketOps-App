export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status,(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock logs data
    const logs = [
      {
        id: 1,
        level: 'info',
        message: 'System metrics updated',
        timestamp: new Date().toISOString(),
        service: 'kent-traders-admin',
        details: {
    cpuUsage: '529.64%',
          memoryUsage: '65089.61 MB',
          uptime: '0.06 hours'
  }
      },
      {
        id: 2,
        level: 'info',
        message: 'Health check completed',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        service: 'kent-traders-admin',
        details: {
    status: 'healthy',
          database: 'connected',
          redis: 'connected',
          'external-apis': 'healthy'
        }
      },
      {
        id: 3,
        level: 'warn',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        service: 'kent-traders-admin',
        details: {
    memoryUsage: '85%',
          threshold: '80%'
  }
      },
      {
        id: 4,
        level: 'error',
        message: 'API request failed',
        timestamp: new Date(Date.now() - 90000).toISOString(),
        service: 'kent-traders-admin',
        details: {
    endpoint: '/api/products',
          status,Code: 500,
          error: 'Database connection timeout'
  }
      },
      {
        id: 5,
        level: 'info',
        message: 'WebSocket connection established',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        service: 'websocket-server',
        details: {
    clientId: 'client_123',
          connections: 15
  }
      }
    ];

    res.status,(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status,(500).json({ error: 'Failed to fetch logs' });
  }
}
