"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/unit/validator.test.ts
const helpers_1 = require("../../src/utils/helpers");
describe('Validator Tests', () => {
    describe('Email Validation', () => {
        test('should validate correct emails', () => {
            expect((0, helpers_1.isValidEmail)('test@example.com')).toBe(true);
            expect((0, helpers_1.isValidEmail)('user.name@domain.co.uk')).toBe(true);
        });
        test('should reject invalid emails', () => {
            expect((0, helpers_1.isValidEmail)('invalid-email')).toBe(false);
            expect((0, helpers_1.isValidEmail)('@example.com')).toBe(false);
            expect((0, helpers_1.isValidEmail)('test@')).toBe(false);
            expect((0, helpers_1.isValidEmail)('test.example.com')).toBe(false);
        });
    });
});
//# sourceMappingURL=validator.test.js.map