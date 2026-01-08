// tests/unit/integration/contact.test.ts
import request from 'supertest';
import app from '../../../src/server';
import prisma from '../../../src/config/database';
import emailService from '../../../src/services/emailService';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  __esModule: true,
  default: {
    contact_submissions: {
      create: jest.fn(),
    },
    $disconnect: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock email service
jest.mock('../../../src/services/emailService', () => ({
  __esModule: true,
  default: {
    sendContactEmail: jest.fn(),
  },
}));

describe('Contact Form Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('POST /api/forms/contact - should submit valid contact form', async () => {
    // Mock successful database creation
    const mockContactData = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: null,
      company: null,
      message: 'Test message with enough characters',
      ipAddress: '127.0.0.1',
      userAgent: 'jest-test',
      createdAt: new Date(),
    };

    (prisma.contact_submissions.create as jest.Mock).mockResolvedValue(mockContactData);

    // Mock successful email sending
    (emailService.sendContactEmail as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/forms/contact')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Test message with enough characters',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(prisma.contact_submissions.create).toHaveBeenCalled();
  });

  test('POST /api/forms/contact - should reject invalid email', async () => {
    const response = await request(app)
      .post('/api/forms/contact')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        message: 'Test message',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.some((e: any) => e.path === 'email')).toBe(true);
  });

  test('POST /api/forms/contact - should reject missing required fields', async () => {
    const response = await request(app)
      .post('/api/forms/contact')
      .send({
        email: 'john@example.com',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
  });
});