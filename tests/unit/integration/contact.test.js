"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../src/server"));
const database_1 = __importDefault(require("../../../src/config/database"));
const emailService_1 = __importDefault(require("../../../src/services/emailService"));
// Mock the services
jest.mock('../../../src/config/database', () => ({
    __esModule: true,
    default: {
        contact_submissions: {
            create: jest.fn(),
        },
    },
}));
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
    test('POST /api/forms/contact - should submit valid contact form', async () => {
        // Mock successful database creation
        database_1.default.contact_submissions.create.mockResolvedValue({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            message: 'Test message with enough characters',
            createdAt: new Date(),
        });
        // Mock successful email sending
        emailService_1.default.sendContactEmail.mockResolvedValue(true);
        const response = await (0, supertest_1.default)(server_1.default)
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
    });
    test('POST /api/forms/contact - should reject invalid email', async () => {
        const response = await (0, supertest_1.default)(server_1.default)
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
        expect(response.body.errors.some((e) => e.path === 'email')).toBe(true);
    });
    test('POST /api/forms/contact - should reject missing required fields', async () => {
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/api/forms/contact')
            .send({
            email: 'john@example.com',
        });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errors).toBeDefined();
    });
});
//# sourceMappingURL=contact.test.js.map