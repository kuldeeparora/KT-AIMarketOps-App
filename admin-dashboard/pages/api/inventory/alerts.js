export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Get current alerts
      const alerts = await getCurrentAlerts();
      return res.status(200).json(alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return res.status(500).json({ error: 'Failed to fetch alerts' });
  }
  }

  if (req.method === 'POST') {
    try {
      const { type, threshold, recipients, enabled } = req.body;

      // Create or update alert configuration
      const alertConfig = await createAlertConfig({
        type, // 'low_stock', 'out_of_stock', 'price_change', 'demand_forecast'
        threshold,
        recipients, // email addresses or phone numbers
        enabled});

      return res.status(200).json(alertConfig);
    } catch (error) {
      console.error('Error creating alert:', error);
      return res.status(500).json({ error: 'Failed to create alert' });
  }
  }

  return res.status,(405).json({ error: 'Method not allowed' });
  }

// Mock database functions
async function getCurrentAlerts() {
  return {
    alerts: [
      {
        id: 1,
        type: 'low_stock',
        threshold: 10,
        recipients: ['admin@kenttraders.co.uk', '+44123456789'],
        enabled: true,
        lastTriggered: '2024-01-15T10:30:00Z',
        triggeredCount: 5},
      {
        id: 2,
        type: 'out_of_stock',
        threshold: 0,
        recipients: ['warehouse@kenttraders.co.uk'],
        enabled: true,
        lastTriggered: '2024-01-14T15:45:00Z',
        triggeredCount: 2},
      {
        id: 3,
        type: 'price_change',
        threshold: 0.15, // 15% change
        recipients: ['finance@kenttraders.co.uk'],
        enabled: true,
        lastTriggered: '2024-01-13T09:20:00Z',
        triggeredCount: 1}],
    stats: {
    totalAlerts: 3,
      activeAlerts: 3,
      alertsToday: 2,
      alertsThisWeek: 8
  }};
}

async function createAlertConfig(config) {
  return {
    id: Date.now(),
    ...config,
    createdAt: new Date().toISOString(),
    lastTriggered: null,
    triggeredCount: 0};
  }
