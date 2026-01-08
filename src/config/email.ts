// src/config/email.ts
// Alternative SMTP configuration (if not using Postmark)

import nodemailer from 'nodemailer';

const usePostmark = process.env.POSTMARK_API_KEY !== undefined;

// SMTP transporter (for Gmail, SendGrid, etc.)
const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test connection
if (!usePostmark && process.env.SMTP_USER) {
  smtpTransporter.verify((error, success) => {
    if (error) {
      console.error('SMTP connection error:', error);
    } else {
      console.log('✓ SMTP server ready');
    }
  });
}

export { smtpTransporter };

// Email configuration interface
export interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

// Send email using SMTP
export const sendEmailViaSMTP = async (config: EmailConfig): Promise<void> => {
  try {
    await smtpTransporter.sendMail({
      from: config.from,
      to: config.to,
      subject: config.subject,
      text: config.text,
      html: config.html,
      attachments: config.attachments,
    });
    console.log(`Email sent to ${config.to} via SMTP`);
  } catch (error) {
    console.error('SMTP email error:', error);
    throw new Error(`Failed to send email via SMTP: ${error}`);
  }
};
