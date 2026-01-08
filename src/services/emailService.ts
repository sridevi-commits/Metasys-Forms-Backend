// src/services/emailService.ts
import * as postmark from 'postmark';
import { ContactFormData, ProposalFormData, NewsletterFormData, EmailConfig } from '../types';

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY || '');

class EmailService {
  private fromEmail = process.env.FROM_EMAIL || 'noreply@metasys.com';
  private contactEmail = process.env.CONTACT_EMAIL || 'contact@metasys.com';
  private proposalEmail = process.env.PROPOSAL_EMAIL || 'proposals@metasys.com';
  private newsletterEmail = process.env.NEWSLETTER_EMAIL || 'newsletter@metasys.com';

  async sendContactEmail(data: ContactFormData, metadata: any): Promise<void> {
    const html = this.formatContactEmail(data, metadata);

    await this.sendEmail({
      to: this.contactEmail,
      subject: `New Contact Form Submission - ${data.firstName} ${data.lastName}`,
      text: JSON.stringify(data, null, 2),
      html,
    });
  }

  async sendProposalEmail(
    data: ProposalFormData,
    metadata: any,
    resumeUrl?: string
  ): Promise<void> {
    const html = this.formatProposalEmail(data, metadata, resumeUrl);

    await this.sendEmail({
      to: this.proposalEmail,
      subject: `New Proposal Request - ${data.company}`,
      text: JSON.stringify(data, null, 2),
      html,
    });
  }

  async sendNewsletterBackup(data: NewsletterFormData, metadata: any): Promise<void> {
    const html = this.formatNewsletterEmail(data, metadata);

    await this.sendEmail({
      to: this.newsletterEmail,
      subject: `New Newsletter Subscription - ${data.email}`,
      text: JSON.stringify(data, null, 2),
      html,
    });
  }

  async sendNewsletterConfirmation(email: string): Promise<void> {
    const html = `
      <h2>Welcome to Metasys Newsletter!</h2>
      <p>Thank you for subscribing to our newsletter.</p>
      <p>You'll receive updates about our latest projects and insights.</p>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to Metasys Newsletter',
      text: 'Thank you for subscribing to our newsletter.',
      html,
    });
  }

  private async sendEmail(config: EmailConfig): Promise<void> {
    try {
      await client.sendEmail({
        From: this.fromEmail,
        To: config.to,
        Subject: config.subject,
        TextBody: config.text,
        HtmlBody: config.html,
        MessageStream: 'outbound',
      });
      console.log(`Email sent to ${config.to}`);
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  private formatContactEmail(data: ContactFormData, metadata: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; }
          .metadata { background: #e9ecef; padding: 10px; margin-top: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.firstName} ${data.lastName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            ${
              data.phone
                ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
            `
                : ''
            }
            ${
              data.company
                ? `
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${data.company}</div>
            </div>
            `
                : ''
            }
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message}</div>
            </div>
            <div class="metadata">
              <strong>Submission Details:</strong><br>
              IP Address: ${metadata.ipAddress}<br>
              Timestamp: ${new Date(metadata.timestamp).toLocaleString()}<br>
              User Agent: ${metadata.userAgent || 'N/A'}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private formatProposalEmail(data: ProposalFormData, metadata: any, resumeUrl?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; }
          .metadata { background: #e9ecef; padding: 10px; margin-top: 20px; font-size: 12px; }
          .resume-link { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Proposal Request</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.firstName} ${data.lastName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${data.company}</div>
            </div>
            <div class="field">
              <div class="label">Project Type:</div>
              <div class="value">${data.projectType}</div>
            </div>
            ${
              data.budget
                ? `
            <div class="field">
              <div class="label">Budget:</div>
              <div class="value">${data.budget}</div>
            </div>
            `
                : ''
            }
            ${
              data.timeline
                ? `
            <div class="field">
              <div class="label">Timeline:</div>
              <div class="value">${data.timeline}</div>
            </div>
            `
                : ''
            }
            <div class="field">
              <div class="label">Description:</div>
              <div class="value">${data.description}</div>
            </div>
            ${
              resumeUrl
                ? `
            <div class="field">
              <div class="label">Resume/Document:</div>
              <div class="value">
                <a href="${resumeUrl}" class="resume-link">Download File</a>
              </div>
            </div>
            `
                : ''
            }
            <div class="metadata">
              <strong>Submission Details:</strong><br>
              IP Address: ${metadata.ipAddress}<br>
              Timestamp: ${new Date(metadata.timestamp).toLocaleString()}<br>
              User Agent: ${metadata.userAgent || 'N/A'}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private formatNewsletterEmail(data: NewsletterFormData, metadata: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6c757d; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; }
          .metadata { background: #e9ecef; padding: 10px; margin-top: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Newsletter Subscription</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            ${
              data.firstName
                ? `
            <div class="field">
              <div class="label">First Name:</div>
              <div class="value">${data.firstName}</div>
            </div>
            `
                : ''
            }
            ${
              data.lastName
                ? `
            <div class="field">
              <div class="label">Last Name:</div>
              <div class="value">${data.lastName}</div>
            </div>
            `
                : ''
            }
            <div class="metadata">
              <strong>Subscription Details:</strong><br>
              IP Address: ${metadata.ipAddress}<br>
              Timestamp: ${new Date(metadata.timestamp).toLocaleString()}<br>
              User Agent: ${metadata.userAgent || 'N/A'}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
