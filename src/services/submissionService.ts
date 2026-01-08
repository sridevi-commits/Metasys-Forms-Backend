// src/services/submissionService.ts
import prisma from '../config/database';
import emailService from './emailService';
import storageService from './storageService';
import { ContactFormData, ProposalFormData, NewsletterFormData } from '../types';

class SubmissionService {
  // -------------------- Contact Form --------------------
  async createContactSubmission(data: ContactFormData, ipAddress: string, userAgent?: string) {
    const submission = await prisma.contact_submissions.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        message: data.message,
        ipAddress,
        userAgent: userAgent || null,
      },
    });

    await emailService.sendContactEmail(data, {
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });

    return submission;
  }

  // -------------------- Proposal Form --------------------
  async createProposalSubmission(
    data: ProposalFormData,
    ipAddress: string,
    userAgent?: string,
    file?: Express.Multer.File
  ) {
    let resumeUrl: string | undefined;
    if (file) {
      resumeUrl = await storageService.uploadFile(file);
    }

    const submission = await prisma.proposal_submissions.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        projectType: data.projectType,
        description: data.description,
        timeline: data.timeline || null, // ✅ Now this works
        resumeUrl: resumeUrl || null,
        ipAddress,
        userAgent: userAgent || null,
      },
    });
    await emailService.sendProposalEmail(
      data,
      { ipAddress, userAgent, timestamp: new Date() },
      resumeUrl
    );

    return submission;
  }

  // -------------------- Newsletter --------------------
  async createNewsletterSubscription(
    data: NewsletterFormData,
    ipAddress: string,
    userAgent?: string
  ) {
    const existing = await prisma.newsletter_subscriptions.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('Email already subscribed');
    }

    const subscription = await prisma.newsletter_subscriptions.create({
      data: {
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        ipAddress,
        userAgent: userAgent || null,
      },
    });

    await emailService.sendNewsletterConfirmation(data.email);
    return subscription;
  }

  async unsubscribeNewsletter(email: string) {
    return prisma.newsletter_subscriptions.update({
      where: { email },
      data: { isActive: false },
    });
  }

  // -------------------- Getters --------------------
  async getAllContactSubmissions() {
    return await prisma.contact_submissions.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllProposalSubmissions() {
    return await prisma.proposal_submissions.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllNewsletterSubscriptions() {
    return await prisma.newsletter_subscriptions.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // -------------------- Background Job --------------------
  async retryFailedSubmissions() {
    // stub for background retry
    console.log('Retrying failed submissions...');
    return [];
  }
}

export default new SubmissionService();
