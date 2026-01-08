import { Request, Response } from 'express';
import submissionService from '../services/submissionService';
import { NewsletterFormData } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

export const subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const data: NewsletterFormData = req.body;

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return res.status(400).json({
      success: false,
      errors: ['Invalid email address'],
    });
  }

  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  const subscription = await submissionService.createNewsletterSubscription(
    data,
    ipAddress,
    userAgent
  );

  res.status(201).json({
    success: true,
    message: 'Newsletter subscription successful',
    data: {
      id: subscription.id,
      email: subscription.email,
      timestamp: subscription.createdAt,
    },
  });
});

export const unsubscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      errors: ['Email is required'],
    });
  }

  await submissionService.unsubscribeNewsletter(email);

  res.json({
    success: true,
    message: 'Successfully unsubscribed',
  });
});
