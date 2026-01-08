// tests/unit/helpers.test.ts
import { formatFileSize, truncate, sanitizeHtml } from '../../src/utils/helpers';

describe('Helper Functions', () => {
  test('formatFileSize should format bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
  });

  test('truncate should truncate long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
    expect(truncate('Short', 10)).toBe('Short');
  });

  test('sanitizeHtml should escape HTML characters', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });
});
