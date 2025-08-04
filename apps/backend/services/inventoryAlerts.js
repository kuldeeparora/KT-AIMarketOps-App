import { createTransporter, sendEmail, sendSlackAlert } from '../utils/notificationUtils.js';
import { getConfig } from '../utils/configUtils.js';

/**
 * Inventory Alerts Service
 * Handles low stock alerts, threshold monitoring, and notifications
 */
class InventoryAlertsService {
  constructor(config = {}) {
    this.config = getConfig(config);
    this.transporter = null;
    this.initializeEmail();
  }

  /**
   * Initialize email transporter
   */
  initializeEmail() {
    if (this.config.email.auth.user && this.config.email.auth.pass) {
      this.transporter = createTransporter(this.config.email);
    }
  }

  /**
   * Check inventory levels and trigger alerts
   */
  async checkInventoryLevels(inventoryData) {
    const alerts = [];
    
    for (const product of inventoryData.products || []) {
      const alert = this.analyzeProductStock(product);
      if (alert) {
        alerts.push(alert);
      }
    }

    if (alerts.length > 0) {
      await this.sendAlerts(alerts);
    }

    return {
      totalProducts: inventoryData.products?.length || 0,
      alerts: alerts,
      criticalCount: alerts.filter(a => a.level === 'critical').length,
      warningCount: alerts.filter(a => a.level === 'warning').length
    };
  }

  /**
   * Analyze individual product stock levels
   */
  analyzeProductStock(product) {
    const { quantity, sku, name, minThreshold } = product;
    const threshold = minThreshold || this.getDefaultThreshold(quantity);
    
    if (quantity <= this.config.thresholds.critical) {
      return {
        level: 'critical',
        sku,
        name,
        currentStock: quantity,
        threshold,
        message: `CRITICAL: ${sku} (${name}) has only ${quantity} units remaining!`
      };
    } else if (quantity <= this.config.thresholds.warning) {
      return {
        level: 'warning',
        sku,
        name,
        currentStock: quantity,
        threshold,
        message: `WARNING: ${sku} (${name}) is running low with ${quantity} units.`
      };
    }
    
    return null;
  }

  /**
   * Get default threshold based on current stock
   */
  getDefaultThreshold(currentStock) {
    if (currentStock <= 10) return 5;
    if (currentStock <= 50) return 15;
    return 25;
  }

  /**
   * Send alerts via multiple channels
   */
  async sendAlerts(alerts) {
    const criticalAlerts = alerts.filter(a => a.level === 'critical');
    const warningAlerts = alerts.filter(a => a.level === 'warning');

    // Send email alerts
    if (this.transporter) {
      await this.sendEmailAlert(alerts);
    }

    // Send Slack alerts
    if (this.config.slack.webhookUrl) {
      await this.sendSlackAlert(alerts);
    }

    // Log alerts for dashboard
    await this.logAlerts(alerts);

    console.log(`📢 [Inventory Alerts] Sent ${alerts.length} alerts (${criticalAlerts.length} critical, ${warningAlerts.length} warnings)`);
  }

  /**
   * Send email alert
   */
  async sendEmailAlert(alerts) {
    try {
      const criticalCount = alerts.filter(a => a.level === 'critical').length;
      const warningCount = alerts.filter(a => a.level === 'warning').length;
      const subject = `🚨 Inventory Alert: ${criticalCount} Critical, ${warningCount} Warnings`;
      const html = `
        <h2>Inventory Alert Report</h2>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Critical Alerts:</strong> ${criticalCount}</p>
        <p><strong>Warning Alerts:</strong> ${warningCount}</p>
        <h3>Critical Items (${criticalCount})</h3>
        <ul>
          ${alerts.filter(a => a.level === 'critical').map(alert => 
            `<li><strong>${alert.sku}</strong> - ${alert.name}: ${alert.currentStock} units remaining</li>`
          ).join('')}
        </ul>
        <h3>Warning Items (${warningCount})</h3>
        <ul>
          ${alerts.filter(a => a.level === 'warning').map(alert => 
            `<li><strong>${alert.sku}</strong> - ${alert.name}: ${alert.currentStock} units remaining</li>`
          ).join('')}
        </ul>
        <p><a href="/inventory">View Dashboard</a></p>
      `;
      await sendEmail({
        transporter: this.transporter,
        from: this.config.email.auth.user,
        to: process.env.ALERT_EMAIL || 'admin@kenttraders.com',
        subject,
        html
      });
      console.log('✅ [Inventory Alerts] Email alert sent successfully');
    } catch (error) {
      console.error('❌ [Inventory Alerts] Email alert failed:', error.message);
    }
  }

  /**
   * Send Slack alert
   */
  async sendSlackAlert(alerts) {
    try {
      const criticalAlerts = alerts.filter(a => a.level === 'critical');
      const warningAlerts = alerts.filter(a => a.level === 'warning');
      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚨 Inventory Alert (${alerts.length} items)`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Critical:* ${criticalAlerts.length} | *Warnings:* ${warningAlerts.length}`
          }
        }
      ];
      if (criticalAlerts.length > 0) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Critical Items:*\n${criticalAlerts.map(a => `• ${a.sku}: ${a.currentStock} units`).join('\n')}`
          }
        });
      }
      if (warningAlerts.length > 0) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Warning Items:*\n${warningAlerts.map(a => `• ${a.sku}: ${a.currentStock} units`).join('\n')}`
          }
        });
      }
      await sendSlackAlert(this.config.slack.webhookUrl, blocks);
      console.log('✅ [Inventory Alerts] Slack alert sent successfully');
    } catch (error) {
      console.error('❌ [Inventory Alerts] Slack alert failed:', error.message);
    }
  }

  /**
   * Log alerts for dashboard display
   */
  async logAlerts(alerts) {
    // Store alerts in memory for dashboard display
    // In production, you'd store this in a database
    this.recentAlerts = alerts.map(alert => ({
      ...alert,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    }));

    // Keep only last 100 alerts
    if (this.recentAlerts.length > 100) {
      this.recentAlerts = this.recentAlerts.slice(-100);
    }
  }

  /**
   * Get recent alerts for dashboard
   */
  getRecentAlerts(limit = 20) {
    return (this.recentAlerts || []).slice(-limit);
  }

  /**
   * Set custom thresholds for a product
   */
  setProductThreshold(sku, threshold) {
    if (!this.productThresholds) {
      this.productThresholds = {};
    }
    this.productThresholds[sku] = threshold;
    console.log(`📊 [Inventory Alerts] Set threshold for ${sku}: ${threshold}`);
  }

  /**
   * Get threshold for a specific product
   */
  getProductThreshold(sku) {
    return this.productThresholds?.[sku] || this.config.thresholds.warning;
  }
}

export default InventoryAlertsService; 