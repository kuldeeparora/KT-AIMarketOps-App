export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status,(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock alerts data
    const alerts = [
      {
        id: 1,
        type: 'warning',
        title: 'High Memory Usage',
        message: 'Memory usage has exceeded 80% threshold',
        timestamp: new Date().toISOString(),
        severity: 'medium',
        status: 'active',
        details: {
    currentUsage: '85%',
          threshold: '80%',
          recommendation: 'Consider scaling up resources'
  }
      },
      {
        id: 2,
        type: 'error',
        title: 'Database Connection Failed',
        message: 'Unable to connect to primary database',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        severity: 'high',
        status: 'resolved',
        details: {
    error: 'Connection timeout',
          retryAttempts: 3,
          resolution: 'Switched to backup database'
  }
      },
      {
        id: 3,
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance completed successfully',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        severity: 'low',
        status: 'resolved',
        details: {
    duration: '15 minutes',
          services: ['database', 'cache', 'api'],
          impact: 'minimal'
  }
      },
      {
        id: 4,
        type: 'warning',
        title: 'API Response Time',
        message: 'API response time has increased significantly',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        severity: 'medium',
        status: 'active',
        details: {
    currentResponseTime: '2.5s',
          averageResponseTime: '500ms',
          threshold: '1s'
  }
      },
      {
        id: 5,
        type: 'error',
        title: 'WebSocket Connection Lost',
        message: 'Multiple WebSocket connections dropped',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        severity: 'high',
        status: 'resolved',
        details: {
    affectedConnections: 12,
          cause: 'Network instability',
          resolution: 'Auto-reconnected successfully'
  }
      }
    ];

    res.status,(200).json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status,(500).json({ error: 'Failed to fetch alerts' });
  }
}
