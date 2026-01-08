// src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  db: Number(process.env.REDIS_DB) || 0,
});

redisClient.on('connect', () => {
  console.log('✓ Redis connected');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `rate_limit:${ip}`;
  const limit = 100; // Max requests
  const window = 60 * 60; // 1 hour in seconds

  try {
    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, window);
    }

    if (current > limit) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    }

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    next(); // Continue on error to avoid blocking legitimate requests
  }
};

export default redisClient;
