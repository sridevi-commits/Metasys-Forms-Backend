import * as postmark from 'postmark';
import {
  ContactFormData,
  ProposalFormData,
  NewsletterFormData,
  EmailConfig,
} from '../types';

class EmailService {
  private fromEmail = process.env.FROM_EMAIL || 'sridevi@metasysglobal.com';
  private contactEmail =
    process.env.CONTACT_EMAIL || 'contact@metasysglobal.com';
  private proposalEmail =
    process.env.PROPOSAL_EMAIL || 'proposals@metasysglobal.com';
  private newsletterEmail =
    process.env.NEWSLETTER_EMAIL || 'newsletter@metasysglobal.com';

  /* =======================
     Postmark Client
     ======================= */
  private getPostmarkClient(): postmark.ServerClient {
    const apiKey = process.env.POSTMARK_API_KEY?.trim();

    if (!apiKey) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          '⚠️ Postmark API key missing — email sending disabled (dev mode)'
        );
        throw new Error('POSTMARK_DISABLED');
      }

      throw new Error('Postmark API key missing in production');
    }

    return new postmark.ServerClient(apiKey);
  }

  /* =======================
     Public Email APIs
     ======================= */

  async sendContactEmail(
    data: ContactFormData,
    metadata: any
  ): Promise<void> {
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

  async sendNewsletterBackup(
    data: NewsletterFormData,
    metadata: any
  ): Promise<void> {
    const html = this.formatNewsletterEmail(data, metadata);

    await this.sendEmail({
      to: this.newsletterEmail,
      subject: `New Newsletter Subscription - ${data.email}`,
      text: JSON.stringify(data, null, 2),
      html,
    });
  }

  async sendNewsletterConfirmation(email: string): Promise<void> {
  // Skip confirmation email in development/sandbox mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`📧 Newsletter confirmation email skipped (dev mode) for: ${email}`);
    return;
  }

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

  /* =======================
     Core Sender
     ======================= */
  private async sendEmail(config: EmailConfig): Promise<void> {
    let client: postmark.ServerClient;

    try {
      client = this.getPostmarkClient();
    } catch (err: any) {
      if (err.message === 'POSTMARK_DISABLED') {
        console.log('📧 Email preview (dev):');
        console.log(`To: ${config.to}`);
        console.log(`Subject: ${config.subject}`);
        return;
      }
      throw err;
    }

    try {
      await client.sendEmail({
        From: this.fromEmail,
        To: config.to,
        Subject: config.subject,
        TextBody: config.text,
        HtmlBody: config.html,
        MessageStream: 'outbound',
      });

      console.log(`✅ Email successfully sent → ${config.to}`);
    } catch (error: any) {
      console.error('❌ Postmark send failed:', error.message);
      throw new Error(`Email send failed: ${error.message}`);
    }
  }

  /* =======================
     Email Templates
     ======================= */

  private formatContactEmail(
    data: ContactFormData,
    metadata: any
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; color: #333; }
    .container { max-width: 600px; margin: auto; }
    .header { background: #0066cc; color: #fff; padding: 16px; }
    .content { background: #f9f9f9; padding: 16px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; }
    .meta { font-size: 12px; margin-top: 16px; color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field"><span class="label">Name:</span> ${data.firstName} ${data.lastName}</div>
      <div class="field"><span class="label">Email:</span> ${data.email}</div>
      ${data.phone ? `<div class="field"><span class="label">Phone:</span> ${data.phone}</div>` : ''}
      ${data.company ? `<div class="field"><span class="label">Company:</span> ${data.company}</div>` : ''}
      <div class="field"><span class="label">Message:</span> ${data.message}</div>

      <div class="meta">
        IP: ${metadata.ipAddress}<br/>
        Time: ${new Date(metadata.timestamp).toLocaleString()}<br/>
        Agent: ${metadata.userAgent || 'N/A'}
      </div>
    </div>
  </div>
</body>
</html>
`;
  }

  private formatProposalEmail(
    data: ProposalFormData,
    metadata: any,
    resumeUrl?: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<body>
  <h2>New Proposal Request</h2>
  <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Company:</strong> ${data.company}</p>
  <p><strong>Project Type:</strong> ${data.projectType}</p>
  ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
  ${data.timeline ? `<p><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
  <p><strong>Description:</strong> ${data.description}</p>
  ${resumeUrl ? `<p><a href="${resumeUrl}">Download Attachment</a></p>` : ''}
  <hr/>
  <small>IP: ${metadata.ipAddress} | ${new Date(metadata.timestamp).toLocaleString()}</small>
</body>
</html>
`;
  }

  private formatNewsletterEmail(
    data: NewsletterFormData,
    metadata: any
  ): string {
    return `
<!DOCTYPE html>
<html>
<body>
  <h2>New Newsletter Subscription</h2>
  <p><strong>Email:</strong> ${data.email}</p>
  ${data.firstName ? `<p>First Name: ${data.firstName}</p>` : ''}
  ${data.lastName ? `<p>Last Name: ${data.lastName}</p>` : ''}
  <hr/>
  <small>IP: ${metadata.ipAddress} | ${new Date(metadata.timestamp).toLocaleString()}</small>
</body>
</html>
`;
  }
}

export default new EmailService();
