"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/unit/helpers.test.ts
const helpers_1 = require("../../src/utils/helpers");
describe('Helper Functions', () => {
    test('formatFileSize should format bytes correctly', () => {
        expect((0, helpers_1.formatFileSize)(0)).toBe('0 Bytes');
        expect((0, helpers_1.formatFileSize)(1024)).toBe('1 KB');
        expect((0, helpers_1.formatFileSize)(1048576)).toBe('1 MB');
    });
    test('truncate should truncate long strings', () => {
        expect((0, helpers_1.truncate)('Hello World', 5)).toBe('Hello...');
        expect((0, helpers_1.truncate)('Short', 10)).toBe('Short');
    });
    test('sanitizeHtml should escape HTML characters', () => {
        expect((0, helpers_1.sanitizeHtml)('<script>alert("xss")</script>'))
            .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });
});
//# sourceMappingURL=helpers.test.js.map