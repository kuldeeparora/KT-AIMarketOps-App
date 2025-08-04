export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Check basic app health
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      node_version: process.version,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        api: 'healthy',
        database: 'healthy', // Can add actual DB checks later
        external_apis: {
          sellerdynamics: 'unknown',
          shopify: 'unknown'
        }
      }
    };

    // Quick API functionality test
    try {
      // Test if we can access environment variables
      if (!process.env.SELLERDYNAMICS_API_URL && !process.env.SHOPIFY_SHOP) {
        healthStatus.checks.external_apis.status = 'warning';
        healthStatus.warnings = ['Missing external API configuration'];
      }
    } catch (error) {
      healthStatus.checks.api = 'degraded';
      healthStatus.warnings = ['API configuration issues'];
    }

    return res.status(200).json({
      success: true,
      data: healthStatus
    });

  } catch (error) {
    console.error('[Health Check] Error:', error);
    
    return res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
}
