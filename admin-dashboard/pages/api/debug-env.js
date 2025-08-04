export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const envCheck = {
      SELLERDYNAMICS_SOAP_ENDPOINT: process.env.SELLERDYNAMICS_SOAP_ENDPOINT ? 'SET' : 'NOT SET',
      SELLERDYNAMICS_ENCRYPTED_LOGIN: process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN ? 'SET' : 'NOT SET',
      SELLERDYNAMICS_RETAILER_ID: process.env.SELLERDYNAMICS_RETAILER_ID ? 'SET' : 'NOT SET',
      USE_MOCK_SELLERDYNAMICS: process.env.USE_MOCK_SELLERDYNAMICS || 'true',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL || 'NOT SET'
    };

    const hasCredentials = envCheck.SELLERDYNAMICS_SOAP_ENDPOINT === 'SET' && 
                         envCheck.SELLERDYNAMICS_ENCRYPTED_LOGIN === 'SET' && 
                         envCheck.SELLERDYNAMICS_RETAILER_ID === 'SET';

    return res.status(200).json({
      success: true,
      data: {
        environmentCheck: envCheck,
        hasCredentials,
        message: hasCredentials ? 
          'SellerDynamics credentials are configured. Real data should be available.' : 
          'SellerDynamics credentials are missing. Using mock data.',
        setupInstructions: hasCredentials ? null : {
          step1: 'Set SELLERDYNAMICS_SOAP_ENDPOINT in your environment',
          step2: 'Set SELLERDYNAMICS_ENCRYPTED_LOGIN in your environment', 
          step3: 'Set SELLERDYNAMICS_RETAILER_ID in your environment',
          step4: 'Restart the development server'
        }
      }
    });

  } catch (error) {
    console.error('Environment check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check environment',
      message: error.message
    });
  }
} 