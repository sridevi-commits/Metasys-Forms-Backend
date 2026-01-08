// src/config/redis.ts
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  db: Number(process.env.REDIS_DB),
  // disable persistence in test environment
  enableOfflineQueue: process.env.NODE_ENV !== 'test',
});

redis.on('connect', () => {
  console.log('✓ Redis connected');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export default redis;
