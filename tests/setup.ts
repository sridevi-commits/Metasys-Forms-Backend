// tests/setup.ts

// Mock Redis before any other imports
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
    del: jest.fn().mockResolvedValue(1),
    quit: jest.fn().mockResolvedValue('OK'),
    disconnect: jest.fn(),
    on: jest.fn(),
    status: 'ready',
  }));
});

// Mock MinIO
jest.mock('minio', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      bucketExists: jest.fn().mockResolvedValue(true),
      makeBucket: jest.fn().mockResolvedValue(undefined),
      putObject: jest.fn().mockResolvedValue({ etag: 'mock-etag' }),
      presignedGetObject: jest.fn().mockResolvedValue('https://mock-url.com/file'),
    })),
  };
});

// Increase timeout for integration tests
jest.setTimeout(10000);

// Cleanup function for afterAll
global.afterAll(async () => {
  // Allow time for async operations to complete
  await new Promise((resolve) => setTimeout(resolve, 500));
});