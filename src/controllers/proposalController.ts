import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import submissionService from '../services/submissionService';
import { ProposalFormData } from '../types';

export const submitProposalForm = asyncHandler(async (req: Request, res: Response) => {
  const data: ProposalFormData = req.body;

  // Basic validations
  const errors: string[] = [];
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email address');
  }
  if (!data.firstName) errors.push('First name is required');
  if (!data.lastName) errors.push('Last name is required');
  if (!data.projectType) errors.push('Project type is required');
  if (!data.description) errors.push('Description is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';
  const file = req.file; // File | undefined

  let submission;
  try {
    submission = await submissionService.createProposalSubmission(data, ipAddress, userAgent, file);
  } catch (err: any) {
    console.error('Proposal submission error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit proposal form. Please try again later.',
    });
  }

  res.status(201).json({
    success: true,
    message: 'Proposal form submitted successfully',
    data: {
      id: submission.id,
      timestamp: submission.createdAt,
      hasResume: !!submission.resumeUrl,
    },
  });
});
