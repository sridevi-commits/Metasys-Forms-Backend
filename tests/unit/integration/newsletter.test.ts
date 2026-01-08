// tests/unit/integration/newsletter.test.ts
import request from 'supertest';
import app from '../../../src/server';
import prisma from '../../../src/config/database';
import emailService from '../../../src/services/emailService';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  __esModule: true,
  default: {
    newsletter_subscriptions: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $disconnect: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock email service
jest.mock('../../../src/services/emailService', () => ({
  __esModule: true,
  default: {
    sendNewsletterConfirmation: jest.fn(),
  },
}));

describe('Newsletter Form Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('Subscribe new user', async () => {
    const mockSubscription = {
      id: 1,
      email: 'john@example.com',
      firstName: null,
      lastName: null,
      isActive: true,
      ipAddress: '127.0.0.1',
      userAgent: 'jest-test',
      createdAt: new Date(),
    };

    (prisma.newsletter_subscriptions.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.newsletter_subscriptions.create as jest.Mock).mockResolvedValue(mockSubscription);
    (emailService.sendNewsletterConfirmation as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/forms/newsletter')
      .send({ email: 'john@example.com' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(prisma.newsletter_subscriptions.create).toHaveBeenCalled();
  });

  test('Reject invalid email', async () => {
    const res = await request(app)
      .post('/api/forms/newsletter')
      .send({ email: 'invalid-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  test('Unsubscribe user', async () => {
    const mockUnsubscribe = {
      id: 1,
      email: 'john@example.com',
      isActive: false,
      createdAt: new Date(),
    };

    (prisma.newsletter_subscriptions.update as jest.Mock).mockResolvedValue(mockUnsubscribe);

    const res = await request(app)
      .post('/api/forms/newsletter/unsubscribe')
      .send({ email: 'john@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(prisma.newsletter_subscriptions.update).toHaveBeenCalled();
  });
});