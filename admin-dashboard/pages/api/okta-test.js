import OktaService from '../../server/okta-service';

const oktaService = new OktaService();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test Okta configuration
    const status = await oktaService.getConfigurationStatus();
    
    res.status(200).json({
      success: true,
      status,
      message: 'Okta configuration test completed'
    });
  } catch (error) {
    console.error('Okta test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Okta configuration test failed'
    });
  }
} 