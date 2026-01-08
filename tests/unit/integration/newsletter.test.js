"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../src/server"));
const database_1 = __importDefault(require("../../../src/config/database"));
const emailService_1 = __importDefault(require("../../../src/services/emailService"));
jest.mock('../../../src/config/database', () => ({
    __esModule: true,
    default: {
        newsletter_subscriptions: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));
jest.mock('../../../src/services/emailService', () => ({
    __esModule: true,
    default: { sendNewsletterConfirmation: jest.fn() },
}));
describe('Newsletter Form Integration', () => {
    beforeEach(() => jest.clearAllMocks());
    test('Subscribe new user', async () => {
        database_1.default.newsletter_subscriptions.findUnique.mockResolvedValue(null);
        database_1.default.newsletter_subscriptions.create.mockResolvedValue({
            id: 1, email: 'john@example.com', createdAt: new Date(),
        });
        emailService_1.default.sendNewsletterConfirmation.mockResolvedValue(true);
        const res = await (0, supertest_1.default)(server_1.default).post('/api/forms/newsletter').send({ email: 'john@example.com' });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
    });
    test('Reject invalid email', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/api/forms/newsletter').send({ email: 'invalid-email' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
    test('Unsubscribe user', async () => {
        database_1.default.newsletter_subscriptions.update.mockResolvedValue({
            id: 1, email: 'john@example.com', isActive: false,
        });
        const res = await (0, supertest_1.default)(server_1.default).post('/api/forms/newsletter/unsubscribe').send({ email: 'john@example.com' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
//# sourceMappingURL=newsletter.test.js.map