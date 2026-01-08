// tests/unit/integration/proposal.test.ts
import request from 'supertest';
import app from '../../../src/server';
import prisma from '../../../src/config/database';
import emailService from '../../../src/services/emailService';
import storageService from '../../../src/services/storageService';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  __esModule: true,
  default: {
    proposal_submissions: {
      create: jest.fn(),
    },
    $disconnect: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock email service
jest.mock('../../../src/services/emailService', () => ({
  __esModule: true,
  default: {
    sendProposalEmail: jest.fn(),
  },
}));

// Mock storage service
jest.mock('../../../src/services/storageService', () => ({
  __esModule: true,
  default: {
    uploadFile: jest.fn(),
  },
}));

describe('Proposal Form Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('POST /api/forms/proposal - submit valid proposal', async () => {
    const mockProposalData = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      projectType: 'Web Development',
      description: 'This is a comprehensive and detailed description of the web development project that clearly exceeds the minimum character requirement',
      createdAt: new Date(),
      phone: null,
      company: null,
      resumeUrl: null,
      ipAddress: '::ffff:127.0.0.1',
      userAgent: 'node-superagent/3.8.3',
    };

    (prisma.proposal_submissions.create as jest.Mock).mockResolvedValue(mockProposalData);
    (emailService.sendProposalEmail as jest.Mock).mockResolvedValue(undefined);
    (storageService.uploadFile as jest.Mock).mockResolvedValue(null);

    const requestData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      projectType: 'Web Development',
      description: 'This is a comprehensive and detailed description of the web development project that clearly exceeds the minimum character requirement',
    };

    console.log('Sending request with data:', requestData);

    const res = await request(app)
      .post('/api/forms/proposal')
      .send(requestData);

    // Detailed logging for debugging
    console.log('Response Status:', res.status);
    console.log('Response Body:', JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(prisma.proposal_submissions.create).toHaveBeenCalled();
  });

  test('POST /api/forms/proposal - reject invalid email', async () => {
    const res = await request(app)
      .post('/api/forms/proposal')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        projectType: 'Web Development',
        description: 'This is a comprehensive and detailed description of the web development project that clearly exceeds the minimum character requirement',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });
});