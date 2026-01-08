"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/unit/integration/proposal.test.ts
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../src/server"));
const database_1 = __importDefault(require("../../../src/config/database"));
const emailService_1 = __importDefault(require("../../../src/services/emailService"));
// Remove unused import of storageService
// Mock database methods
jest.mock('../../../src/config/database', () => ({
    __esModule: true,
    default: {
        proposal_submissions: {
            create: jest.fn(),
        },
    },
}));
// Mock email service
jest.mock('../../../src/services/emailService', () => ({
    __esModule: true,
    default: {
        sendProposalEmail: jest.fn(),
    },
}));
describe('Proposal Form Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('POST /api/forms/proposal - submit valid proposal', async () => {
        database_1.default.proposal_submissions.create.mockResolvedValue({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            projectType: 'Web Development',
            description: 'This is a detailed description of the project with more than 20 characters',
            createdAt: new Date(),
        });
        emailService_1.default.sendProposalEmail.mockResolvedValue(true);
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/forms/proposal')
            .send({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            projectType: 'Web Development',
            description: 'This is a detailed description of the project with more than 20 characters',
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
    });
    test('POST /api/forms/proposal - reject invalid email', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/forms/proposal')
            .send({
            firstName: 'John',
            lastName: 'Doe',
            email: 'invalid-email',
            projectType: 'Web Development',
            description: 'Some description',
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toBeDefined();
    });
});
//# sourceMappingURL=proposal.test.js.map