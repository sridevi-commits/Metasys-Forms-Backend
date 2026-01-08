// src/routes/formRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import submissionService from '../services/submissionService';
import { rateLimiter } from '../middleware/rateLimiter';
import { validateEmail } from '../utils/validator';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// -------------------- Validation Functions --------------------

const validateContactForm = (data: any) => {
  const errors: any[] = [];

  if (!data.firstName || data.firstName.length < 1) {
    errors.push({ path: 'firstName', message: 'First name is required' });
  }
  if (!data.lastName || data.lastName.length < 1) {
    errors.push({ path: 'lastName', message: 'Last name is required' });
  }
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ path: 'email', message: 'Invalid email address' });
  }
  if (!data.message || data.message.length < 10) {
    errors.push({ path: 'message', message: 'Message must be at least 10 characters' });
  }

  return errors;
};

const validateProposalForm = (data: any) => {
  const errors: any[] = [];

  if (!data.firstName || data.firstName.length < 1) {
    errors.push({ path: 'firstName', message: 'First name is required' });
  }
  if (!data.lastName || data.lastName.length < 1) {
    errors.push({ path: 'lastName', message: 'Last name is required' });
  }
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ path: 'email', message: 'Invalid email address' });
  }
  if (!data.projectType || data.projectType.length < 1) {
    errors.push({ path: 'projectType', message: 'Project type is required' });
  }
  if (!data.description || data.description.length < 20) {
    errors.push({ path: 'description', message: 'Description must be at least 20 characters' });
  }

  return errors;
};

const validateNewsletterForm = (data: any) => {
  const errors: any[] = [];

  if (!data.email || !validateEmail(data.email)) {
    errors.push({ path: 'email', message: 'Invalid email address' });
  }

  return errors;
};

// -------------------- Contact Form --------------------
router.post('/contact', rateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validateContactForm(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const ipAddress = (req.ip || req.connection.remoteAddress || 'unknown').replace('::ffff:', '');
    const userAgent = req.get('user-agent');

    const submission = await submissionService.createContactSubmission(
      req.body,
      ipAddress,
      userAgent
    );

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Contact form submitted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// -------------------- Proposal Form --------------------
router.post(
  '/proposal',
  upload.single('resume'),
  rateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validateProposalForm(req.body);

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors,
        });
      }

      const ipAddress = (req.ip || req.connection.remoteAddress || 'unknown').replace(
        '::ffff:',
        ''
      );
      const userAgent = req.get('user-agent');

      const submission = await submissionService.createProposalSubmission(
        req.body,
        ipAddress,
        userAgent,
        req.file
      );

      res.status(201).json({
        success: true,
        data: submission,
        message: 'Proposal submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// -------------------- Newsletter --------------------
router.post('/newsletter', rateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validateNewsletterForm(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const ipAddress = (req.ip || req.connection.remoteAddress || 'unknown').replace('::ffff:', '');
    const userAgent = req.get('user-agent');

    const subscription = await submissionService.createNewsletterSubscription(
      req.body,
      ipAddress,
      userAgent
    );

    res.status(201).json({
      success: true,
      data: subscription,
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Email already subscribed') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
});

// -------------------- Newsletter Unsubscribe --------------------
router.post('/newsletter/unsubscribe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required',
      });
    }

    await submissionService.unsubscribeNewsletter(email);

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
