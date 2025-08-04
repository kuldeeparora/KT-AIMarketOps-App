import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const endpoint = process.env.SELLERDYNAMICS_SOAP_ENDPOINT;
    const encryptedLogin = process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN;
    const retailerId = process.env.SELLERDYNAMICS_RETAILER_ID;

    console.log('[Test SellerDynamics] Testing direct API call...');
    console.log('[Test SellerDynamics] Endpoint:', endpoint);
    console.log('[Test SellerDynamics] Login:', encryptedLogin ? 'SET' : 'NOT SET');
    console.log('[Test SellerDynamics] Retailer ID:', retailerId);

    if (!endpoint || !encryptedLogin || !retailerId) {
      return res.status(400).json({
        success: false,
        error: 'Missing credentials',
        data: {
          endpoint: !!endpoint,
          login: !!encryptedLogin,
          retailerId: !!retailerId
        }
      });
    }

    // Test products API call
    const productsSoap = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetProducts xmlns="http://www.sellerdynamics.com/">
      <encryptedLogin>${encryptedLogin}</encryptedLogin>
      <retailerId>${retailerId}</retailerId>
    </GetProducts>
  </soap:Body>
</soap:Envelope>`;

    console.log('[Test SellerDynamics] Making SOAP request...');

    const response = await axios.post(endpoint, productsSoap, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8'
        // Removed SOAPAction header as it's causing the fault
      },
      timeout: 10000
    });

    console.log('[Test SellerDynamics] Response status:', response.status);
    console.log('[Test SellerDynamics] Response headers:', response.headers);
    
    const responseText = response.data;
    console.log('[Test SellerDynamics] Response length:', responseText.length);
    console.log('[Test SellerDynamics] Response preview:', responseText.substring(0, 500));

    // Check for error in response
    const hasError = responseText.includes('IsError>true</IsError>') || 
                    responseText.includes('Fault') ||
                    responseText.includes('Error');

    return res.status(200).json({
      success: true,
      data: {
        status: response.status,
        hasError,
        responseLength: responseText.length,
        responsePreview: responseText.substring(0, 1000),
        errorDetails: hasError ? {
          hasIsError: responseText.includes('IsError>true</IsError>'),
          hasFault: responseText.includes('Fault'),
          hasError: responseText.includes('Error'),
          fullResponse: responseText
        } : null
      }
    });

  } catch (error) {
    console.error('[Test SellerDynamics] Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'API call failed',
      message: error.message,
      details: {
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data
      }
    });
  }
} 