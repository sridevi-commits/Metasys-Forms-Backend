// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  // AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Prisma DB errors
  if ((err as any).name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      message: 'Database operation failed',
      ...(process.env.NODE_ENV === 'development' && { error: err.message }),
    });
  }

  // Validation errors
  if ((err as any).name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      ...(process.env.NODE_ENV === 'development' && { error: err.message }),
    });
  }

  // Default fallback error
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack }),
  });
};

// Async handler utility for controllers
export const asyncHandler = (fn: Function) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(_req, res, next)).catch(next);
  };
};
