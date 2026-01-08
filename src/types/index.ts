// src/types/index.ts
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export interface ProposalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  description: string;
  // ❌ DO NOT include timeline here
}

export interface NewsletterFormData {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface ProposalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  description: string;
  timeline?: string; // ✅ Now you can add this
}
