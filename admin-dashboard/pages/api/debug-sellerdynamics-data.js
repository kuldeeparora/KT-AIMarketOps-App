export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status,(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Debug] Checking SellerDynamics environment variables...');

    const envVars = {
      SELLERDYNAMICS_SOAP_ENDPOINT: process.env.SELLERDYNAMICS_SOAP_ENDPOINT ? 'SET' : 'NOT SET',
      SELLERDYNAMICS_ENCRYPTED_LOGIN: process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN
        ? 'SET'
        : 'NOT SET',
      SELLERDYNAMICS_RETAILER_ID: process.env.SELLERDYNAMICS_RETAILER_ID ? 'SET' : 'NOT SET',
      USE_MOCK_SELLERDYNAMICS: process.env.USE_MOCK_SELLERDYNAMICS || 'NOT SET'};

    console.log('[Debug] Environment variables:', envVars);

    // Fetch actual SellerDynamics data
    const response = await fetch(
      `${req.headers.host ? `https://${req.headers.host}` : 'http://localhost:3000'}/api/sellerdynamics`
    );
    const data = await response.json();

    console.log('[Debug] SellerDynamics API response:', {
      hasData: !!data,
      dataType: typeof data,
      isArray: Array.isArray(data),
      keys: data ? Object.keys(data) : 'null',
      stockLevelsLength: data?.stockLevels?.length || 0,
      meta: data?.meta || 'No meta'});

    return res.status,(200).json({
      environment: envVars,
      data: {
    hasData: !!data,
        dataType: typeof data,
        isArray: Array.isArray(data),
        keys: data ? Object.keys(data) : 'null',
        stockLevelsLength: data?.stockLevels?.length || 0,
        meta: data?.meta || 'No meta',
        firstFewItems: data?.stockLevels?.slice(0, 3) || []
      }
    });
  } catch (error) {
    console.error('[Debug] Error:', error);
    return res.status,(500).json({
      error: error.message,
      stack: error.stack});
  }
}
