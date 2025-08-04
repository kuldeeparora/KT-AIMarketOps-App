import GroqClient from '../../../lib/ai/groqClient';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analysisType, data, context, model } = req.body;

    // Initialize GROQ client
    const groqClient = new GroqClient();
    const isInitialized = await groqClient.initialize();

    if (!isInitialized) {
      return res.status(500).json({
        success: false,
        error: 'GROQ client initialization failed',
        message: 'Please check GROQ API key configuration'
      });
    }

    // Test GROQ connection
    const isConnected = await groqClient.testConnection();
    if (!isConnected) {
      return res.status(500).json({
        success: false,
        error: 'GROQ API connection failed',
        message: 'Unable to connect to GROQ API'
      });
    }

    let result;

    // Route to appropriate analysis method
    switch (analysisType) {
      case 'inventory':
        result = await groqClient.analyzeInventory(data);
        break;
      
      case 'analytics':
        result = await groqClient.analyzeAnalytics(data);
        break;
      
      case 'predictions':
        result = await groqClient.generatePredictions(data);
        break;
      
      case 'insights':
        result = await groqClient.generateInsights(data);
        break;
      
      case 'recommendations':
        result = await groqClient.generateRecommendations(data);
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid analysis type',
          message: 'Supported types: inventory, analytics, predictions, insights, recommendations'
        });
    }

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result,
        message: `${analysisType} analysis completed successfully`
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Analysis failed',
        message: result.analysis
      });
    }

  } catch (error) {
    console.error('[GROQ API] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
