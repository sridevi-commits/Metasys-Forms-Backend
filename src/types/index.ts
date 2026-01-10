export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  honeypot?: string;
}

export interface ProposalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  description: string;
  message?: string;
  honeypot?: string;
}

export interface NewsletterFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  honeypot?: string;
}

export interface EmailConfig {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface SubmissionData {
  ipAddress: string;
  userAgent?: string;
  formType: 'contact' | 'proposal' | 'newsletter';
  data: ContactFormData | ProposalFormData | NewsletterFormData;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface RateLimitInfo {
  remaining: number;
  reset: Date;
  total: number;
}