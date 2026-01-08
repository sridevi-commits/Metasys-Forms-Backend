"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/setup.ts
const database_1 = __importDefault(require("../src/config/database"));
// Close database connections after all tests
afterAll(async () => {
    await database_1.default.$disconnect();
});
// Increase timeout for integration tests
jest.setTimeout(10000);
//# sourceMappingURL=setup.js.map