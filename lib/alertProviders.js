/**
 * Alert Provider Factory
 * Abstracts different notification providers (Email, Slack, SMS, etc.)
 * Supports provider switching and multiple providers simultaneously
 */

class AlertProvider {
  constructor(config = {}) {
    this.config = config;
    this.isEnabled = config.enabled !== false;
  }

  async send(alert) {
    throw new Error('send() method must be implemented by provider');
  }

  async test() {
    throw new Error('test() method must be implemented by provider');
  }

  getStatus() {
    return {
      provider: this.constructor.name,
      enabled: this.isEnabled,
      configured: this.isConfigured()
    };
  }

  isConfigured() {
    return true; // Override in specific providers
  }
}

class EmailProvider extends AlertProvider {
  constructor(config) {
    super(config);
    this.transporter = null;
    this.setupTransporter();
  }

  setupTransporter() {
    if (this.config.smtp && this.config.smtp.user && this.config.smtp.pass) {
      // In production, use actual nodemailer
      this.transporter = {
        sendMail: async (options) => {
          console.log(`📧 Email sent: ${options.subject} to ${options.to}`);
          return { messageId: 'mock-' + Date.now() };
        }
      };
    }
  }

  isConfigured() {
    return !!(this.config.smtp && this.config.smtp.user && this.config.smtp.pass);
  }

  async send(alert) {
    if (!this.isEnabled || !this.transporter) {
      throw new Error('Email provider not configured or disabled');
    }

    const subject = `[${alert.severity.toUpperCase()}] Inventory Alert - ${alert.type}`;
    const html = this.formatEmailHtml(alert);

    await this.transporter.sendMail({
      from: this.config.smtp.from || this.config.smtp.user,
      to: this.config.recipients || 'admin@kenttraders.com',
      subject,
      html
    });

    return { success: true, provider: 'email' };
  }

  formatEmailHtml(alert) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: ${this.getSeverityColor(alert.severity)};">
          🚨 Inventory Alert
        </h2>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <h3>${alert.message}</h3>
          <p><strong>Product:</strong> ${alert.product?.name || 'Unknown'}</p>
          <p><strong>SKU:</strong> ${alert.product?.sku || 'Unknown'}</p>
          <p><strong>Current Stock:</strong> ${alert.product?.quantity || 0}</p>
          <p><strong>Severity:</strong> ${alert.severity}</p>
          <p><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
        </div>
        <p><a href="/inventory" style="background: #007cba; color: white; padding: 10px 15px; text-decoration: none; border-radius: 3px;">View Dashboard</a></p>
      </div>
    `;
  }

  getSeverityColor(severity) {
    const colors = {
      critical: '#dc2626',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[severity] || '#6b7280';
  }

  async test() {
    const testAlert = {
      type: 'test',
      severity: 'info',
      message: 'Test alert from Alert Provider System',
      product: { name: 'Test Product', sku: 'TEST-001', quantity: 5 },
      timestamp: new Date()
    };

    await this.send(testAlert);
    return { success: true, message: 'Test email sent successfully' };
  }
}

class SlackProvider extends AlertProvider {
  constructor(config) {
    super(config);
    this.webhookUrl = config.webhookUrl;
  }

  isConfigured() {
    return !!this.webhookUrl;
  }

  async send(alert) {
    if (!this.isEnabled || !this.webhookUrl) {
      throw new Error('Slack provider not configured or disabled');
    }

    const message = this.formatSlackMessage(alert);

    // Mock Slack webhook call
    console.log(`💬 Slack message sent to ${this.webhookUrl}:`, message.text);
    
    return { success: true, provider: 'slack' };
  }

  formatSlackMessage(alert) {
    const emoji = {
      critical: '🔴',
      warning: '🟡',
      info: '🔵'
    }[alert.severity] || '⚪';

    return {
      text: `${emoji} Inventory Alert: ${alert.message}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${emoji} Inventory Alert*\n*${alert.message}*`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Product:*\n${alert.product?.name || 'Unknown'}`
            },
            {
              type: 'mrkdwn',
              text: `*SKU:*\n${alert.product?.sku || 'Unknown'}`
            },
            {
              type: 'mrkdwn',
              text: `*Current Stock:*\n${alert.product?.quantity || 0}`
            },
            {
              type: 'mrkdwn',
              text: `*Severity:*\n${alert.severity.toUpperCase()}`
            }
          ]
        }
      ]
    };
  }

  async test() {
    const testAlert = {
      type: 'test',
      severity: 'info',
      message: 'Test alert from Alert Provider System',
      product: { name: 'Test Product', sku: 'TEST-001', quantity: 5 },
      timestamp: new Date()
    };

    await this.send(testAlert);
    return { success: true, message: 'Test Slack message sent successfully' };
  }
}

class SMSProvider extends AlertProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.phoneNumbers = config.phoneNumbers || [];
  }

  isConfigured() {
    return !!(this.apiKey && this.phoneNumbers.length > 0);
  }

  async send(alert) {
    if (!this.isEnabled || !this.isConfigured()) {
      throw new Error('SMS provider not configured or disabled');
    }

    // Only send SMS for critical alerts
    if (alert.severity !== 'critical') {
      return { success: true, provider: 'sms', skipped: 'Not critical' };
    }

    const message = `🚨 CRITICAL: ${alert.message} - ${alert.product?.name} (${alert.product?.sku}) - ${alert.product?.quantity} remaining`;

    // Mock SMS sending
    for (const phone of this.phoneNumbers) {
      console.log(`📱 SMS sent to ${phone}: ${message}`);
    }

    return { success: true, provider: 'sms' };
  }

  async test() {
    const testAlert = {
      type: 'test',
      severity: 'critical',
      message: 'Test critical alert from Alert Provider System',
      product: { name: 'Test Product', sku: 'TEST-001', quantity: 0 },
      timestamp: new Date()
    };

    await this.send(testAlert);
    return { success: true, message: 'Test SMS sent successfully' };
  }
}

class WebhookProvider extends AlertProvider {
  constructor(config) {
    super(config);
    this.webhookUrl = config.webhookUrl;
    this.headers = config.headers || {};
  }

  isConfigured() {
    return !!this.webhookUrl;
  }

  async send(alert) {
    if (!this.isEnabled || !this.webhookUrl) {
      throw new Error('Webhook provider not configured or disabled');
    }

    const payload = {
      alert_type: alert.type,
      severity: alert.severity,
      message: alert.message,
      product: alert.product,
      timestamp: alert.timestamp,
      source: 'kent-traders-inventory'
    };

    // Mock webhook call
    console.log(`🔗 Webhook sent to ${this.webhookUrl}:`, JSON.stringify(payload, null, 2));

    return { success: true, provider: 'webhook' };
  }

  async test() {
    const testAlert = {
      type: 'test',
      severity: 'info',
      message: 'Test alert from Alert Provider System',
      product: { name: 'Test Product', sku: 'TEST-001', quantity: 5 },
      timestamp: new Date()
    };

    await this.send(testAlert);
    return { success: true, message: 'Test webhook sent successfully' };
  }
}

class AlertProviderFactory {
  constructor() {
    this.providers = new Map();
    this.config = {};
  }

  configure(config) {
    this.config = config;
    this.setupProviders();
  }

  setupProviders() {
    // Clear existing providers
    this.providers.clear();

    // Setup Email Provider
    if (this.config.email && this.config.email.enabled) {
      this.providers.set('email', new EmailProvider(this.config.email));
    }

    // Setup Slack Provider
    if (this.config.slack && this.config.slack.enabled) {
      this.providers.set('slack', new SlackProvider(this.config.slack));
    }

    // Setup SMS Provider
    if (this.config.sms && this.config.sms.enabled) {
      this.providers.set('sms', new SMSProvider(this.config.sms));
    }

    // Setup Webhook Provider
    if (this.config.webhook && this.config.webhook.enabled) {
      this.providers.set('webhook', new WebhookProvider(this.config.webhook));
    }
  }

  async sendAlert(alert, channels = null) {
    const enabledProviders = channels || Array.from(this.providers.keys());
    const results = [];

    for (const providerName of enabledProviders) {
      const provider = this.providers.get(providerName);
      
      if (!provider) {
        results.push({
          provider: providerName,
          success: false,
          error: 'Provider not configured'
        });
        continue;
      }

      try {
        const result = await provider.send(alert);
        results.push({
          ...result,
          provider: providerName,
          success: true
        });
      } catch (error) {
        results.push({
          provider: providerName,
          success: false,
          error: error.message
        });
      }
    }

    return {
      alertId: alert.id || Date.now().toString(),
      results,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  }

  async testProvider(providerName) {
    const provider = this.providers.get(providerName);
    
    if (!provider) {
      throw new Error(`Provider '${providerName}' not found`);
    }

    return await provider.test();
  }

  async testAllProviders() {
    const results = {};

    for (const [name, provider] of this.providers) {
      try {
        results[name] = await provider.test();
      } catch (error) {
        results[name] = {
          success: false,
          error: error.message
        };
      }
    }

    return results;
  }

  getProviderStatus() {
    const status = {};

    for (const [name, provider] of this.providers) {
      status[name] = provider.getStatus();
    }

    return status;
  }

  getAvailableProviders() {
    return Array.from(this.providers.keys());
  }
}

// Export singleton instance
const alertProviderFactory = new AlertProviderFactory();

module.exports = {
  AlertProviderFactory,
  EmailProvider,
  SlackProvider,
  SMSProvider,
  WebhookProvider,
  alertProviderFactory
};
