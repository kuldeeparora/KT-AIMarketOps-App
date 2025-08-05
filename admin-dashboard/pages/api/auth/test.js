export default function handler(req, res) {
  res.status(200).json({
    message: 'Authentication API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    debugEnabled: process.env.DEBUG_ENABLED
  });
} 