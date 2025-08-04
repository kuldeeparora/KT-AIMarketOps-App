/**
 * Security utilities for Kent Traders Platform
 */

export class SecurityManager {
  private static sessions = new Map<string, any>();

  static validateSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  static log(event: string, userId: string, details: Record<string, any> = {}, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      userId,
      severity,
      details: {
        ip: details.ip || 'unknown',
        userAgent: details.userAgent || 'unknown'
      }
    };

    console.log('[AUDIT]', JSON.stringify(logEntry));

    if (severity === 'critical') {
      this.alertSecurity(logEntry);
    }
  }

  private static alertSecurity(logEntry: any): void {
    console.warn('[SECURITY ALERT]', logEntry);
  }

  static classifyData(data: unknown): 'public' | 'internal' | 'confidential' | 'restricted' {
    const sensitiveFields = [
      'password', 'ssn', 'creditCard', 'bankAccount'
    ];

    const confidentialFields = [
      'email', 'phone', 'address', 'personalInfo'
    ];

    if (typeof data === 'object' && data !== null) {
      const hasRestrictedData = sensitiveFields.some(field =>
        JSON.stringify(data).toLowerCase().includes(field)
      );

      const hasConfidentialData = confidentialFields.some(field =>
        JSON.stringify(data).toLowerCase().includes(field)
      );

      if (hasRestrictedData) return 'restricted';
      if (hasConfidentialData) return 'confidential';
    }

    return 'public';
  }

  static maskSensitiveData(data: unknown, classification: string): unknown {
    if (classification === 'public') return data;

    if (typeof data === 'object' && data !== null) {
      return {
        ...data
      };
    }

    return data;
  }
}

export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin'
};
