// notificationUtils.js
import nodemailer from 'nodemailer';

/**
 * Create a nodemailer transporter from config
 */
export function createTransporter(emailConfig) {
  return nodemailer.createTransport(emailConfig);
}

/**
 * Send an email using a transporter
 */
export async function sendEmail({ transporter, from, to, subject, html }) {
  return transporter.sendMail({ from, to, subject, html });
}

/**
 * Send a Slack alert via webhook
 */
export async function sendSlackAlert(webhookUrl, blocks) {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks })
  });
}
