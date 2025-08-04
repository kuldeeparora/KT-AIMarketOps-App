// configUtils.js
/**
 * Load configuration from environment or defaults
 */
export function getConfig(overrides = {}) {
  return {
    email: {
      host: overrides.email?.host || process.env.SMTP_HOST || 'smtp.gmail.com',
      port: overrides.email?.port || process.env.SMTP_PORT || 587,
      secure: overrides.email?.secure || false,
      auth: {
        user: overrides.email?.user || process.env.SMTP_USER,
        pass: overrides.email?.pass || process.env.SMTP_PASS
      }
    },
    slack: {
      webhookUrl: overrides.slack?.webhookUrl || process.env.SLACK_WEBHOOK_URL
    },
    thresholds: overrides.thresholds || {
      critical: 5,
      warning: 15,
      healthy: 50
    },
    ...overrides
  };
}
