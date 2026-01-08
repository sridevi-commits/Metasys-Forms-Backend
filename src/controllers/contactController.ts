// src/controllers/contactController.ts
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import submissionService from '../services/submissionService';
import { ContactFormData } from '../types';

export const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
  const data: ContactFormData = req.body;
  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  const submission = await submissionService.createContactSubmission(data, ipAddress, userAgent);

  res.status(201).json({
    success: true,
    message: 'Contact form submitted successfully',
    data: {
      id: submission.id,
      timestamp: submission.createdAt,
    },
  });
});
